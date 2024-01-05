import express from 'express';
import { ensureAuthenticated, validateLoginInput, validateTaskInput } from './middleware.js';
import { ObjectId } from 'mongodb';
import { checkUserPassword } from './taskOperations/checkUserPass.js';
import { getTasks } from './taskOperations/getTasks.js';
import { addTask } from './taskOperations/addTask.js';
import { deleteTask } from './taskOperations/deleteTask.js';
import { registerUser } from './taskOperations/registerUser.js';
const router = express.Router();

/**
 * GET /login route to render a login form.
 */
router.get('/login', (req, res) => {
  res.render('login');
});

/**
 * GET /register route to redirect to the main page.
 * Registrations temporarily disabled. Full version commented out below.
 */
router.get('/register', (req, res) => {
  res.redirect('/'); // Redirect to the main page
});

// router.post('/register', (req, res) => {
//   const { username, password, confirm_password } = req.body;
//   if (!username || !password || !confirm_password) {
//     return res.render('register', { error: 'Please fill out all fields.' });
//   }
//   if (password !== confirm_password) {
//     return res.render('register', { error: 'Passwords do not match.' });
//   }
//   try {
//     const userExists = await req.client.db("toDo").collection("users").findOne({ username: username });
//     if (userExists) {
//       return res.render('register', { error: 'User already exists' });
//     }
//     const userId = await registerUser(req.client, username, password);
//     console.log(`Registered new user with ID: ${userId}`);
//     res.redirect('/login');
//   } catch (error) {
//     console.error('Error registering new user:', error);
//     res.status(500).send('An error occurred during registration');
//   }
// });

/**
 * POST /login route to authenticate a user.
 */
router.post('/login', validateLoginInput, async (req, res) => {
  const userName = req.body.username;
  const inputPassword = req.body.password;
  try {
    const passwordMatch = await checkUserPassword(req.client, userName, inputPassword);
    if (passwordMatch) {
      // Authentication successful
      req.session.user = { userName }; // Store user information in the session
      res.redirect('/');
    } else {
      // Authentication failed
      res.render('login', { error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('An error occurred during login');
  }
});

/**
 * GET /logout route to log out the user.
 */
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

/**
 * GET / route to display the user's tasks.
 */
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const tasks = await getTasks(req.client, req.session.user.userName);
    res.render('index', { user: req.session.user, tasks });
  } catch (error) {
    console.error('Error getting tasks:', error);
    res.status(500).send('An error occurred while getting the task list');
  }
});

/**
 * POST /add-task route to add a new task for the user.
 */
router.post('/add-task', ensureAuthenticated, validateTaskInput, async (req, res) => {
  const newTask = {
    user: req.session.user.userName,
    taskname: req.body.newTask,
    priority: req.body.priority || 'Normal',  // Set a default priority if not provided
  };
  try {
    await addTask(req.client, newTask);
    res.redirect('/');
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).send('An error occurred while adding the task');
  }
});

/**
 * POST /delete-task/:taskId route to delete a task by its ID.
 */
router.post('/delete-task/:taskId', ensureAuthenticated, async (req, res) => {
  try {
    const objectId = new ObjectId(req.params.taskId);
    await deleteTask(req.client, objectId);
    res.redirect('/');
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).send('An error occurred while deleting the task');
  }
});
export default router;