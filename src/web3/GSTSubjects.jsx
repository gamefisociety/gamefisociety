import GSTSubjects from "../asset/abi/GSTSubjects.json";
const address = "0xBeA56Cd8d41aEe8A39fDB9ea9049a5F5E09E3901";
class GSTSubjectsBase {
  static createSubject(library, account, name) {
    return new Promise((resolve, reject) => {
      const _web3 = library;
      let contract = new _web3.eth.Contract(GSTSubjects.abi, address);
      try {
        contract.methods
          .createSubject(name)
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
      let contract = new _web3.eth.Contract(GSTSubjects.abi, address);
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

  static getSubjects(library, index, count) {
    return new Promise((resolve, reject) => {
      const _web3 = library;
      let contract = new _web3.eth.Contract(GSTSubjects.abi, address);
      try {
        contract.methods
          .getSubjects(index, count)
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
      let contract = new _web3.eth.Contract(GSTSubjects.abi, address);
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

export default GSTSubjectsBase;
