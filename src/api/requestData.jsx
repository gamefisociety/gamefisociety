import Requset from "./httpMgr";
import {def_ipfs_public_gateway} from "../module/utils/xdef"
export function getListData() {
  return Requset({
    method: "get",
    url: "https://storageapi.fleek.co/a25570b2-75f1-4598-9285-01ac6c424f4b-bucket/game_data",
  });
}

export function getIPFS() {
    return Requset(
        {
            method: "get",
            url: "https://ipfs.io/ipfs/QmYR5uWGq6GSz3NXfsRgeMaeDSpa173pUTDb1Cw96Dh7iF",
        }
    );
}

export function getListChainData() {
  return Requset({
    method: "get",
    url: "https://storageapi.fleek.co/a25570b2-75f1-4598-9285-01ac6c424f4b-bucket/list_chain/list_chain",
  });
}

export function getDetailData(name) {
  return Requset({
    method: "get",
    url:
      "https://storageapi.fleek.co/a25570b2-75f1-4598-9285-01ac6c424f4b-bucket/list_chain/" +
      name +
      "/data",
  });
}

export function catIPFSContent(cid) {
  return Requset({
    method: "get",
    
    url: def_ipfs_public_gateway + "/ipfs/" + cid,
  });
}

export function pinJSONToIPFS(key, secret, content) {
  return Requset({
    method: "post",
    url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    headers: { 
      'Content-Type': 'application/json', 
      'pinata_api_key': key,
      'pinata_secret_api_key': secret
    },
    data : {
      content: content
    }
  });
}
