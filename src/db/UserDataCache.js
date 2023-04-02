
const user_metadata_cache = new Map();

const UserDataCache = () => {

  const clear = () => {
    user_metadata_cache.clear();
  }

  const get = () => {
    return user_metadata_cache;
  }

  const getMetadata = (pubkey) => {
    return user_metadata_cache.get(pubkey);
  }

  const hasMetadata = (pubkey) => {
    return user_metadata_cache.has(pubkey);
  }

  const pushMetadata = (msg) => {
    let update_flag = false;
    let tmp_data = user_metadata_cache.get(msg.pubkey);
    if (!tmp_data) {
      update_flag = true;
    } else if (tmp_data.created_at < msg.created_at) {
      update_flag = true;
    }
    if (update_flag) {
      user_metadata_cache.set(msg.pubkey, msg);
    }
    return update_flag;
  }

  return {
    clear: clear,
    get: get,
    getMetadata: getMetadata,
    hasMetadata: hasMetadata,
    pushMetadata: pushMetadata,
  }
}

export default UserDataCache;
