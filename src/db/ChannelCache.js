
const channel_cache = new Map();

const ChannelCache = () => {

  const create = (channelId) => {
    let cache = [];
    channel_cache.set(channelId, cache);
    return cache;
  }

  const clear = (channelId) => {
    channel_cache.delete(channelId);
  }

  const get = (channelId) => {
    return channel_cache.get(channelId);
  }

  const minTime = (channelId) => {
    let cache = channel_cache.get(channelId);
    if (!cache) {
      return 0;
    }
    if (cache.length === 0) {
      return 0;
    }
    return cache[0].created_at;
  }

  const maxTime = (channelId) => {
    let cache = channel_cache.get(channelId);
    if (!cache) {
      return 0;
    }
    if (cache.length === 0) {
      return 0;
    }
    return cache[cache.length - 1].created_at;
  }

  const hasChannelMsg = (channelId, msgid) => {
    let cache = channel_cache.get(channelId);
    if (!cache) {
      return false;
    }
    for (let i = 0; i < cache.length; i++) {
      if (cache[i].id === msgid) {
        return true;
      }
    }
    return false;
  }

  const pushChannelMsg = (channelId, channelMsg) => {
    let cache = channel_cache.get(channelId);
    if (!cache) {
      cache = create(channelId);
    }
    if (hasChannelMsg(channelId, channelMsg.id) === true) {
      return false;
    }
    cache.push(channelMsg);
    cache.sort((a, b) => {
      return a.created_at - b.created_at;
    })
    return true;
  }

  return {
    create: create,
    clear: clear,
    get: get,
    minTime: minTime,
    maxTime: maxTime,
    hasChannelMsg: hasChannelMsg,
    pushChannelMsg: pushChannelMsg,
  }
}

export default ChannelCache;
