
import GSTPoints from '../asset/abi/GSTPoints.json'

class GSTPointsBase {

    static getTokenbalanceOf(library, account) {
        return new Promise((resolve, reject) => {
            const _web3 = library;
            let contract = new _web3.eth.Contract(
                GSTPoints.abi,
                "0x360D9cf0c8BEf592951ABfe79381aA44ce2Bf97E"
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

export default GSTPointsBase;
