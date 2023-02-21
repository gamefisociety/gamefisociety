
const MetaDataCache = new Map();

export const dbCache = () => {

  const getMetaData = (pubkey) => {
    return MetaDataCache.get(pubkey);
  }

  const getMetaDatas = (pubkeys) => {
    let rets = [];
    pubkeys.map((key) => {
      let metadata = MetaDataCache.get(key);
      if (metadata) {
        rets.push(metadata);
      }
    })
    return rets;
  }

  const updateMetaData = (pubkey, metadata) => {
    MetaDataCache.set(pubkey, metadata);
  }

  const updateMetaDatas = (metadatas) => {
    // MetaDataCache.set(pubkey, metadata);
  }

  const getAll = () => {
    return MetaDataCache;
  }

  return {
    getMetaData: getMetaData,
    getMetaDatas: getMetaDatas,
    updateMetaData: updateMetaData,
    updateMetaDatas: updateMetaDatas,
    getAll: getAll,
  }
}
