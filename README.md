# To-Do List Application

This project is a web-based to-do list application that allows users to manage their tasks efficiently. It features user authentication, session management, and uses MongoDB for data storage. Users can create, view, and delete tasks, as well as categorise them by priority levels (high, medium, low).

## Features

- User authentication system allowing for secure login and registration (currently disabled for new registrations)
- Session management for keeping users logged in securely (with express-session and connect-mongo).
- Bcrypt stores passeword hashes in the DB 
- CRUD operations for task management
- Prioritisation of tasks for better organisation
- Clean and responsive user interface (not really!)

## Technologies Used

- Node.js: The runtime environment for running JavaScript on the server.
- Express.js: The web application framework used to build the server.
- Pug: Template engine for rendering the UI components.
- MongoDB: NoSQL database for storing user and task data.
- connect-mongo: Middleware for managing MongoDB-based sessions.
- express-session: Middleware for session management.
- MongoDB's Native Driver: For database interactions.
- CSS: For styling the web pages.

## To-dos (maybe) for the future

Ability to edit tasks
Sort tasks on the fly
Add additional detail for tasks (e.g. progress tasks)
Delete user accounts
Improved front-end / mobile responsive etc
Client-side validation of input. (Basic SS validation is included)
Error Handling Middleware: Add a generic error-handling middleware at the end of the middleware chain to catch any errors that might pass through the route handlers.
Better environment configuration and more use of environment variables (e.g. of the MongoDB URI - it's like this because of an issue with deploying to Replit otherwise. 
Code Organization: Possibly organise route handlers into separate modules by their concern (e.g. auth-related routes, to-do related routes, etc.).
Use of Declarative Routers: To declutter the main application file, consider using the express.Router class to register middleware and routes. Each router can act as a mini-application capable of performing middleware and routing functions.
HTTP Status Codes: Make more use of appropriate HTTP status codes for responses, especially for error cases.
Log Consistency: Improve logging for consistency and clarity, use a proper logging library that can be configured for different environments (development, production).

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
