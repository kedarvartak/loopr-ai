import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URI;
if (!redisUrl) {
    throw new Error('REDIS_URI is not defined in the environment variables');
}

const redisClient = createClient({
    url: redisUrl
});

redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
});

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
};

connectRedis();

export default redisClient; 