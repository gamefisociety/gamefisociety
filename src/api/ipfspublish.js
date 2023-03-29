import { create } from "ipfs-http-client";
import { Buffer } from "buffer";
import fleekStorage from "@fleekhq/fleek-storage-js";
import { infuraAdd, pinataPinJSON, pinataPinFile } from "./requestData";
//infura
const infuraPublishInner = (key, secret, content, onsucess, onerror) => {
  let authorization =
    "Basic " + Buffer.from(key + ":" + secret).toString("base64");
  let ipfs =  create({
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
      console.log("infura publish success", response);
      onsucess(response);
    })
    .catch((err) => {
      console.log("infura publish error", String(err));
      onerror(err);
    });
};
// const infuraPublishInner = (key, secret, content, onsucess, onerror) => {
//   infuraAdd(key, secret, content)
//     .then((response) => {
//       console.log("infura publish success", response);
//       onsucess(response);
//     })
//     .catch((err) => {
//       console.log("infura publish error", String(err));
//       onerror(err);
//     });
// };

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
const pinataUploadInner = (key, secret, data, onsucess, onerror) => {
  if(typeof data === "string"){
    pinataPinJSON(key, secret, data)
    .then((response) => {
      console.log(response);
      onsucess(response);
    })
    .catch((err) => {
      console.log(String(err));
      onerror(err);
    });
  }else {
    console.log("pinataPinFile", data);
    pinataPinFile(key, secret, data)
    .then((response) => {
      console.log(response);
      onsucess(response);
    })
    .catch((err) => {
      console.log(String(err));
      onerror(err);
    });
  }
  
};

const ipfspublish = {
  infuraPublish: infuraPublishInner,
  fleekPublish: fleekPublishInner,
  pinataUpload: pinataUploadInner,
};

export default ipfspublish;
