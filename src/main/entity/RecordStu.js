class RecordStu {
    constructor(recordId,userId,deviceId){
        this._recordId = recordId;
        this._userId = userId;
        this._deviceId = deviceId;
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
        this._userId = value;
    }

    get deviceId() {
        return this._deviceId;
    }

    set deviceId(value) {
        this._deviceId = value;
    }
}

module.exports = RecordStu
