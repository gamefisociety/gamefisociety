
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

  const updateMetaData = (pubkey, create_at, content) => {
    let update_flag = false;
    let data = MetaDataCache.get(pubkey);
    if (data) {
      if (data.create_at < create_at) {
        update_flag = true;
      }
    } else {
      update_flag = true;
    }
    if (update_flag) {
      let newData = {
        create_at: create_at,
        pubkey: pubkey,
        content: JSON.parse(content)
      }
      MetaDataCache.set(pubkey, newData);
    }
    return update_flag;
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

  const getAllArray = () => {
    return [...MetaDataCache];
  }

  return {
    getMetaData: getMetaData,
    getMetaDatas: getMetaDatas,
    updateMetaData: updateMetaData,
    updateMetaDatas: updateMetaDatas,
    getAll: getAll,
    getAllArray: getAllArray,
  }
}
