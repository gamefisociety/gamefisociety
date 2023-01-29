
import GSTAvatarNFT from '../asset/abi/GSTAvatarNFT.json'

class GSTAvatarNFTBase {

    static mintAvatar(library, account) {
        return new Promise((resolve, reject) => {
            const _web3 = library;
            let contract = new _web3.eth.Contract(
                GSTAvatarNFT.abi,
                "0xe6601913a4D5c3EECc1A41D148DA6136d9ce830b"
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
