import { Info } from "../../node_modules/@mui/icons-material/index";

const channel_info = new Map();
const channel_cache = new Map();

const ChannelCache = () => {

  const createInfo = (info) => {
    channel_info.set(info.id, info);
  }

  const getInfo = (channelId) => {
    return channel_info.get(channelId);
  }

  const addInfo = (info, modify) => {
    let ret = channel_info.has(info.id);
    if (ret) {
      if (modify === true) {
        channel_info.set(info.id, { ...info });
        return true;
      }
      return false;
    }
    createInfo(info);
  }

  const getInfoList = () => {
    let ret_arr = [];
    for (let [, info] of channel_info) {
      ret_arr.push(info);
    }
    return ret_arr;
  }

  const createMsg = (channelId) => {
    let cache = [];
    channel_cache.set(channelId, cache);
    return cache;
  }

  const clearMsg = (channelId) => {
    channel_cache.delete(channelId);
  }

  const getMsg = (channelId) => {
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
      cache = createMsg(channelId);
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
    createInfo: createInfo,
    getInfo: getInfo,
    addInfo: addInfo,
    getInfoList: getInfoList,
    createMsg: createMsg,
    clearMsg: clearMsg,
    getMsg: getMsg,
    minTime: minTime,
    maxTime: maxTime,
    hasChannelMsg: hasChannelMsg,
    pushChannelMsg: pushChannelMsg,
  }
}

export default ChannelCache;
