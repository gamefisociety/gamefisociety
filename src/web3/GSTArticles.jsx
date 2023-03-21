
import GSTArticles from '../asset/abi/GSTArticles.json'

class GSTArticlesBase {

    static creatArticle(library, account, name, cid) {
        return new Promise((resolve, reject) => {
            const _web3 = library;
            let contract = new _web3.eth.Contract(
                GSTArticles.abi,
                "0xd90a519c27A09d7d91a7107f3D7bA099d2EDA899"
            );
            try {
                contract.methods.createArticle(name, cid).send({
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

    static getArticles(library, index, count) {
        return new Promise((resolve, reject) => {
            const _web3 = library;
            let contract = new _web3.eth.Contract(
                GSTArticles.abi,
                "0xd90a519c27A09d7d91a7107f3D7bA099d2EDA899"
            );
            try {
                contract.methods.getArticles(index, count).call().then(res => {
                    
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
                GSTArticles.abi,
                "0xd90a519c27A09d7d91a7107f3D7bA099d2EDA899"
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

export default GSTArticlesBase;
