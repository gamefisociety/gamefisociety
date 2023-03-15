
const NorCache = new Map();

export const user_metadata_cache = 'user_metadata';

const NormalCache = () => {

  const create = (key) => {
    let cache = [];
    NorCache.set(key, cache);
    return cache;
  }

  const clear = (key) => {
    NorCache.delete(key);
  }

  const get = (key) => {
    return NorCache.get(key);
  }

  const getMetadata = (key, pubkey) => {
    let cache = NorCache.get(key);
    if (!cache) {
      return { info: null, index: -1 };
    }
    for (let i = 0; i < cache.length; i++) {
      if (cache[i].pubkey === pubkey) {
        return { info: cache[i].msg, index: i };
      }
    }
    return { info: null, index: -1 };
  }

  const hasMetadata = (key, pubkey) => {
    let cache = NorCache.get(key);
    if (!cache) {
      return false;
    }
    for (let i = 0; i < cache.length; i++) {
      if (cache[i].pubkey === pubkey) {
        return true;
      }
    }
    return false;
  }

  const pushMetadata = (key, pubkey, msg) => {
    let cache = NorCache.get(key);
    if (!cache) {
      cache = create(key);
    }
    const { info, index } = getMetadata(key, pubkey);
    if (info !== null) {
      if (info.created_at < msg.created_at) {
        //instead by timestamp
        cache[index].msg = { ...msg };
        return true;
      }
      return false;
    }
    let newInfo = {
      pubkey: pubkey,
      msg: msg,
    }
    cache.push(newInfo);
    return true;
  }

  const hasFollower = (key, pubkey) => {
    let cache = NorCache.get(key);
    if (!cache) {
      return false;
    }
    for (let i = 0; i < cache.length; i++) {
      if (cache[i].pubkey === pubkey) {
        return true;
      }
    }
    return false;
  }

  const pushFollowers = (key, pubkey, msg) => {
    let cache = NorCache.get(key);
    if (!cache) {
      cache = create(key);
    }
    if (hasFollower(key, pubkey) === true) {
      return false;
    }
    let info = {
      pubkey: pubkey,
      msg: msg,
    }
    cache.push(info);
    return true;
  }

  return {
    create: create,
    clear: clear,
    get: get,
    getMetadata: getMetadata,
    hasMetadata: hasMetadata,
    pushMetadata: pushMetadata,
    hasFollower: hasFollower,
    pushFollowers: pushFollowers,
  }
}

export default NormalCache;
