class UserGroup {
    constructor(id,name,studentId,studentName,leaderFlag,teachinggroupId,createBy,createDate,updateBy,updateDate,delFlag){
        this._id = id;
        this._name = name;
        this._studentId = studentId;
        this._studentName = studentName;
        this._leaderFlag = leaderFlag;
        this._teachinggroupId= teachinggroupId;
        this._createBy = createBy;
        this._createDate = createDate;
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
    
    get studentId() {
        return this._studentId;
    }

    set studentId(value) {
        this._studentId = value;
    }
    
    get studentName() {
        return this._studentName;
    }

    set studentName(value) {
        this._studentName = value;
    }
    
    get leaderFlag() {
        return this._leaderFlag;
    }

    set leaderFlag(value) {
        this._leaderFlag = value;
    }
    

    get teachinggroupId() {
        return this._teachinggroupId;
    }

    set teachinggroupId(value) {
        this._teachinggroupId = value;
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

module.exports = UserGroup
