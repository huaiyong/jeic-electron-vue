class VoteResult{


    constructor(classRecordId,voteId,userId,deviceId,realname,ticketNumber,result,optionNumber,createDate){
        this._classRecordId = classRecordId;
        this._voteId = voteId;
        this._userId = userId;
        this._deviceId = deviceId;
        this._realname = realname;
        this._ticketNumber = ticketNumber;
        this._result = result;
        this._optionNumber = optionNumber;
        this._createDate = createDate;
        
    }


    get classRecordId() {
        return this._classRecordId;
    }

    set classRecordId(value) {
        this._classRecordId = value;
    }

    get voteId() {
        return this._voteId;
    }

    set voteId(value) {
        this._voteId = value;
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

    get realname() {
        return this._realname;
    }

    set realname(value) {
        this._realname = value;
    }

    get ticketNumber() {
        return this._ticketNumber;
    }

    set ticketNumber(value) {
        this._ticketNumber = value;
    }

    get result() {
        return this._result;
    }

    set result(value) {
        this._result = value;
    }
    
    get optionNumber() {
        return this._optionNumber;
    }

    set optionNumber(value) {
        this._optionNumber = value;
    }
    
    get createDate() {
        return this._createDate;
    }

    set createDate(value) {
        this.createDate = value;
    }
}

module.exports = VoteResult
