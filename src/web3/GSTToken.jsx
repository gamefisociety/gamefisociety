
import GSTToken from '../asset/abi/GSTToken.json'

class GSTTokenBase {

    static getTokenbalanceOf(library, account) {
        return new Promise((resolve, reject) => {
            const _web3 = library;
            let contract = new _web3.eth.Contract(
                GSTToken.abi,
                "0xD512A3a42c20A7e42BCce1Ae1eD18D810532B4D3"
            );
            try {
                contract.methods.balanceOf(account).call().then(res => {
                    
                    resolve(res);
                }).catch(error => {
                    reject(error)
                });
            } catch (err) {
                reject(err)
            }
        })
    }

}

export default GSTTokenBase;
