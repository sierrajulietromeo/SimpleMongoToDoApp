import bcrypt from 'bcrypt';

/**
 * Registers a new user with a hashed password.
 * 
 * @async
 * @param {MongoClient} client - The MongoDB client.
 * @param {string} username - The username for the new user.
 * @param {string} password - The plaintext password to hash and store.
 * @returns {Promise<ObjectId>} The ObjectId of the newly inserted user document.
 * @throws Will throw an error if the registration process fails.
 */

async function registerUser(client, username, password) {
  try {
    const database = client.db("toDo");
    const usersCollection = database.collection("users");
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await usersCollection.insertOne({
      username: username,
      password: hashedPassword
    });

    return result.insertedId;
  } catch (error) {
    console.error('Error registering new user:', error);
    throw error; // Rethrow the error so it can be handled by the caller
  }
}

export { registerUser };