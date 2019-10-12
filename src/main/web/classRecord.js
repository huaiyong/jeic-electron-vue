var express = require('express');
var router = express.Router();
const uuid = require('node-uuid');
const userGroupDao = require('../db/userGroupDao');
const httpUtil = require('../utils/httpUtil');
const config = require('../config');
const classRecordDao = require('../db/classRecordDao');
const dateUtil = require('../utils/dateUtil');
const Constants = require('../common/Constants');



/**
 * 开始上课
 */
router.post('/startClass', function(req, res) {
	var id = uuid.v1();
	Constants.classRecordId = id;
	var jsonObj = req.body.jsonData;
	
	var date = dateUtil.currentTime();
	jsonObj["startTime"] = date;
	jsonObj["classRecordId"] = id;
	
	var map = {};
	map["teacherName"]= jsonObj.teacherName; //教师名字
	map["id"]= id;
	map["createBy"]= jsonObj.teacherId; //教师ID
	map["officeId"]= jsonObj.officeId; //学校ID
	map["officeName"]= jsonObj.officeName; //学校名称
	map["gradeId"]= jsonObj.gradeId;
	map["gradeName"]= jsonObj.gradeName;
	map["classId"]= jsonObj.classId;
	map["className"]= jsonObj.className;
	map["subjectId"]= jsonObj.subjectId;
	map["subjectName"]= jsonObj.subjectName; //获取科目
	map["startTime"]= date;
	map["endTime"]= date;
	
	httpUtil.httpPostJSON(config.adminSartClass,map);
	
	classRecordDao.insertstartClass(jsonObj);
	
	res.json({
		data: id,
		message: "上课成功",
		ret: 200
	})
});


/**
 * 下课
 */
router.post('/stopClass', function(req, res, next) {
//	var classRecordId = req.param('classRecordId');
	var classRecordId = Constants.classRecordId;
	global.userMap = {};//清空签到数据
	global.padSigninUserList = [];//清空学生pad签到数据
	//删除临时组
	userGroupDao.findTeachingGroupByType(classRecordId,function (rows) {
		if(rows.length > 0){
			for(var teachingGroup of rows){
				userGroupDao.findUserGroupById(teachingGroup.id,function (rows1) {
					if(rows1.length > 0){
						for(var userGroup of rows1){
							var userGroupId = userGroup.id;
							userGroupDao.deleteStudentUserGroup(userGroupId);
						}	
					}
					userGroupDao.deleteUserGroup(teachingGroup.id);
					userGroupDao.deleteTeachingGroup(teachingGroup.id);
				})
			}	
		}
	})
	var endTime = dateUtil.currentTime();
	classRecordDao.updateEndTime(classRecordId,endTime)
	var map = {};
	map["rId"]= classRecordId; //教师名字
	httpUtil.httpPostJSON(config.adminStopClass,map);
	res.json({
		message: "操作成功",
		ret: 200
	})
});




module.exports = router;
