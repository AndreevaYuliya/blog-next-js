import "server-only";

import { createClient, type RedisClientType } from "redis";

export type SessionData = {
  accessToken: string;
  refreshToken: string;
  userId: number;
  userName: string;
};

const IS_PROD = process.env.NODE_ENV === "production";
const REDIS_URL = process.env.REDIS_URL;
const SESSION_TTL_SECONDS = Number(
  process.env.SESSION_TTL_SECONDS ?? 60 * 60 * 24 * 7,
);

// Dev fallback: in-memory store
const memoryStore = new Map<string, SessionData>();

let redis: RedisClientType | null = null;
let connectPromise: Promise<RedisClientType> | null = null;

const canUseRedis = Boolean(REDIS_URL);

const getRedis = async (): Promise<RedisClientType | null> => {
  if (!canUseRedis) {
    if (IS_PROD) {
      throw new Error("REDIS_URL is not set");
    }
    return null;
  }

  if (!redis) {
    redis = createClient({ url: REDIS_URL });
  }

  if (redis.isOpen) {
    return redis;
  }

  if (!connectPromise) {
    connectPromise = redis.connect().catch((err) => {
      connectPromise = null;

      throw err;
    });
  }

  await connectPromise;

  return redis;
};

const key = (sid: string) => `sess:${sid}`;

export const setSession = async (sid: string, data: SessionData) => {
  const client = await getRedis();

  if (!client) {
    memoryStore.set(sid, data);

    return;
  }

  await client.set(key(sid), JSON.stringify(data), { EX: SESSION_TTL_SECONDS });
};

export const getSession = async (sid: string): Promise<SessionData | null> => {
  const client = await getRedis();

  if (!client) {
    return memoryStore.get(sid) ?? null;
  }

  const raw = await client.get(key(sid));

  return raw ? (JSON.parse(raw) as SessionData) : null;
};

export const deleteSession = async (sid: string) => {
  const client = await getRedis();

  if (!client) {
    memoryStore.delete(sid);

    return;
  }

  await client.del(key(sid));
};

