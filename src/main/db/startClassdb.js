const DB = require('./db').getdb();
const uuid = require('node-uuid');
const querystring = require('querystring');
var log4js = require('log4js');
var logger = log4js.getLogger();
const conn = require('./db');
//开始上课保存上课信息
function insertstartClass(req, callback) {
//	var data = '';
	var id = uuid.v1();
//	req.on('data', function(chunk) {
//		// chunk 默认是一个二进制数据，和 data 拼接会自动 toString
//		data += chunk;
//	});

//	req.on('end', function() {
	
//		data = decodeURI(data);
//		console.log("&&&&&&&" + data);
//		dataobj = JSON.parse(data)
//
//		console.log("dataobj==" + dataobj)
		var jsonObj = req.body.jsonData;
		var subjectName = jsonObj.subjectName; //获取科目
		var teacherId = jsonObj.teacherId; //教师ID
		var teacherName = jsonObj.teacherName; //教师名字
		var officeId = jsonObj.officeId; //学校ID
		var officeName = jsonObj.officeName; //学校名称
		var gradeId = jsonObj.gradeId;
		var gradeName = jsonObj.gradeName;
		var classId = jsonObj.classId;
		var className = jsonObj.className;
		var subjectId = jsonObj.subjectId;
		console.log("年级:" + gradeName);
		var startTime = new Date();
		var date = new Date(startTime);
		var YY = date.getFullYear() + '-';
		var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
		var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
		var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
		var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
		var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
		startTime = YY + MM + DD + " " + hh + mm + ss
		//v1 根据时间戳和随机数生成的uuid
		
		var stuList = jsonObj.userList;
		console.log(stuList)
		//插入学生数据信息
		var sql = "INSERT OR IGNORE INTO student(id,name,sex,device,office_name,grade_name,class_id,class_name) VALUES (?,?,?,?,?,?,?,?)";
		//遍历学生列表 获取学生信息
		for(var i = 0; i < stuList.length; i++) {
			console.log("执行中！！！！！！！！！！！！")
			var device = stuList[i].deviceName;
			var userId = stuList[i].userId;
			var realname = stuList[i].realname;
			var sex = stuList[i].sex;
			//循环插入学生数据信息
			DB.run(sql, userId, realname, sex, device,officeName, gradeName,classId, className);
		}
		var sql = "INSERT INTO class_record( id , teacher_id ,  teacher_name , office_id , office_name , grade_id , grade_name ,  class_id , class_name , subject_id , subject_name , start_time , end_time ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
		logger.debug('debug...');
		logger.info('info...');
		logger.warn('warn...');
		logger.error('error...');
		DB.run(sql, id, teacherId, teacherName, officeId, officeName, gradeId, gradeName, classId, className, subjectId, subjectName, startTime, null);
//		DB.close();
		
//	});
	callback(id);
}

//查询上课学生信息
function findStuList(req,callback) {

	var classId = req.param('classId')
	console.log(" 班级ID>>>" + req.param('classId'));
	var sql = "select * from student where class_Id='"+classId+"'";
	logger.info(sql);
	conn.queryData(sql,callback)
}
module.exports.insertstartClass = insertstartClass
module.exports.findStuList = findStuList