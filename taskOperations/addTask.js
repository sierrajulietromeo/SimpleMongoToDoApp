/**
 * Adds a new task to the database.
 * 
 * @async
 * @param {MongoClient} client - The MongoDB client.
 * @param {Object} newTask - The task object to add.
 * @returns {Promise<InsertOneResult>} The result of the insertion operation.
 * @throws Will throw an error if the task cannot be added.
 */

async function addTask(client, newTask) {
  
    const database = client.db("toDo"); //  database name
    const collection = database.collection("toDoItems"); // actual collection name

   // Insert the task into the collection
    try {
      const result = await collection.insertOne(newTask);
      console.log(`New task added with the following id: ${result.insertedId}`);
      return result;
    } catch (error) {
      console.error('Error adding new task:', error);
      throw error; // Rethrow the error so it can be handled by the caller
    }
  
}

export { addTask };