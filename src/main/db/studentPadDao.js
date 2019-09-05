const DB = require('./db').getdb();
const conn = require('./db');
var log4js = require('log4js');
var logger = log4js.getLogger();
const uuid = require('node-uuid');
function insertSend(req, callback) {
	var jsonObj = req.body;
	var teacherId = jsonObj.teacherId; //教師ID
	var resourceId = jsonObj.resourceId; // 資源ID
	var resourceUrl = jsonObj.resourceUrl; //  照片路徑
	var classRecordId = jsonObj.classRecordId; // 課堂記錄ID
	//1。全班教學 教師拍照下發給全班學生 2，分組教學模式 拍照下發給組長  3 分組教學 發送個單個小組所有學生
	var type = jsonObj.type;
	var stuList = jsonObj.stuList; // 學生列表
	var teachinggroupId = jsonObj.teachinggroupId;
	console.log("參數》teachinggroupId》》" + teachinggroupId)
	var name = jsonObj.name;
	var id = uuid.v1();
	var createTime = new Date();
	if(type == 1) { //全班教學模式 拍照下發給全班學生
		var sql1 = "INSERT INTO record_stu(record_id,user_id,device_id)VALUES(?,?,?)";
		for(var i = 0; i < stuList.length; i++) {
			var device = stuList[i].deviceName;
			var userId = stuList[i].userId;
			var deviceId = stuList[i].deviceId;
			DB.run(sql1, id, userId, deviceId);
		}
		var sql = "INSERT INTO send_record (id,name,type,send_type,answer_type,teaching_group_id,stop_answer,class_record_id,resource_id,resource_url,teacher_id,create_date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)"
		DB.run(sql, id, name, type, 2, null, null, null, classRecordId, resourceId, resourceUrl, teacherId, createTime)
		callback(id,createTime);
	} else if(type == 2) { //2，分組教學模式 拍照下發給組長 
		console.log("分組教學模式 拍照下發給組長")
		var sql = "INSERT INTO send_record (id,name,type,send_type,answer_type,teaching_group_id,stop_answer,class_record_id,resource_id,resource_url,teacher_id,create_date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)"
		var sql1 = "INSERT INTO record_stu(record_id,user_id,device_id)VALUES(?,?,?)";
		for(var i = 0; i < stuList.length; i++) {
			var device = stuList[i].deviceName;
			var userId = stuList[i].userId;
			var deviceId = stuList[i].deviceId;
			DB.run(sql1, id, userId, deviceId);
		}
		DB.run(sql, id, name, type, 2, null, teachinggroupId, null, classRecordId, resourceId, resourceUrl, teacherId, createTime)
		callback(id,createTime);
	}else if(type == 3){//分組教學模式全組作答 拍照下發給當前小組的
		console.log("分組教學模式全組作答 拍照下發給當前小組的")
		var sql = "INSERT INTO send_record (id,name,type,send_type,answer_type,teaching_group_id,stop_answer,class_record_id,resource_id,resource_url,teacher_id,create_date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)"
		var sql1 = "INSERT INTO record_stu(record_id,user_id,device_id)VALUES(?,?,?)";
		for(var i = 0; i < stuList.length; i++) {
			var device = stuList[i].deviceName;
			var userId = stuList[i].userId;
			var deviceId = stuList[i].deviceId;
			DB.run(sql1, id, userId, deviceId);
		}
		DB.run(sql, id, name, type, 2, null, teachinggroupId, null, classRecordId, resourceId, resourceUrl, teacherId, createTime)
		callback(id,createTime);
	}
}
//class_stu_back 學生回傳
function backPhotos(req,callback){
	var jsonObj = req.body;
	var classRecordId=jsonObj.classRecordId
	var type=jsonObj.type
	var id=jsonObj.id
	var resourceId=jsonObj.resourceId
	var resourceName=jsonObj.resourceName
	var resourceUrl=jsonObj.resourceUrl
	var stuId=jsonObj.stuId
	var createTime = new Date();
	var sql=("insert into student_back_picture(class_record_id, type, send_record_id, resource_id, resource_name, resource_url, stu_id,create_time)values(?,?,?,?,?,?,?,?)")
	DB.run(sql, classRecordId, type, id,resourceId,resourceName,resourceUrl,stuId)
	callback(id,createTime);
}

module.exports.backPhotos =backPhotos
module.exports.insertSend = insertSend
