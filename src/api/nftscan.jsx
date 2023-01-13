import Requset from './httpMgr';
const key = "XGnVzZvfZXGIghqZ2elfLNEB";
const nftscan_baseurl_ethereum = "https://restapi.nftscan.com/api/";

export function getALLAssetsForAccount(account_address, erc_type = "erc721") {
    return Requset(
        {
            method: "get",
            url: nftscan_baseurl_ethereum + "v2/account/own/all/" + account_address,
            params:{"erc_type": erc_type},
            addheader:{"X-API-KEY": key}
        }
    );
}


