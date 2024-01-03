/**
 * Deletes a task by its ID.
 * 
 * @async
 * @param {MongoClient} client - The MongoDB client.
 * @param {ObjectId|string} taskId - The ID of the task to delete.
 * @returns {Promise<boolean>} True if the task was successfully deleted, false otherwise.
 * @throws Will throw an error if the deletion process fails.
 */

async function deleteTask(client, taskId) {
  const database = client.db("toDo");
  const collection = database.collection("toDoItems");
  try {
    const result = await collection.deleteOne({ _id: taskId });
    if (result.deletedCount === 1) {
      console.log(`Successfully deleted one document with the ID ${taskId}`);
      return true;
    } else {
      console.log(`No documents matched the query. Deleted 0 documents.`);
      return false;
    }
  } catch (error) {
    console.error(`Error deleting task with ID ${taskId}:`, error);
    throw error; // Rethrow the error so it can be handled by the caller
  }
}
export { deleteTask };