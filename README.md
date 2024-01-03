# To-Do List Application

This project is a web-based to-do list application that allows users to manage their tasks efficiently. It features user authentication, session management, and uses MongoDB for data storage. Users can create, view, and delete tasks, as well as categorise them by priority levels (high, medium, low).

## Features

- User authentication system allowing for secure login and registration (currently disabled for new registrations)
- Session management for keeping users logged in securely
- CRUD operations for task management
- Prioritisation of tasks for better organisation
- Clean and responsive user interface (not really!)

Session Management: Using express-session with the connect-mongo store to handle user sessions, with automatic removal of expired sessions.

Cookie Security: Cookies are marked as HttpOnly and secure based on the environment, and they have a set max age of 1 hour.

Password Security: Usage of bcrypt to store hashed passwords in the database, not plaintext, which is a good security practice.

Database Security: Use of MongoDB with a structured way to connect and query the database.

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


Client-side validation

Error Handling Middleware: Add a generic error-handling middleware at the end of the middleware chain to catch any errors that might pass through the route handlers.

Environment Configuration: Instead of hardcoding the MongoDB URI and other sensitive information directly in the source code, it's better to use environment variable configurations, which you're partly doing. Ensure you're also using a .env file or equivalent for local development.

Async Route Handlers: Use the async keyword for your route handlers where you're using await for asynchronous operations. It makes it clear that the function returns a Promise and can use await.

Code Organization: You might want to organize route handlers into separate modules by their concern (e.g. auth-related routes, to-do related routes, etc.).

Use of Declarative Routers: To declutter the main application file, consider using the express.Router class to register middleware and routes. Each router can act as a mini-application capable of performing middleware and routing functions.

HTTP Status Codes: Make more use of appropriate HTTP status codes for responses, especially for error cases.

Log Consistency: Improve logging for consistency and clarity, use a proper logging library that can be configured for different environments (development, production).


## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
