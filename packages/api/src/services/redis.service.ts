import { User } from "../models";
import redisClient from "../redis";

class RedisService {
  private readonly queueSizes: Map<string, number>;
  private readonly cacheTypes: Map<string, string>;

  constructor(
    queueSizes: Map<string, number>,
    cacheTypes: Map<string, string>
  ) {
    this.queueSizes = queueSizes;
    this.cacheTypes = cacheTypes;
  }

  /**
   * Adds an item to a recent items queue. Removes duplicates and maintains queue size.
   * @param attribute the scope attribute (e.g., 'user', 'project')
   * @param userId the id of the entity this queue belongs to
   * @param type the type of queue (must be configured in queueSizes)
   * @param itemId the id of the item to add
   */
  async addRecentItem(
    attribute: string,
    userId: string,
    type: string,
    itemId: string
  ): Promise<void> {
    try {
      const key = this.getKey(attribute, userId, type);
      const [LOW, HIGH] = this.getQueueBounds(type);
      await redisClient.lRem(key, 0, itemId);
      await redisClient.lPush(key, itemId);
      await redisClient.lTrim(key, LOW, HIGH);
    } catch (error) {
      console.error(
        `Error adding recent item to queue [${type}] for ${userId}: ${error}`
      );
      throw error;
    }
  }

  /**
   * Fetches recent items from a queue.
   * @param attribute the scope attribute (e.g., 'user', 'project')
   * @param userId the id of the entity this queue belongs to
   * @param type the type of queue to fetch from
   * @returns array of item ids in the queue (most recent first)
   */
  async getRecentItems(
    attribute: string,
    userId: string,
    type: string
  ): Promise<string[]> {
    try {
      const key = this.getKey(attribute, userId, type);
      const queueSize = this.queueSizes.get(type);

      if (queueSize === undefined) {
        throw new Error(`Unknown queue type: ${type}`);
      }

      const itemIds = await redisClient.lRange(key, 0, queueSize - 1);
      return itemIds;
    } catch (error) {
      console.error(
        `Error fetching recent items for ${attribute}:${userId}:${type}: ${error}`
      );
      throw error;
    }
  }

  /**
   * Removes a specific item from a recent items queue.
   * @param attribute the scope attribute (e.g., 'user', 'project')
   * @param userId the id of the entity this queue belongs to
   * @param type the type of queue to remove from
   * @param itemId the id of the item to remove
   */
  async removeRecentItem(
    attribute: string,
    userId: string,
    type: string,
    itemId: string
  ): Promise<void> {
    try {
      const key = this.getKey(attribute, userId, type);
      await redisClient.lRem(key, 0, itemId);
    } catch (error) {
      console.error(
        `Error removing item from queue [${type}] for ${userId}: ${error}`
      );
      throw error;
    }
  }

  /**
   * Clears all items from a recent items queue.
   * @param attribute the scope attribute (e.g., 'user', 'project')
   * @param userId the id of the entity this queue belongs to
   * @param type the type of queue to clear
   */
  async clearRecentItems(
    attribute: string,
    userId: string,
    ...types: string[]
  ): Promise<void> {
    try {
      for (const t in types) {
        const key = this.getKey(attribute, userId, t);
        await redisClient.del(key);
      }
    } catch (error) {
      console.error(
        `Error clearing queue of types [${types}] for ${userId}: ${error}`
      );
      throw error;
    }
  }

  /**
   * Loads items into a Redis queue, replacing any existing items.
   * Items are added in reverse order to maintain correct ordering (most recent first).
   * @param attribute the scope attribute (e.g., 'user', 'project')
   * @param userId the id of the entity this queue belongs to
   * @param type the type of queue to load into
   * @param items array of item ids to load (should be in order from oldest to newest)
   */
  async loadItems(
    attribute: string,
    userId: string,
    type: string,
    items: string[]
  ): Promise<void> {
    try {
      const key = this.getKey(attribute, userId, type);
      await redisClient.del(key);

      for (let i = items.length - 1; i >= 0; i--) {
        await redisClient.lPush(key, items[i]);
      }
    } catch (error) {
      console.error(
        `Error loading items into queue [${type}] for ${userId}: ${error}`
      );
      throw error;
    }
  }

  /**
   * Loads recent items from MongoDB into Redis for specified queue types.
   * @param attribute the scope attribute (e.g., 'user', 'project')
   * @param userId the id of the user whose information is to be loaded into Redis
   * @param queueTypes variable number of queue type names to load from the database
   */
  async loadFromDatabase(
    attribute: string,
    userId: string,
    ...queueTypes: string[]
  ): Promise<void> {
    try {
      const user = await User.findById(userId).select(queueTypes);

      if (!user) {
        throw new Error(`User ${userId} not found`);
      }

      for (const type of queueTypes) {
        const items = user[type as keyof typeof user];

        if (Array.isArray(items) && items.length) {
          const itemStrings = items.map((item) => String(item));
          await this.loadItems(attribute, userId, type, itemStrings);
        }
      }
    } catch (error) {
      console.error(
        `Error loading queue types [${queueTypes.join(
          ", "
        )}] from database for ${userId}: ${error}`
      );
      throw error;
    }
  }

  /**
   * Saves recent items from Redis to MongoDB for specified queue types.
   * @param attribute the scope attribute (e.g., 'user', 'project')
   * @param userId the id of the user whose recent items are to be saved
   * @param queueTypes variable number of queue type names to save to the database
   */
  async saveToDatabase(
    attribute: string,
    userId: string,
    ...queueTypes: string[]
  ): Promise<void> {
    try {
      const updateFields: Record<string, string[]> = {};

      for (const type of queueTypes) {
        const items = await this.getRecentItems(attribute, userId, type);
        updateFields[type] = items;
      }

      await User.findByIdAndUpdate(userId, updateFields, { new: true });
    } catch (error) {
      console.error(
        `Error saving queue types [${queueTypes.join(
          ", "
        )}] to database for ${userId}: ${error}`
      );
      throw error;
    }
  }

  /**
   * Fetches the cache type associated with the given name.
   * @param name the name of the cache type we are looking for.
   * @returns the specific cache name used in the Redis cache when referring to the given name.
   * For example: "studies" => "recent_studies".
   * @throws Error if the given name is not associated with any cache types.
   */
  cacheTypeOf(name: string): string {
    const cacheType = this.cacheTypes.get(name);
    if (cacheType === undefined) {
      throw new Error(`No such cache type with the name: ${name}`);
    }
    return cacheType;
  }

  /**
   * Fetches the key name with respect to the given parameters.
   * @param attribute the attribute under which this key is stored (user, public, etc.)
   * @param userId the id of the entity this queue belongs to
   * @param type the type of information being stored
   * @returns a string formatted as: attribute:userId:type
   */
  private getKey(attribute: string, userId: string, type: string): string {
    return `${attribute}:${userId}:${type}`;
  }

  /**
   * Gets the bounds [LOW, HIGH] for a queue based on its configured size.
   * @param queueName the name/type of the queue
   * @returns tuple of [0, size-1] representing the Redis list range
   */
  private getQueueBounds(queueName: string): [number, number] {
    const upperBound = this.queueSizes.get(queueName);

    if (upperBound === undefined) {
      throw new Error(`Unknown queue type: ${queueName}`);
    }
    return [0, upperBound - 1];
  }
}

const queueSizes = new Map<string, number>([
  ["recent_studies", 3],
  ["recent_batteries", 5],
]);

const cacheTypes = new Map<string, string>([
  ["studies", "recent_studies"],
  ["batteries", "recent_batteries"],
]);

export default new RedisService(queueSizes, cacheTypes);
