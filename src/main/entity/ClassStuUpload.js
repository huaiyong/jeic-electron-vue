class ClassStuUpload{


    constructor(classRecordId,resourceId,resourceName,resourceUrl,stuId,createTime){
        this._classRecordId = classRecordId;		//课堂记录ID
        this._resourceId = resourceId;				//资源ID
        this._resourceName = resourceName;			//资源名
        this._resourceUrl = resourceUrl;			//资源路径
        this._stuId= stuId;							//学生ID
        this._createTime = createTime;				//创建时间
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
    get resourceName() {
        return this._resourceName;
    }

    set resourceName(value) {
        this._resourceName = value;
    }
    get resourceUrl() {
        return this._resourceUrl;
    }

    set resourceUrl(value) {
        this._resourceUrl = value;
    }
    get stuId() {
        return this._stuId;
    }

    set stuId(value) {
        this._stuId = value;
    }

    get createTime() {
        return this._createTime;
    }

    set createTime(value) {
        this._createTime = value;
    }
}

module.exports = ClassStuUpload
