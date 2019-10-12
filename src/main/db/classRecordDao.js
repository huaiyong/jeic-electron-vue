const DB = require('./db').getdb();
const conn = require('./db');
var log4js = require('log4js');
var logger = log4js.getLogger();

/**
 * 开始上课
 * @param {Object} jsonObj
 * @param {Object} callback
 */
function insertstartClass(jsonObj) {

	var officeName = jsonObj.officeName; //学校名称
	var gradeName = jsonObj.gradeName;
	var classId = jsonObj.classId;
	var className = jsonObj.className;

	var stuList = jsonObj.userList;
	//插入学生数据信息
	var sql = "Replace INTO student(id,name,sex,device,office_name,grade_name,class_id,class_name) VALUES ";
	//遍历学生列表 获取学生信息
	for(var i = 0; i < stuList.length; i++) {
		var device = stuList[i].deviceName;
		var userId = stuList[i].userId;
		var realname = stuList[i].realname;
		var sex = stuList[i].sex;
		//循环插入学生数据信息
		//DB.run(sql, userId, realname, sex, device,jsonObj.officeName, jsonObj.gradeName,jsonObj.classId, jsonObj.className);
		if((i+1) == stuList.length){
			sql += "('"+userId+"','"+realname+"','"+sex+"','"+device+"','"+officeName+"','"+gradeName+"','"+classId+"','"+className+"')";
		}else{
			sql += "('"+userId+"','"+realname+"','"+sex+"','"+device+"','"+officeName+"','"+gradeName+"','"+classId+"','"+className+"'),";
		}
	}
	console.log(sql)
	DB.run(sql);
	var sql = "INSERT INTO class_record( id , teacher_id ,  teacher_name , office_id , office_name , grade_id , grade_name ,  class_id , class_name , subject_id , subject_name , start_time , end_time ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
	DB.run(sql, jsonObj.classRecordId, jsonObj.teacherId, jsonObj.teacherName, jsonObj.officeId, jsonObj.officeName, jsonObj.gradeId, jsonObj.gradeName, jsonObj.classId, jsonObj.className, jsonObj.subjectId, jsonObj.subjectName, jsonObj.startTime, null);
}

/**
 * 下课更新结束时间
 * @param {Object} classRecordId
 * @param {Object} endTime
 * @param {Object} callback
 */
function updateEndTime(classRecordId,endTime) {
    var sql = "update class_record set end_time = '"+endTime+"' WHERE id = '"+classRecordId+"'";
    logger.info(sql);
    DB.run(sql);
}

module.exports.updateEndTime = updateEndTime
module.exports.insertstartClass = insertstartClass
