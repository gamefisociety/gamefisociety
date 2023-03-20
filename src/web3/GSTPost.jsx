
import GSTPost from '../asset/abi/GSTPost.json'

class GSTPostBase {

    static creatArticle(library, account, name, cid) {
        return new Promise((resolve, reject) => {
            const _web3 = library;
            let contract = new _web3.eth.Contract(
                GSTPost.abi,
                "0x3B8052522e5a7d6d98e26fb800e76408774F80b7"
            );
            try {
                contract.methods.createPost(name, cid).send({
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

    static getPost(library, index) {
        return new Promise((resolve, reject) => {
            const _web3 = library;
            let contract = new _web3.eth.Contract(
                GSTPost.abi,
                "0x3B8052522e5a7d6d98e26fb800e76408774F80b7"
            );
            try {
                contract.methods._posts(index).call().then(res => {
                    
                    resolve(res);
                }).catch(error => {
                    reject(error)
                });
            } catch (err) {
                reject(err)
            }
        })
    }

    static totalSupply(library) {
        return new Promise((resolve, reject) => {
            const _web3 = library;
            let contract = new _web3.eth.Contract(
                GSTPost.abi,
                "0x3B8052522e5a7d6d98e26fb800e76408774F80b7"
            );
            try {
                contract.methods.totalSupply().call().then(res => {
                    
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

export default GSTPostBase;
