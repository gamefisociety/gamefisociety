
let g_note_cache = [];
let max_time = 0;
let min_time = 0;

const GlobalNoteCache = () => {

  const get = () => {
    return g_note_cache;
  }

  const maxTime = () => {
    return max_time;
  }

  const minTime = () => {
    return min_time;
  }

  const clear = () => {
    g_note_cache = [];
    max_time = 0;
    min_time = 0;
  }

  const hasNote = (msg) => {
    for (let i = 0; i < g_note_cache.length; i++) {
      if (g_note_cache[i].id === msg.id) {
        return true;
      }
    }
    return false;
  }

  const getNote = (noteid) => {
    for (let i = 0; i < g_note_cache.length; i++) {
      if (g_note_cache[i].id === noteid) {
        return g_note_cache[i];
      }
    }
    return null;
  }

  const pushNote = (msg) => {
    if (hasNote(msg) === true) {
      return false;
    }
    g_note_cache.push(msg);
    g_note_cache.sort((a, b) => {
      return b.created_at - a.created_at;
    });
    if (max_time === 0) {
      max_time = msg.created_at;
    } else {
      max_time = Math.max(max_time, msg.created_at);
    }
    if (min_time === 0) {
      min_time = msg.created_at;
    } else {
      min_time = Math.min(min_time, msg.created_at);
    }
    return true;
  }

  return {
    get: get,
    clear: clear,
    maxTime: maxTime,
    minTime: minTime,
    hasNote: hasNote,
    getNote: getNote,
    pushNote: pushNote,
  }
}

export default GlobalNoteCache;
