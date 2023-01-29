
import GSTClaim from '../asset/abi/GSTClaim.json'

class GSTClaimBase {

    static isClaimable(library, account) {
        return new Promise((resolve, reject) => {
            const _web3 = library;
            let contract = new _web3.eth.Contract(
                GSTClaim.abi,
                "0xBd240d26aded43162f8517ee96EE84eE23D178Cb"
            );
            try {
                contract.methods.isClaimable().call({
                    from: account
                }).then(res => {
                    resolve(res);
                }).catch(error => {
                    reject(error)
                });
            } catch (err) {
                reject(err)
            }
        })
    }

    static claimEveryDay(library, account) {
        return new Promise((resolve, reject) => {
            const _web3 = library;
            let contract = new _web3.eth.Contract(
                GSTClaim.abi,
                "0xBd240d26aded43162f8517ee96EE84eE23D178Cb"
            );
            try {
                contract.methods.claimEveryDay().send({
                    from: account,
                }).then(res => {
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

export default GSTClaimBase;
