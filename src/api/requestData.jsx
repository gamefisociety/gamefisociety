import Requset from './httpMgr';


export function getListData() {
    return Requset(
        {
            method: "get",
            url: "https://storageapi.fleek.co/a25570b2-75f1-4598-9285-01ac6c424f4b-bucket/game_data",
        }
    );
}

export function getListChainData() {
    return Requset(
        {
            method: "get",
            url: "https://storageapi.fleek.co/a25570b2-75f1-4598-9285-01ac6c424f4b-bucket/list_chain/list_chain",
        }
    );
}

export function getDetailData(name) {
    return Requset(
        {
            method: "get",
            url: "https://storageapi.fleek.co/a25570b2-75f1-4598-9285-01ac6c424f4b-bucket/list_chain/"+name+"/data",
        }
    );
}


