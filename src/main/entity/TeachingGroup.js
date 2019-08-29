class TeachingGroup {
    constructor(id,name,type,classId,subjectId,createBy,createDate,teacherId,updateBy,updateDate,delFlag){
        this._id = id;
        this._name = name;
        this._type = type;
        this._classId = classId;
        this._subjectId = subjectId;
        this._createBy = createBy;
        this._createDate = createDate;
        this._teacherId = teacherId;
        this._updateBy = updateBy;
        this._updateDate = updateDate;
        this._delFlag = delFlag;
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

    get classId() {
        return this._classId;
    }

    set classId(value) {
        this._classId = value;
    }

    get subjectId() {
        return this._subjectId;
    }

    set subjectId(value) {
        this._subjectId = value;
    }

    get createBy() {
        return this._createBy;
    }

    set createBy(value) {
        this._createBy = value;
    }
    
    
    get createDate() {
        return this._createDate;
    }

    set createDate(value) {
        this._createDate = value;
    }
    
    get teacherId() {
        return this._teacherId;
    }

    set teacherId(value) {
        this._teacherId = value;
    }
    
    get updateBy() {
        return this._updateBy;
    }

    set updateBy(value) {
        this._updateBy = value;
    }
    
    get updateDate() {
        return this._updateDate;
    }

    set updateDate(value) {
        this._updateDate = value;
    }
    
    get delFlag() {
        return this._delFlag;
    }

    set delFlag(value) {
        this._delFlag = value;
    }

}

module.exports = TeachingGroup
