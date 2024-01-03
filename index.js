/**
 * @file index.js is the main file for an Express application that manages a to-do list. 
 * It handles user authentication, session management, and CRUD operations on todo items.
 */

/**
 * Starts the Express application on the specified port and connects to a MongoDB instance
 * to manage session data and to-do items. Sets up middleware for authentication, input
 * validation, serving static files, and managing sessions. Defines route handlers for user
 * authentication, to-do item manipulation, and session cleanup.
 */

import express from 'express';
import session from 'express-session';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import MongoStore from 'connect-mongo';

import { checkUserPassword } from './taskOperations/checkUserPass.js';
import { getTasks } from './taskOperations/getTasks.js';
import { addTask } from './taskOperations/addTask.js';
import { deleteTask } from './taskOperations/deleteTask.js';
import { registerUser } from './taskOperations/registerUser.js';

const app = express();
const port = process.env.PORT || 3000;

const uri = `mongodb+srv://user:${process.env['mongoPW']}@${process.env['mongoURI']}/?retryWrites=true&w=majority`;


app.set('view engine', 'pug'); // Set the view engine to Pug
app.use(express.urlencoded({ extended: true })); // Set up middleware for parsing POST requests
app.use(express.static('public')); // Serve static files from the 'public' directory

// Generate a random secret for the session for the lifespan of the server lifetime
// Each user has a unique session ID
const sessionSecret = process.env['SESSION_SECRET'] 

// Use connect-mongo for the session store
const mongoStore = MongoStore.create({
  mongoUrl: uri,
  collectionName: 'sessions',
  autoRemove: 'interval',
  autoRemoveInterval: 10 // Interval in minutes to check for expired sessions
});

// Set up session middleware
app.use(session({
  secret: sessionSecret,    
  resave: false,
  store: mongoStore,
  saveUninitialized: true,
  cookie: {
    maxAge: 3600000, // Expires after 1 hour (3600000 ms)
    secure: process.env.NODE_ENV === 'production', // Set secure to true if in production
    httpOnly: true, // Set HttpOnly to prevent access from client-side scripts
  },
}));

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

await client.connect();

/**
 * Middleware to ensure a user is authenticated before allowing access to certain routes.
 * If a user is authenticated, the next middleware is called; otherwise, the user is
 * redirected to the login page.
 *
 * @function ensureAuthenticated
 * @param {object} req - The request object from the Express.js route.
 * @param {object} res - The response object from the Express.js route.
 * @param {function} next - The callback function to continue to the next middleware.
 */

function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/login');
}

/**
 * Middleware to perform server-side validation for login input. It checks that both
 * username and password are strings and are not empty. If validation fails, it renders
 * the login page with an error, otherwise, it calls the next middleware.
 *
 * @function validateLoginInput
 * @param {object} req - The request object from the Express.js route.
 * @param {object} res - The response object from the Express.js route.
 * @param {function} next - The callback to continue processing the request.
 */

function validateLoginInput(req, res, next) {
  const { username, password } = req.body;
  if (!username || typeof username !== 'string' || !password || typeof password !== 'string') {
    return res.render('login', { error: 'Invalid input' });
  }
  next();
}

/**
 * Middleware to perform server-side validation for task input. It checks that the task name
 * is a string and not empty. If priority is provided, it also checks that it's a string. If
 * validation fails, it redirects to the home page, otherwise, it calls the next middleware.
 *
 * @function validateTaskInput
 * @param {object} req - The request object from the Express.js route.
 * @param {object} res - The response object from the Express.js route.
 * @param {function} next - The callback to continue processing the request.
 */

function validateTaskInput(req, res, next) {
  const { newTask, priority } = req.body;
  if (!newTask || typeof newTask !== 'string') {
    return res.redirect('/');
  }
  if (priority !== undefined && typeof newTask !== 'string') {
    return res.redirect('/');
  }
  next();
}

// Define routes
app.get('/login', (req, res) => {
  // Render a login form
  res.render('login');
});


app.get('/register', (req, res) => {
  res.redirect('/')  // Redirect to main page while we don't want any changes.
  // res.render('register');
});


// Commented out to stop new registrations

// app.post('/register', async (req, res) => {
//   const { username, password, confirm_password } = req.body;
//   if (!username || !password || !confirm_password) {
//     return res.render('register', { error: 'Please fill out all fields.' });
//   }
//   if (password !== confirm_password) {
//     return res.render('register', { error: 'Passwords do not match.' });
//   }
//   try {
//     const userExists = await client.db("toDo").collection("users").findOne({ username: username });
//     if (userExists) {
//       return res.render('register', { error: 'User already exists' });
//     }
//     const userId = await registerUser(client, username, password);
//     console.log(`Registered new user with ID: ${userId}`);
//     res.redirect('/login');
//   } catch (error) {
//     console.error('Error registering new user:', error);
//     res.status(500).send('An error occurred during registration');
//   }
// });


app.post('/login', validateLoginInput, (req, res) => {
  const userName = req.body.username;
  const inputPassword = req.body.password;

  checkUserPassword(client, userName, inputPassword)
    .then(passwordMatch => {
      if (passwordMatch) {
        // Authentication successful
        console.log(`User ${userName} authenticated successfully.`);
        req.session.user = { userName }; // Store user information in the session
        res.redirect('/');
      } else {
        // Authentication failed
        res.render('login', { error: 'Invalid username or password' });
      }
    })
    .catch(console.error);
});


app.get('/logout', (req, res) => {
  // Destroy the session to log the user out
  req.session.destroy(() => {
    res.redirect('/login');
  });
});


app.get('/', ensureAuthenticated, async (req, res) => {
  // Get the task list asynchronously and wait for it to complete
  try {
    const tasks = await getTasks(client, req.session.user.userName);
    // Render the task list or dashboard for authenticated users
    res.render('index', { user: req.session.user, tasks });
  } catch (error) {
    // Handle errors that might occur during getting tasks
    console.error('Error getting tasks:', error);
    res.status(500).send('An error occurred while getting the task list');
  }
});


app.post('/add-task', ensureAuthenticated, validateTaskInput, async (req, res) => {

  // Create a new task object
  const newTask = {
    user: req.session.user.userName,
    taskname: req.body.newTask,
    priority: req.body.priority,
  };

  await addTask(client, newTask);
  res.redirect('/');
});


app.post('/delete-task/:taskId', ensureAuthenticated, async (req, res) => {
  
  try {
      // Convert the taskId from a string to an ObjectId
      const objectId = new ObjectId(req.params.taskId);
      await deleteTask(client, objectId);
      res.redirect('/');
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).send('An error occurred while deleting the task');
    }
  });


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
