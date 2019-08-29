class SendRecord{
    constructor(id,name,type,stopAnswer,classRecordId,resourceId,resourceUrl,teacherId,createDateate){
        this._id = id;
        this._name = name;
        this._type = type;
        this._sendType = sendType;
        this._answerType = answerType;
        this._teachingGroupId = teachingGroupId;
        this._stopAnswer = stopAnswer;
        this._classRecordId = classRecordId;
        this._resourceId = resourceId;
        this._resourceUrl = resourceUrl;
        this._teacherId = teacherId;
        this._createDateate = createDateate;
    }
    
    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }
    
    get sendType() {
        return this._sendType;
    }

    set sendType(value) {
        this._sendType = value;
    }
    
    get answerType() {
        return this._answerType;
    }

    set answerType(value) {
        this._answerType = value;
    }
    
    get teachingGroupId() {
        return this._teachingGroupId;
    }

    set teachingGroupId(value) {
        this._teachingGroupId = value;
    }

    get stopAnswer() {
        return this._stopAnswer;
    }

    set stopAnswer(value) {
        this._stopAnswer = value;
    }

    get classRecordId() {
        return this._classRecordId;
    }

    set classRecordId(value) {
        this._classRecordId = value;
    }

    get resourceId() {
        return this._resourceId;
    }

    set resourceId(value) {
        this._resourceId = value;
    }

    get resourceUrl() {
        return this._resourceUrl;
    }

    set resourceUrl(value) {
        this._resourceUrl = value;
    }

    get teacherId() {
        return this._teacherId;
    }

    set teacherId(value) {
        this._teacherId = value;
    }

    get createDateate() {
        return this._createDateate;
    }

    set createDateate(value) {
        this._createDateate = value;
    }
}

module.exports = SendRecord
