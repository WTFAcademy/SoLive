type CacheOptions = {
  cacheTime: number; // -1: always, default: 1000 * 60 * 60 * 24
};

type CacheValue<T> = {
  value: T;
  expired_time: number;
};

type CacheReturn<T> = {
  value: T | undefined;
  expired: boolean;
};

const DefaultCacheTime = 1000 * 60 * 60 * 24;

function cache<T>(key: string, value: T, ops: CacheOptions): void {
  const cacheTime = ops.cacheTime || DefaultCacheTime;

  const needCacheValue: CacheValue<T> = {
    value,
    expired_time: new Date().getTime() + cacheTime,
  };

  localStorage.setItem(key, JSON.stringify(needCacheValue));
}

function getCache<T>(key: string): CacheReturn<T> {
  const localValueString = localStorage.getItem(key);
  let value;
  if (localValueString) {
    value = JSON.parse(localValueString);
  }

  return {
    value: value?.value,
    expired: value ? value.expired_time < new Date().getTime() : true,
  };
}

export { cache, getCache };
