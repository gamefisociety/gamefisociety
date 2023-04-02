
let g_note_cache = [];

const GlobalNoteCache = () => {

  const get = () => {
    return g_note_cache;
  }

  const clear = () => {
    g_note_cache = [];
  }

  const hasNote = (msg) => {
    for (let i = 0; i < g_note_cache.length; i++) {
      if (g_note_cache[i].id === msg.id) {
        return true;
      }
    }
    return false;
  }

  const pushNote = (msg) => {
    if (hasNote(msg) === true) {
      return false;
    }
    g_note_cache.push(msg);
    g_note_cache.sort((a, b) => {
      return b.created_at - a.created_at;
    })
    return true;
  }

  return {
    get: get,
    clear: clear,
    hasNote: hasNote,
    pushNote: pushNote,
  }
}

export default GlobalNoteCache;
