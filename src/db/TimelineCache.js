
export const thread_node_cache_flag = 'thread_node_cache';
export const target_node_cache_flag = 'target_node_cache';
export const follow_cache_flag = 'follow_node_cache';

let timeline_cache = [];

const TimelineCache = () => {

  const clear = () => {
    timeline_cache = [];
  }

  const get = () => {
    return timeline_cache;
  }

  const hasThreadNote = (noteid) => {
    for (let i = 0; i < timeline_cache.length; i++) {
      if (timeline_cache[i].id === noteid) {
        return true;
      }
    }
    return false;
  }

  const getThreadNote = (noteid) => {
    for (let i = 0; i < timeline_cache.length; i++) {
      if (timeline_cache[i].id === noteid) {
        return timeline_cache[i];
      }
    }
    return null;
  }

  const pushThreadNote = (note) => {
    if (!note) {
      return false;
    }
    if (hasThreadNote(note.id) === true) {
      return false;
    }
    timeline_cache.push(note);
    timeline_cache.sort((a, b) => {
      return b.create - a.create;
    })
    return true;
  }

  return {
    clear: clear,
    get: get,
    hasThreadNote: hasThreadNote,
    pushThreadNote: pushThreadNote,
    getThreadNote: getThreadNote,
  }
}

export default TimelineCache;
