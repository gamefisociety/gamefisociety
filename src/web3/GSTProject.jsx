
import GSTProject from '../asset/abi/GSTProject.json'

class GSTProjectBase {

    static creatMintNFT(library, account,_uri,_name) {
        console.log(account,_uri,_name,'account');
        return new Promise((resolve, reject) => {
            const _web3 = library;
            let contract = new _web3.eth.Contract(
                GSTProject.abi,
                "0xb0b0DF4b54C9670AC747569865828b225f935A31"
            );
            
            try {
                contract.methods.mint(account,_uri,_name).send({
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
}

export default GSTProjectBase;
