
const TLCache = new Map();

const TimelineCache = () => {

  const create = (key) => {
    let cache = [];
    TLCache.set(key, cache);
    return cache;
  }

  const clear = (key) => {
    TLCache.delete(key);
  }

  const get = (key) => {
    return TLCache.get(key);
  }

  const hasChat = (key, pubkey, createAt) => {
    let cache = TLCache.get(key);
    if (!cache) {
      return false;
    }
    let uid = pubkey + '-' + createAt;
    for (let i = 0; i < cache.length; i++) {
      if (cache[i].uid === uid) {
        return true;
      }
    }
    return false;
  }

  const pushChat = (key, pubkey, createAt, content) => {
    let cache = TLCache.get(key);
    if (!cache) {
      cache = create(key);
    }
    if (hasChat(key, pubkey, createAt) === true) {
      return false;
    }
    let info = {
      uid: pubkey + '-' + createAt,
      content: content,
      pubkey: pubkey,
      create: createAt
    }
    cache.push(info);
    //
    cache.sort((a, b) => {
      return a.create - b.create;
    })
    return true;
  }

  const hasFollower = (key, pubkey) => {
    let cache = TLCache.get(key);
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
    let cache = TLCache.get(key);
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
    hasChat: hasChat,
    pushChat: pushChat,
    hasFollower: hasFollower,
    pushFollowers: pushFollowers,
  }
}

export default TimelineCache;