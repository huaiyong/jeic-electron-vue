class Answer{


    constructor(fullId,recordId,deviceId,datamark,data,result){
        this._fullId = fullId;
        this._recordId = recordId;
        this._deviceId = deviceId;
        this._datamark = datamark;
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

    get deviceId() {
        return this._deviceId;
    }

    set deviceId(value) {
        this._deviceId = value;
    }

    get datamark() {
        return this._datamark;
    }

    set datamark(value) {
        this._datamark = value;
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

module.exports = Answer
