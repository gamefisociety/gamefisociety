import Requset from "./httpMgr";
import { Buffer } from "buffer";
import { def_ipfs_public_gateway } from "../module/utils/xdef";
export function getListData() {
  return Requset({
    method: "get",
    url: "https://storageapi.fleek.co/a25570b2-75f1-4598-9285-01ac6c424f4b-bucket/game_data",
  });
}

export function getIPFS() {
  return Requset({
    method: "get",
    url: "https://ipfs.io/ipfs/QmYR5uWGq6GSz3NXfsRgeMaeDSpa173pUTDb1Cw96Dh7iF",
  });
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

export function pinataPinJSONToIPFS(key, secret, content) {
  return Requset({
    method: "post",
    url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    headers: {
      "Content-Type": "application/json",
      pinata_api_key: key,
      pinata_secret_api_key: secret,
    },
    data: {
      content: content,
    },
  });
}

export function infuraAdd(key, secret, content) {
  let authorization =
    "Basic " + Buffer.from(key + ":" + secret).toString("base64");
  // let authorization = key + ":" + secret;
  return Requset({
    method: "post",
    url: "https://ipfs.infura.io:5001/api/v0/add?stream-channels=true&progress=false",
    headers: {
      "Content-Type": "application/json",
      Authorization: authorization,
    },
    data: {
      file: content,
    },
  });
}
