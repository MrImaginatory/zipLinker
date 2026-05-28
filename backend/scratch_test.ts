import { RedisStore } from "connect-redis";
import Redis from "ioredis";
import { RedisStore as RateLimitRedisStore } from "rate-limit-redis";

const redisClient = new Redis("redis://localhost:6379");

const connectRedisClient = {
    get: (key: string) => redisClient.get(key),
    set: (key: string, value: string, opts?: any) => {
        if (opts && typeof opts === "object") {
            if (opts.PX) return redisClient.set(key, value, "PX", opts.PX);
            if (opts.EX) return redisClient.set(key, value, "EX", opts.EX);
        }
        return redisClient.set(key, value);
    },
    del: (key: string) => redisClient.del(key),
    expire: (key: string, seconds: number) => redisClient.expire(key, seconds),
    pexpire: (key: string, ms: number) => redisClient.pexpire(key, ms)
} as any;

async function test() {
    try {
        console.log("Testing connect-redis...");
        const store = new RedisStore({ client: connectRedisClient, prefix: "auth:session:" });
        await new Promise((resolve, reject) => {
            store.set("test_session_id", { cookie: { maxAge: 60000 } } as any, (err) => {
                if (err) reject(err);
                else resolve(true);
            });
        });
        console.log("connect-redis set success");
    } catch (e) {
        console.error("connect-redis failed:", e);
    }

    try {
        console.log("Testing rate-limit-redis with args slice...");
        const rateStore = new RateLimitRedisStore({
            sendCommand: (...args: string[]) => redisClient.call(args[0], ...args.slice(1)) as any,
        });
        await rateStore.increment("test_ip");
        console.log("rate-limit-redis increment success");
    } catch (e) {
        console.error("rate-limit-redis failed:", e);
    }

    redisClient.quit();
}

test();
