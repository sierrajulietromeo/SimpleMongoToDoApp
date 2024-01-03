/**
 * Retrieves all tasks associated with a given user.
 * 
 * @async
 * @param {MongoClient} client - The MongoDB client.
 * @param {string} username - The username associated with the tasks to retrieve.
 * @returns {Promise<Array>} An array of tasks associated with the user.
 * @throws Will throw an error if the retrieval process fails.
 */

async function getTasks(client, username) {

    const database = client.db("toDo"); // database name
    const collection = database.collection("toDoItems"); // collection name

    // Define a sort order for the priorities
    const sortOrder = { high: 1, medium: 2, low: 3 };
    
    // Find all records where the username matches the specified value
    try {
      const tasks = await collection.find({ user: username }).sort({ priority: 1 }).toArray();
      console.log('Found documents:', tasks);

      // Sort tasks array by the defined sortOrder
      tasks.sort((a, b) => sortOrder[a.priority] - sortOrder[b.priority]);
      
      return tasks;
      
    } catch (error) {
      console.error('Error finding documents:', error);
      throw error; // Rethrow the error so it can be handled by the caller
    }

}
  
export { getTasks };