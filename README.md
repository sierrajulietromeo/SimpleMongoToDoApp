*** NB: See the MVC branch for a version of the application that follows the MVC pattern more rigidly. Not to say that this one doesn't (see the section below), but the branch separates out the routes and middleware from `index.js`.


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

- Ability to edit tasks
- Sort tasks on the fly
- Add additional detail for tasks (e.g. progress tasks)
- Delete user accounts
- Improved front-end / mobile responsive etc
- Client-side validation of input. (Basic SS validation is included)
- Error Handling Middleware: Add a generic error-handling middleware at the end of the middleware chain to catch any errors that might pass through the route handlers.
- Better environment configuration and more use of environment variables (e.g. of the MongoDB URI - it's like this because of an issue with deploying to Replit otherwise. 
- Code Organization: Possibly organise route handlers into separate modules by their concern (e.g. auth-related routes, to-do related routes, etc.).
- Use of Declarative Routers: To declutter the main application file, consider using the express.Router class to register middleware and routes. Each router can act as a mini-application capable of performing middleware and routing functions.
- HTTP Status Codes: Make more use of appropriate HTTP status codes for responses, especially for error cases.
- Log Consistency: Improve logging for consistency and clarity, use a proper logging library that can be configured for different environments (development, production).

## Adherence to MVC pattern

- Model: The application interacts with the model through MongoDB collections. While the model logic isn't encapsulated into classes or functions specifically named as models, the code that interacts with the MongoDB database (`getTasks`, `addTask`, `deleteTask`, `checkUserPassword`, `registerUser`) effectively serves as the model layer. It handles data manipulation and business logic.

- View: The views are rendered using Pug templates. For instance, the *index* and *login* routes render views using the `res.render()` function, providing data that gets embedded into these templates.

- Controller: The router and middleware functions in `index.js`, such as `app.get`, `app.post`, and middleware like `ensureAuthenticated` and `validateLoginInput`, serve as controllers. They take user input from the request, process it (possibly updating or querying the model), and return the appropriate view response.

The application largely conforms to the MVC pattern with some slight deviations, which are common in real-world Express.js applications due to their flexibility and middleware-centric nature:

- Models are not structured into formal classes or separate files specifically marked as models but instead are handled through database operation functions.
- Controllers and routes are combined in Express.js. The logic for handling requests, processing data, and returning responses are written in the same functions or middleware.
- Views are managed through Pug templates.

Overall, the application's code organisation loosely follows the MVC pattern, which aims to separate concerns but adapts it to fit the typical structure of an Express.js application.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
