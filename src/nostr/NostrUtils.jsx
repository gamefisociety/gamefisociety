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
        if (f['#t']) {
            newF['#t'] = f['#t'];
        }
        if (f['#g']) {
            newF['#g'] = f['#g'];
        }
        if (f['#r']) {
            newF['#r'] = f['#r'];
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

export const ParseNote = (note) => {
    let ret = {
        root_note_id: 0,
        root_note_p: 0,
        reply_note_id: 0,
        reply_note_p: 0,
        local_note: 0,
        local_p: 0,
        eNum: 0,
        pNum: 0,
        eArray: [],
        pArray: [],
    }
    if (!note) {
        return ret;
    }
    ret.local_note = note.id;
    ret.local_p = note.pubkey;
    if (note.tags?.length === 0) {
        ret.root_note_id = note.id;
        ret.root_note_p = note.pubkey;
    } else {
        note.tags?.map((item, index) => {
            if (item[0] === 'e') {
                ret.eNum = ret.eNum + 1;
                ret.eArray.push(item);
            } else if (item[0] === 'p') {
                ret.pNum = ret.pNum + 1;
                ret.pArray.push(item);
            }
        });
        //
        if (ret.eNum === 1) {
            if (ret.eArray[0]) {
                ret.root_note_id = ret.eArray[0][1];
            }
            if (ret.pArray[0]) {
                ret.root_note_p = ret.pArray[0][1];
            }
            ret.reply_note_id = note.id;
            ret.reply_note_p = note.pubkey;
        } else if (ret.eNum === 2) {
            if (ret.eArray[0]) {
                ret.root_note_id = ret.eArray[0][1];
            }
            if (ret.pArray[0]) {
                ret.root_note_p = ret.pArray[0][1];
            }
            if (ret.eArray[1]) {
                ret.reply_note_id = ret.eArray[1][1];
            }
            if (ret.pArray[1]) {
                ret.reply_note_p = ret.pArray[1][1];
            }
        }
    }
    return ret;
}