var express = require('express');
var router = express.Router();
var url = require('url');
const UserGroup = require('../entity/UserGroup');
const DB = require('../db/userGroupDao');
const returnMsgUtil = require('../common/returnMsgUtils');
const uuid = require('node-uuid');
const db = require('../db/db').getdb();
var log4js = require('log4js');
var logger = log4js.getLogger();


/**
 * 查询某个教学组的所有小组和小组成员
 */
router.get('', function(req, res, next) {
	var teachinggroupId = req.param('teachinggroupId');
	var userGroupParam = new UserGroup();
	userGroupParam.teachinggroupId = teachinggroupId;
	DB.findUserGroup(userGroupParam,function (rows) {
		var list = [];//小组id集合
		var stuGrouplist = [];//小组集合
		if(rows.length > 0){
			for(var userGroup of rows){
				if(list.indexOf(userGroup.id) == -1){//如果list中没有 则去添加
					list.push(userGroup.id);
				}
			}
			list.forEach(function(v,i,a){
				var groupMap = {};//第一个小组map
				var studentList = [];//第一个小组的学生
		        for(var userGroup of rows){
					if(userGroup.id==v){
						var studentMap = {};//学生map
						groupMap["id"]=userGroup.id;//小组id
						groupMap["name"]=userGroup.name;//小组名字
						studentMap["studentId"]=userGroup.student_id;
						studentMap["studentName"]=userGroup.student_name;
						studentMap["leaderFlag"]=userGroup.leader_flag;
						studentMap["classId"]=userGroup.class_id;
						studentMap["className"]=userGroup.class_name;
						studentMap["device"]=userGroup.device;
						studentMap["gradeName"]=userGroup.grade_name;
						studentMap["officeName"]=userGroup.office_name;
						studentMap["sex"]=userGroup.sex;
						studentList.push(studentMap);
						groupMap["studentsList"]=studentList;
					}
				}
		        stuGrouplist.push(groupMap);
			});	
		}
		res.json({
			data: stuGrouplist,			
			message: "获取小组和成员成功",
			ret: 200
		})
		
	})

});

function callback(result,res){
    res.json({
        msg: result
    })
}

module.exports = router;
