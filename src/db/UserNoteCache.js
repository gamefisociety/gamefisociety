
const user_note_cache = new Map();

const UserNoteCache = () => {

  const create = (pubkey) => {
    let cache = [];
    user_note_cache.set(pubkey, cache);
    return cache;
  }

  const clear = (pubkey) => {
    user_note_cache.delete(pubkey);
  }

  const get = (pubkey) => {
    return user_note_cache.get(pubkey);
  }

  const hasNote = (pubkey, msg) => {
    let cache = user_note_cache.get(pubkey);
    if (!cache) {
      return false;
    }
    for (let i = 0; i < cache.length; i++) {
      if (cache[i].id === msg.id) {
        return true;
      }
    }
    return false;
  }

  const pushNote = (pubkey, msg) => {
    let cache = user_note_cache.get(pubkey);
    if (!cache) {
      cache = create(pubkey);
    }
    if (hasNote(pubkey, msg) === true) {
      return false;
    }
    cache.push(msg);
    cache.sort((a, b) => {
      return b.created_at - a.created_at;
    })
    return true;
  }

  return {
    create: create,
    clear: clear,
    get: get,
    hasNote: hasNote,
    pushNote: pushNote,
  }
}

export default UserNoteCache;
