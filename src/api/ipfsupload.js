import { create } from "ipfs-http-client";
import { Buffer } from "buffer";
import fleekStorage from "@fleekhq/fleek-storage-js";
import { infuraAdd, pinataPinJSON, pinataPinFile } from "./requestData";
import xhelp from "module/utils/xhelp";
//infura
const infuraUploadInner = async (key, secret, data, onsucess, onerror) => {
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
    .add(data)
    .then((response) => {
      console.log("infura publish success ", response);
      onsucess(response);
    })
    .catch((err) => {
      console.log("infura publish error ", String(err));
      onerror(err);
    });
  // try {
  //   const { cid } = await ipfs.add("Hello world!");
  // } catch (err) {
  //       console.log("infura publish error ", String(err));
  //   onerror(err);
  // }
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
const fleekUploadInner = (key, secret, data, name, onsucess, onerror) => {
  const curTime = Date.now().toString();
  if (typeof data === "string" || data instanceof String) {
    let uniKey = name + "_" + curTime;
    fleekStorage
      .upload({
        apiKey: key,
        apiSecret: secret,
        key: Buffer.from(uniKey).toString("base64"),
        ContentType: "text/plain",
        data: data,
      })
      .then((response) => {
        console.log(response);
        onsucess(response);
      })
      .catch((err) => {
        console.log(String(err));
        onerror(err);
      });
  } else {
    let uniKey = name + "_" + curTime;
    console.log("fleek data uniKey", uniKey);
    fleekStorage
      .upload({
        apiKey: key,
        apiSecret: secret,
        key: Buffer.from(uniKey).toString("base64"),
        ContentType: data.type,
        data: data,
      })
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

//pinata
const pinataUploadInner = (key, secret, data, name, onsucess, onerror) => {
  if (typeof data === "string" || data instanceof String) {
    var newData = {
      pinataOptions: {
        cidVersion: 0
      },
      pinataMetadata: {
        name: name,
      },
      pinataContent: {
        content: data
      }
    };
    pinataPinJSON(key, secret, newData)
      .then((response) => {
        console.log(response);
        onsucess(response);
      })
      .catch((err) => {
        console.log(String(err));
        onerror(err);
      });
  } else {
    const newData = new FormData();
    newData.append("file", data);
    const metadata = JSON.stringify({
      name: data.name,
    });
    newData.append("pinataMetadata", metadata);
    const options = JSON.stringify({
      cidVersion: 0,
    });
    newData.append("pinataOptions", options);
    console.log("pinataPinFile", newData);
    pinataPinFile(key, secret, newData)
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
  infuraUpload: infuraUploadInner,
  fleekUpload: fleekUploadInner,
  pinataUpload: pinataUploadInner,
};

export default ipfspublish;
