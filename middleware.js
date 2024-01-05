/**
 * Middleware that attaches a MongoClient instance to the request object. This makes
 * the client accessible throughout the request-response cycle.
 *
 * @function attachClient
 * @param {MongoClient} client - The MongoDB client instance to attach
 * @returns {function} Middleware function that attaches the client to the request object
 */
export function attachClient(client) {
  return (req, res, next) => {
    req.client = client;
    next();
  };
}

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

export function ensureAuthenticated(req, res, next) {
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

export function validateLoginInput(req, res, next) {
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

export function validateTaskInput(req, res, next) {
  const { newTask, priority } = req.body;
  if (!newTask || typeof newTask !== 'string') {
    return res.redirect('/');
  }
  if (priority !== undefined && typeof newTask !== 'string') {
    return res.redirect('/');
  }
  next();
}


