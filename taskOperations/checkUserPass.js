import bcrypt from 'bcrypt';

/**
 * Checks if the provided password matches the one stored in the database for the given user.
 * 
 * @async
 * @param {MongoClient} client - The MongoDB client.
 * @param {string} username - The username whose password is to be checked.
 * @param {string} inputPassword - The plaintext password provided for verification.
 * @returns {Promise<boolean>} True if the password matches, false otherwise.
 * @throws Will throw an error if an operation in the database fails.
 */


async function checkUserPassword(client, username, inputPassword) {
  try {
    const database = client.db("toDo"); 
    const collection = database.collection("users"); 

    // Find the user by their username
    const user = await collection.findOne({ username: username });

    if (user) {
          // Check if the hashed password matches the provided password
          const passwordMatch = await bcrypt.compare(inputPassword, user.password);
          if (passwordMatch) {
            return true; // Passwords match
          } else {
            console.log(`Password does not match for user: ${username}`);
            return false; // Passwords do not match
          }
        } else {
          console.log(`User not found: ${username}`);
          return false; // User not found
        }
      } catch (error) {
        console.error(`An error occurred while checking user password for ${username}:`, error);
        throw error; // Rethrow the error so it can be handled by the caller
      } 
    }

export { checkUserPassword };