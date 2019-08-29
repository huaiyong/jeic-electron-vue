class PadAnswer{


    constructor(fullId,recordId,userId,qid,data,result){
        this._fullId = fullId;
        this._recordId = recordId;
        this._userId = userId;
        this._qid= qid;
        this._data = data;
        this._result = result;
    }


    get fullId() {
        return this._fullId;
    }

    set fullId(value) {
        this._fullId = value;
    }

    get recordId() {
        return this._recordId;
    }

    set recordId(value) {
        this._recordId = value;
    }

    get userId() {
        return this._userId;
    }

    set userId(value) {
        this._userId= value;
    }

    get qid() {
        return this._qid;
    }

    set qid(value) {
        this._qid = value;
    }

    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
    }

    get result() {
        return this._result;
    }

    set result(value) {
        this._result = value;
    }
}

module.exports = PadAnswer
