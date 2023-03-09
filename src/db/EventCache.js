
const Cache = new Map();

export const EventCache = () => {

  const setEvent = (addr, data) => {
    // MetaDataCache.set(pubkey, metadata);
  }

  const getAll = () => {
    return Cache;
  }

  return {
    setEvent: setEvent,
    getAll: getAll,
  }
}
