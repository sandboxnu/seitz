import { User } from "../models";
import redisClient from "../redis";

const DEFAULT_QUEUE_SIZE = 3;

const getQueueSize = (type: string): number => {
  switch (type) {
    case "recent_docs":
      return DEFAULT_QUEUE_SIZE;
    case "recent_batteries":
      return 5;
    default:
      throw new Error(`Unknown recent document type: ${type}`);
  }
};

const getQueueBounds = (
  queueSize: number = DEFAULT_QUEUE_SIZE
): [number, number] => {
  return [0, queueSize - 1];
};

const getRecentDocsKey = (userId: string, type: string): string => {
  return `user:${userId}:${type}`;
};

/**
 * Load the recent documents from MongoDB into Redis on the user Login.
 * @param userId the id of the user whose information is to be loaded into Redis.
 */
export const loadFromDatabase = async (userId: string): Promise<void> => {
  try {
    const user = await User.findById(userId).select([
      "recentStudyIds",
      "recentBatteries",
    ]);

    if (user?.recentStudyIds?.length) {
      const key = getRecentDocsKey(userId, "recent_docs");
      await redisClient.del(key);
      const studyIds = user.recentStudyIds;
      for (let i = studyIds.length - 1; i >= 0; i--) {
        await redisClient.lPush(key, studyIds[i]);
      }
    }

    if (user?.recentBatteries?.length) {
      const batteryKey = getRecentDocsKey(userId, "recent_batteries");
      await redisClient.del(batteryKey);
      const recentBatteries = user.recentBatteries;
      for (let i = user.recentBatteries.length - 1; i >= 0; i--) {
        await redisClient.lPush(batteryKey, recentBatteries[i].toString());
      }
    }
  } catch (error) {
    console.error(`Error loading recent documents from database:`, error);
    throw error;
  }
};

/**
 * Adds the given document to the Queue of recent documents specified for the given user. If the
 * length of the specified user's cache goes over (HIGH - LOW + 1), then the item at the front of
 * the queue is popped off and the specified documentId is added to the back of the queue.
 * @param userId the user whose cache is to be updated with the new document.
 * @param documentId the id of the document to add to the specified user's cache.
 * @param type the type of recent document queue to update (default is recent studies).
 */
export const addRecentDocument = async (
  userId: string,
  documentId: string,
  type = "recent_docs"
): Promise<void> => {
  try {
    const key = getRecentDocsKey(userId, type);
    const [LOW, HIGH] = getQueueBounds(getQueueSize(type));
    await redisClient.lRem(key, LOW, documentId);
    await redisClient.lPush(key, documentId);
    await redisClient.lTrim(key, LOW, HIGH);
  } catch (error) {
    console.error(`Error adding recent document: ${error}`);
    throw error;
  }
};

/**
 * Fetches the recent documents associated with the given user. If less than (HIGH - LOW + 1)
 * documents are returned, then it can be assumed the user has not accessed 3 or more documents
 * before.
 * @param userId the id of the user whose most recent documents are to be fetched.
 * @param type the type of recent document queue to get (default is recent studies).
 * @returns the list of the id's of the most recent documents associated with the given user.
 */
export const getRecentDocs = async (
  userId: string,
  type = "recent_docs"
): Promise<string[]> => {
  try {
    const key = getRecentDocsKey(userId, type);
    const documentIds = await redisClient.lRange(
      key,
      0,
      getQueueSize(type) - 1
    );
    return documentIds;
  } catch (error) {
    console.error(
      `Error getting recent documents for user ${userId}: ${error}`
    );
    throw error;
  }
};

/**
 * Removes the specified document from the specified user's most recent docs. If no document by
 * that name exists, then this will throw an error.
 * @param userId the id of the user whose current cache of recent documents is to be updated.
 * @param documentId the id of the document to be removed from the specified user's cache.
 * @param type the type of recent document queue to remove from (default is recent studies).
 */
export const removeRecentDocs = async (
  userId: string,
  documentId: string,
  type = "recent_docs"
): Promise<void> => {
  try {
    const key = getRecentDocsKey(userId, type);
    await redisClient.lRem(key, 0, documentId);
  } catch (error) {
    console.log(
      `Error removing the recent document from ${userId} documents: ${error}`
    );
    throw error;
  }
};
/**
 * Clear all of the recent documents with respect to the user provided. This will throw an error if
 * no user exits as specified by the inputs.
 * @param userId the user whose recent documents are to be deleted.
 * @param type the type of recent document queue to clear (default is recent studies).
 */
export const clearRecentDocs = async (
  userId: string,
  type = "recent_docs"
): Promise<void> => {
  try {
    const key = getRecentDocsKey(userId, type);
    await redisClient.del(key);
  } catch (error) {
    console.log(
      `Error clearing the recent documents cache from ${userId} documents: ${error}`
    );
    throw error;
  }
};

/**
 * Saves the information stored within the give user to the database, such that the relative
 * ordering is maintained. This will also throw an error when the given userid is not currently
 * stored within the redis cache.
 * @param userId the user whose recent documents are to be saved to the database.
 */
export const saveToDatabase = async (userId: string): Promise<void> => {
  try {
    const recentDocIds = await getRecentDocs(userId, "recent_docs");
    const recentBatteries = await getRecentDocs(userId, "recent_batteries");
    await User.findByIdAndUpdate(
      userId,
      { recentStudyIds: recentDocIds, recentBatteries: recentBatteries },
      { new: true }
    );
  } catch (error) {
    console.error(
      `Error saving recent documents for ${userId} to database: ${error}`
    );
    throw error;
  }
};
