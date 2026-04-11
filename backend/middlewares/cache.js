const redis = require('redis');

let redisClient;

(async () => {
    // Determine Redis URL, typically from environment, fallback to docker network alias
    const redisUrl = process.env.REDIS_URL || 'redis://redis:6379';
    redisClient = redis.createClient({ url: redisUrl });

    redisClient.on('error', (err) => console.error('Redis Client Error', err));
    redisClient.on('connect', () => console.log('Redis connected successfully'));

    try {
        await redisClient.connect();
    } catch (e) {
        console.error('Failed to connect to Redis initially');
    }
})();

function cacheMiddleware(expiration = 3600) {
    return async (req, res, next) => {
        // Skip caching if not GET/HEAD or if Redis isn't connected
        if (req.method !== 'GET' || !redisClient.isReady) {
            return next();
        }

        const key = `__express__${req.originalUrl || req.url}`;
        
        try {
            const cachedBody = await redisClient.get(key);
            if (cachedBody) {
                res.setHeader('X-Cache', 'HIT');
                return res.json(JSON.parse(cachedBody));
            }

            // Override res.json to cache response
            res.setHeader('X-Cache', 'MISS');
            const originalJson = res.json.bind(res);
            res.json = (body) => {
                redisClient.setEx(key, expiration, JSON.stringify(body)).catch(console.error);
                return originalJson(body);
            };
            next();
        } catch (error) {
            console.error('Redis Cache Error:', error);
            next();
        }
    };
}

module.exports = { cacheMiddleware, redisClient };
