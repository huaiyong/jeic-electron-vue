const DB = require('./db').getdb();
const conn = require('./db');
var log4js = require('log4js');
var logger = log4js.getLogger();
const uuid = require('node-uuid');
function insertSend(jsonObj) {
	var teacherId = jsonObj.teacherId; //教師ID
	var resourceId = jsonObj.resourceId; // 資源ID
	var resourceUrl = jsonObj.resourceUrl; //  照片路徑
	var classRecordId = jsonObj.classRecordId; // 課堂記錄ID
	var id =jsonObj.id;
	var createTime=jsonObj.createTime
	//1。全班教學 教師拍照下發給全班學生 2，分組教學模式 拍照下發給組長  3 分組教學 發送個單個小組所有學生
	var answerType = jsonObj.answerType;
	var type=jsonObj.type;//下發類型 1  下发试题  2  下发图片  3  下发拍照创题
	var stuList = jsonObj.stuList; // 學生列表
	var teachinggroupId = jsonObj.teachinggroupId;
	var name = jsonObj.name;
	
	var sendRecordSql = "INSERT INTO send_record (id,name,type,answer_type,teaching_group_id,stop_answer,class_record_id,resource_id,resource_url,teacher_id,create_date) VALUES (?,?,?,?,?,?,?,?,?,?,?)"
	DB.run(sendRecordSql,id, name, type, answerType, null,0, classRecordId, resourceId, resourceUrl, teacherId, createTime);
	var recordStuSql= "INSERT INTO record_stu(record_id,user_id,device_id)VALUES(?,?,?)";
	for(var i = 0; i < stuList.length; i++) {
		var device = stuList[i].deviceName;
		var userId = stuList[i].userId;
		var deviceId = stuList[i].deviceId;
		DB.run(recordStuSql,id, userId, deviceId);
	}
}
//class_stu_back 學生回傳
function backPhotos(jsonData){
	var classRecordId=jsonData.classRecordId
	var type=jsonData.type
	var id=jsonData.id
	var resourceId=jsonData.resourceId
	var resourceName=jsonData.resourceName
	var resourceUrl=jsonData.resourceUrl
	var stuId=jsonData.stuId
	var sql=("insert into student_back_picture(class_record_id, type, send_record_id, resource_id, resource_name, resource_url, stu_id,create_time)values(?,?,?,?,?,?,?,?)")
	DB.run(sql, classRecordId, type, id,resourceId,resourceName,resourceUrl,stuId,jsonData.createTime)
}

module.exports.backPhotos =backPhotos
module.exports.insertSend = insertSend
