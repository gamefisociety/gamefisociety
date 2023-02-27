
import GSTAvatarNFT from '../asset/abi/GSTAvatarNFT.json'
class GSTAvatarNFTBase {
    
    static getTokenBalanceOf(addr, library, account) {
        return new Promise((resolve, reject) => {
            const _web3 = library;
            let contract = new _web3.eth.Contract(
                GSTAvatarNFT.abi,
                addr
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

    static baseURL(addr, library) {
        return new Promise((resolve, reject) => {
            const _web3 = library;
            let contract = new _web3.eth.Contract(
                GSTAvatarNFT.abi,
                addr
            );
            try {
                contract.methods.baseURL().call().then(res => {
                    
                    resolve(res);
                }).catch(error => {
                    reject(error)
                });
            } catch (err) {
                reject(err)
            }
        })
    }

    static name(addr, library) {
        return new Promise((resolve, reject) => {
            const _web3 = library;
            let contract = new _web3.eth.Contract(
                GSTAvatarNFT.abi,
                addr
            );
            try {
                contract.methods.name().call().then(res => {
                    
                    resolve(res);
                }).catch(error => {
                    reject(error)
                });
            } catch (err) {
                reject(err)
            }
        })
    }

    static mintAvatar(addr, library, account) {
        return new Promise((resolve, reject) => {
            const _web3 = library;
            let contract = new _web3.eth.Contract(
                GSTAvatarNFT.abi,
                addr
            );
            try {
                contract.methods.mint().send({
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

export default GSTAvatarNFTBase;
