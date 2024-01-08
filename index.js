import express from 'express';
import session from 'express-session';
import { MongoClient, ServerApiVersion } from 'mongodb';
import MongoStore from 'connect-mongo';
import { attachClient } from './middleware.js'; // Import the attachClient middleware
import routes from './routes.js'; // Import routes


const app = express();
const port = process.env.PORT || 3000;

const uri = process.env['mongoURI'];

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

app.use(attachClient(client)); // Use the imported attachClient middleware to attach `client` to the request object

app.use('/', routes); // Use the imported routes


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
