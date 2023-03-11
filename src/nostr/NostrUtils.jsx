import { v4 as uuid } from "uuid";

export const BuildSub = (subname, filters) => {
    // let sub = {};
    let uid = uuid();
    let subId = subname + '_' + uid.slice(0, 8);
    let ret = ["REQ", subId];
    filters.map((f) => {
        let newF = {};
        if (f['ids']) {
            newF['ids'] = f['ids'];
        }
        if (f['authors']) {
            newF['authors'] = f['authors'];
        }
        if (f['kinds']) {
            newF['kinds'] = f['kinds'];
        }
        if (f['#e']) {
            newF['#e'] = f['#e'];
        }
        if (f['#p']) {
            newF['#p'] = f['#p'];
        }
        if (f['since']) {
            newF['since'] = f['since'];
        }
        if (f['until']) {
            newF['until'] = f['until'];
        }
        if (f['limit']) {
            newF['limit'] = f['limit'];
        }
        ret.push(newF);
    })
    return ret;
}
