## Adherence to the MVC Pattern

### Model
The files contained in `./taskOperations/`, such as `checkUserPass.js`, `getTasks.js`, `addTask.js`, and `deleteTask.js`, act as part of the Model layer. They handle the logic for data retrieval and manipulation, interfacing with the MongoDB database.

### View
The Views in this application are constructed using the `pug` template engine. The rendered views are `login.pug`, `register.pug`, and `index.pug`, corresponding to various routes in the application. These provide the user interface and are served to the client whenever a route is accessed that requires a visual representation, for example, rendering the list of tasks for the user on the main page or showing the login form when accessing the `/login` route.

### Controller
The `routes.js` file serves as the Controller component of MVC. Here, the Express router is used to define routes for the application. Each route callback function controls the application's flow, responds to the user's input, and interacts with the Model to retrieve or modify the data.

The middleware functions in the `middleware.js` file, like `ensureAuthenticated` and `validateLoginInput`, also play a role in controlling the application's flow by ensuring certain preconditions (like authentication or input validation) are met before the main controller logic is executed.

### Conclusion
The given codebase illustrates a clean separation of concerns that is characteristic of the MVC pattern:
- The **Model** is implied through data handling scripts used by routes.
- The **View** is represented by Pug templates that are rendered and sent to the client.
- The **Controller** is found in the route handling provided by the Express router.

The overall architecture helps in maintaining an organised codebase where each part of the code has a clear responsibility, which simplifies development and future maintenance.
