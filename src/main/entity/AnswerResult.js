class AnswerResult {
    constructor(classRecordId,recordId,userId,deviceId,realname,resourceId,datamark,answer,trueAnswer,result,score,type,optionNumber,createDate){
        this._classRecordId = classRecordId;
        this._recordId = recordId;
        this._userId = userId;
        this._deviceId = deviceId;
        this._realname = realname;
        this._resourceId = resourceId;
        this._datamark = datamark;
        this._answer = answer;
        this._trueAnswer = trueAnswer;
        this._result = result;
        this._score = score;
        this._type = type;
        this._optionNumber = optionNumber;
        this._createDate = createDate;
    }


    get classRecordId() {
        return this._classRecordId;
    }

    set classRecordId(value) {
        this._classRecordId = value;
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

    get realname() {
        return this._realname;
    }

    set realname(value) {
        this._realname = value;
    }

    get resourceId() {
        return this._resourceId;
    }

    set resourceId(value) {
        this._resourceId = value;
    }

    get datamark() {
        return this._datamark;
    }

    set datamark(value) {
        this._datamark = value;
    }

    get answer() {
        return this._answer;
    }

    set answer(value) {
        this._answer = value;
    }

    get trueAnswer() {
        return this._trueAnswer;
    }

    set trueAnswer(value) {
        this._trueAnswer = value;
    }

    get result() {
        return this._result;
    }

    set result(value) {
        this._result = value;
    }

    get score() {
        return this._score;
    }

    set score(value) {
        this._score = value;
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
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
        this._createDate = value;
    }

    toData(qusType){
        var map = {};
        map.set("rId",this._classRecordId);
        map.set("sId",this._recordId);
        map.set("createBy",this._userId);
        map.set("deviceId",this._deviceId);
        map.set("deviceId",this._realname);
        map.set("eId",this._resourceId);
        map.set("qusNum",this._datamark);
        map.set("answer",this._answer);
        map.set("rightAnswer",this._trueAnswer);

        map.set("score",this._score);
        map.set("optionNumber",this._optionNumber);
        map.set("qusType",qusType);
        var resultType = "";
        if("1" == this._result){
            resultType = "1";
        }else if("0" == this._result){
            resultType = "2";
        }else{
            resultType = "3";
        }
        map.set("resultType",resultType);
        return map;
    }
}

module.exports = AnswerResult
