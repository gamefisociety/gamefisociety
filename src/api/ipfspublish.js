import { create } from "ipfs-http-client";
import { Buffer } from "buffer";
import fleekStorage from "@fleekhq/fleek-storage-js";
import { pinJSONToIPFS } from "../api/requestData";
//infura
const infuraPublishInner = (key, secret, content, onsucess, onerror) => {
  let authorization =
    "Basic " + Buffer.from(key + ":" + secret).toString("base64");
  let ipfs = create({
    host: "ipfs.infura.io",
    port: "5001",
    protocol: "https",
    headers: {
      authorization,
    },
  });
  ipfs
    .add(content)
    .then((response) => {
      console.log(response);
      onsucess(response);
    })
    .catch((err) => {
      console.log(String(err));
      onerror(err);
    });
};
//   const testCat = async () => {
//     let cid = "QmYR5uWGq6GSz3NXfsRgeMaeDSpa173pUTDb1Cw96Dh7iF";
//     const chunks = [];
//     for await (const chunk of ipfs.cat(cid)) {
//       chunks.push(chunk);
//     }
//     console.log(Buffer.concat(chunks).toString());
//   };

//fleek
const fleekPublishInner = (key, secret, content, onsucess, onerror) => {
  fleekStorage
    .upload({
      apiKey: key,
      apiSecret: secret,
      key: Buffer.from(content).toString("base64"),
      ContentType: "text/plain",
      data: content,
    })
    .then((response) => {
      console.log(response);
      onsucess(response);
    })
    .catch((err) => {
      console.log(String(err));
      onerror(err);
    });
};

//pinata
const pinataPublishInner = (key, secret, content, onsucess, onerror) => {
  pinJSONToIPFS(key, secret, content).then((response) => {
        console.log(response);
        onsucess(response);
      })
      .catch((err) => {
        console.log(String(err));
        onerror(err);
      });
};

const ipfspublish = {
  infuraPublish: infuraPublishInner,
  fleekPublish: fleekPublishInner,
  pinataPublish: pinataPublishInner,
};

export default ipfspublish;
