import GSTProjects from "../asset/abi/GSTProjects.json";
const address = "0x9492C604468b50da645639b7Cfb6d84F2c137D8C";
class GSTProjectsBase {
  static createProject(library, account, cid) {
    return new Promise((resolve, reject) => {
      const _web3 = library;
      let contract = new _web3.eth.Contract(GSTProjects.abi, address);
      try {
        contract.methods
          .createProject(cid)
          .send({
            from: account,
          })
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      } catch (err) {
        reject(err);
      }
    });
  }

  static modifyProject(library, account, cid, tokenId) {
    return new Promise((resolve, reject) => {
      const _web3 = library;
      let contract = new _web3.eth.Contract(GSTProjects.abi, address);
      try {
        contract.methods
          .modifyProject(cid, tokenId)
          .send({
            from: account,
          })
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      } catch (err) {
        reject(err);
      }
    });
  }

  static ownerOf(library, account, tokenId) {
    return new Promise((resolve, reject) => {
      const _web3 = library;
      let contract = new _web3.eth.Contract(GSTProjects.abi, address);
      try {
        contract.methods
          .ownerOf(tokenId)
          .call({
            from: account,
          })
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      } catch (err) {
        reject(err);
      }
    });
  }

  static getProjects(library, index, count) {
    return new Promise((resolve, reject) => {
      const _web3 = library;
      let contract = new _web3.eth.Contract(GSTProjects.abi, address);
      try {
        contract.methods
          .getProjects(index, count)
          .call()
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      } catch (err) {
        reject(err);
      }
    });
  }

  static totalSupply(library) {
    return new Promise((resolve, reject) => {
      const _web3 = library;
      let contract = new _web3.eth.Contract(GSTProjects.abi, address);
      try {
        contract.methods
          .totalSupply()
          .call()
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      } catch (err) {
        reject(err);
      }
    });
  }
}

export default GSTProjectsBase;
