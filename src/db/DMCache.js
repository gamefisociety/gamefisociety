
const dm_cache = new Map();

const DMCache = () => {

  const create = (pubkey) => {
    let cache = [];
    dm_cache.set(pubkey, cache);
    return cache;
  }

  const clear = (pubkey) => {
    dm_cache.delete(pubkey);
  }

  const get = (pubkey) => {
    return dm_cache.get(pubkey);
  }

  const hasChat = (pubkey, msgid) => {
    let cache = dm_cache.get(pubkey);
    if (!cache) {
      return false;
    }
    for (let i = 0; i < cache.length; i++) {
      if (cache[i].msgid === msgid) {
        return true;
      }
    }
    return false;
  }

  const pushChat = (pubkey, msgid, owner, createAt, content) => {
    let cache = dm_cache.get(pubkey);
    if (!cache) {
      cache = create(pubkey);
    }
    if (hasChat(pubkey, msgid) === true) {
      return false;
    }
    let info = {
      msgid: msgid,
      owner: owner,
      create: createAt,
      content: content,
    }
    cache.push(info);
    cache.sort((a, b) => {
      return a.create - b.create;
    })
    return true;
  }

  return {
    create: create,
    clear: clear,
    get: get,
    hasChat: hasChat,
    pushChat: pushChat,
  }
}

export default DMCache;
