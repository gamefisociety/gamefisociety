
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
    metadatas.map((item) => {
      const src = getMetaData(item.pubkey);
      if (src) {
        if (src.created_at < item.created_at) {
          MetaDataCache.set(item.pubkey, item);
        }
      } else {
        MetaDataCache.set(item.pubkey, item);
      }
    });
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
