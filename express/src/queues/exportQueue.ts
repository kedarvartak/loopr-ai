import { Queue } from 'bullmq';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URI;
if (!redisUrl) {
    throw new Error('REDIS_URI is not defined in the environment variables');
}

// It's best practice to use a dedicated Redis connection for BullMQ
// that is separate from the one used for caching, but for this
// implementation, using the same one is acceptable.
const connection = {
  host: new URL(redisUrl).hostname,
  port: parseInt(new URL(redisUrl).port),
  username: new URL(redisUrl).username,
  password: new URL(redisUrl).password,
};

export const exportQueue = new Queue('csv-export', { connection }); 