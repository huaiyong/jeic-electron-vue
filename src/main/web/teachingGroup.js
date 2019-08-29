var express = require('express');
var router = express.Router();
var url = require('url');
const TeachingGroup = require('../entity/TeachingGroup');
const UserGroup = require('../entity/UserGroup');
const httpUtil = require('../utils/httpUtil');
var config = require('../config')
const renderer = require("../../../modules/renderer");
const DB = require('../db/userGroupDao');
const returnMsgUtil = require('../common/returnMsgUtils');
const uuid = require('node-uuid');
const db = require('../db/db').getdb();
var log4js = require('log4js');
var logger = log4js.getLogger();




/**
 * 存入分组数据
 */
router.post('', function(req, res, next) {
		let obj;
		if (req.body) {
			obj = req.body.GroupData;
			console.log(obj);
		}else {
			returnMsgUtil.returnMsg(res,400,'请传参数！',null)
		}
		var creatuuid = uuid.v1();
		//v1 根据时间戳和随机数生成的uuid
		//var creatuuid= uuid.v1();
	    var start = new Date();
	    
	    var saveTeachingGroupSql="INSERT INTO teachinggroup(id,name,type,class_id,subject_id,create_by,create_date,teacher_id,update_by,update_date,del_flag) VALUES (?,?,?,?,?,?,?,?,?,?,?);"
	    var saveStudentSql="INSERT INTO student_usergroup(id,usergroup_id,student_id,student_name,leader_flag,del_flag) VALUES (?,?,?,?,?,?);";
	    var saveUserGroupSql="INSERT INTO usergroup(id,name,teachinggroup_id,create_date,del_flag) VALUES (?,?,?,?,?);";
	    db.serialize(function (err, result) {
	        db.run('BEGIN');
	        //存入教学组数据
	        let stmt = db.prepare(saveTeachingGroupSql);
	        stmt.run(creatuuid, obj.name,obj.type,obj.class_id,obj.subject_id,obj.teacher_id,start,obj.teacher_id,obj.teacher_id,start,0);
	        stmt.finalize();
	        var userList=obj.userGrouplist;//多个组的list
			for(var u in userList){
				//存入用户组数据
				let saveUserGroupStmt = db.prepare(saveUserGroupSql);
				var id = uuid.v1();
				saveUserGroupStmt.run([id,userList[u].name,creatuuid,start,0]);
				saveUserGroupStmt.finalize();
				var students = userList[u].studentList;
				
				var stuLeaderUuid = uuid.v1();
		        var studentLeader = userList[u].groupLeader;
		        if(studentLeader.id!=undefined){
			        let saveStudentStmt = db.prepare(saveStudentSql);
			        saveStudentStmt.run([stuLeaderUuid,id,studentLeader.id,studentLeader.name,1,0]);
			        saveStudentStmt.finalize();
		        }
		        for(var t in students){
		        	//存入用户组的学生信息
		        	var stuUuid = uuid.v1();
		        	let saveStudentStmt = db.prepare(saveStudentSql);
		        	saveStudentStmt.run([stuUuid,id,students[t].id,students[t].name,0,0]);
		        	saveStudentStmt.finalize();
		        }
			}
	        db.run('COMMIT');
	        if(err){
        		returnMsgUtil.returnMsg(res,400,'保存失败',null)
	        }else{
	        	returnMsgUtil.returnMsg(res,200,'保存成功',creatuuid)
	        }
	    });	
});
/**
 * 更新分组教学
 */
router.put('', function(req, res, next) {
	let obj;
	if (req.body) {
		obj = req.body.GroupData;
	}else {
		returnMsgUtil.returnMsg(res,400,'请传参数！',null)
	}
	//var id = obj.id;
	var teachingGroupId = obj.id;
	DB.findUserGroupById(teachingGroupId,function (rows) {
		var list = [];
		if(rows.length > 0){
			for(var userGroup of rows){
				var userGroupId = userGroup.id;
				DB.deleteStudentUserGroup(userGroupId);
			}	
		}
		DB.deleteUserGroup(teachingGroupId);
	})
		var start = new Date();
	    //var teachingGroupId = obj.id;
	    var saveStudentSql="INSERT INTO student_usergroup(id,usergroup_id,student_id,student_name,leader_flag,del_flag) VALUES (?,?,?,?,?,?);";
	    var saveUserGroupSql="INSERT INTO usergroup(id,name,teachinggroup_id,create_date,del_flag) VALUES (?,?,?,?,?);";
	    db.serialize(function (err, result) {
	        db.run('BEGIN');
	        var userList=obj.userGrouplist;//多个组的list
			for(var u in userList){
				//存入用户组数据
				let saveUserGroupStmt = db.prepare(saveUserGroupSql);
				//v1 根据时间戳和随机数生成的uuid
				var id = uuid.v1();
				saveUserGroupStmt.run([id,userList[u].name,teachingGroupId,start,0]);
				saveUserGroupStmt.finalize();
				
				
				var stuLeaderUuid = uuid.v1();
		        var studentLeader = userList[u].groupLeader;
		        if(studentLeader.id!=undefined){
		        	let saveStudentStmt = db.prepare(saveStudentSql);
		        	saveStudentStmt.run([stuLeaderUuid,id,studentLeader.id,studentLeader.name,1,0]);
		       	 	saveStudentStmt.finalize();
		       	}
				
				
				
				var students = userList[u].studentList;
		        for(var t in students){
		        	var stuUserGroupId = uuid.v1();
		        	//存入用户组的学生信息
		        	let saveStudentStmt = db.prepare(saveStudentSql);
		        	saveStudentStmt.run([stuUserGroupId,id,students[t].id,students[t].name,0,0]);
		        	saveStudentStmt.finalize();
		        }
			}
	        db.run('COMMIT');
	        if(err){
        		returnMsgUtil.returnMsg(res,400,'更新失败',null)
	        }else{
	        	returnMsgUtil.returnMsg(res,200,'更新成功',teachingGroupId)
	        }
	    });
});
/**
 * 查询教学组列表
 */
router.get('', function(req, res, next) {
	var classId = req.param('classId');
	var subjectId = req.param('subjectId');
	var teachingGroupParam = new TeachingGroup();
	teachingGroupParam.classId = classId;
	teachingGroupParam.subjectId = subjectId;
	DB.findTeachingGroup(teachingGroupParam,function (rows) {
		var list = [];
		if(rows.length > 0){
			for(var teachingGroup of rows){
				list.push(teachingGroup);
			}	
		}
		res.json({
			data: list,
			message: "获取教学组列表成功",
			ret: 200
		})
		
	})

});
/**
 * 删除某个教学组
 */
router.delete('/:id', function(req, res, next) {
	var id = req.params.id;
	DB.findUserGroupById(id,function (rows) {
		var list = [];
		if(rows.length > 0){
			for(var userGroup of rows){
				var userGroupId = userGroup.id;
				DB.deleteStudentUserGroup(userGroupId);
			}	
		}
		DB.deleteUserGroup(id);
		DB.deleteTeachingGroup(id);
		res.json({
			message: "删除教学组成功",
			ret: 200
		})
	})
});


/**
 * 获取一个教学组以及教学组下用户组及用户
 */
router.get('/:id', function(req, res, next) {
	var teachinggroupId = req.params.id;
	var userGroupParam = new UserGroup();
	userGroupParam.teachinggroupId = teachinggroupId;
	DB.findTeachingGroupById(teachinggroupId,function (rows) {
		if(rows.length > 0){
			var teachingGroupMap = {};
			var teachingGroupId = rows[0].id;
			var teachingGroupName = rows[0].name;
			var teachingGroupType = rows[0].type;
			var teachingGroupClassId = rows[0].class_id;
			var teachingGroupSubjectId = rows[0].subject_id;
			var teachingGroupTeacherId = rows[0].teacher_id;
			teachingGroupMap["id"]=teachingGroupId;
			teachingGroupMap["name"]=teachingGroupName;
			teachingGroupMap["type"]=teachingGroupType;
			teachingGroupMap["class_id"]=teachingGroupClassId;
			teachingGroupMap["subject_id"]=teachingGroupSubjectId;
			teachingGroupMap["teacher_id"]=teachingGroupTeacherId;
			//console.log(teachingGroupId);
			//console.log(teachingGroupName);
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
						var studentLeaderMap = {};//学生map
				        for(var userGroup of rows){
							if(userGroup.id==v){
								var studentMap = {};//学生map
								groupMap["id"]=userGroup.id;//小组id
								groupMap["name"]=userGroup.name;//小组名字
								if(userGroup.leader_flag==1){//小组组长
									studentLeaderMap["id"]=userGroup.student_id;
									studentLeaderMap["name"]=userGroup.student_name;
									studentLeaderMap["leader_flag"]=userGroup.leader_flag;
									studentLeaderMap["class_id"]=userGroup.class_id;
									studentLeaderMap["class_name"]=userGroup.class_name;
									studentLeaderMap["device"]=userGroup.device;
									studentLeaderMap["grade_name"]=userGroup.grade_name;
									studentLeaderMap["office_name"]=userGroup.office_name;
									studentLeaderMap["sex"]=userGroup.sex;
									
								}else if(userGroup.leader_flag==0){
									studentMap["id"]=userGroup.student_id;
									studentMap["name"]=userGroup.student_name;
									studentMap["leader_flag"]=userGroup.leader_flag;
									studentMap["class_id"]=userGroup.class_id;
									studentMap["class_name"]=userGroup.class_name;
									studentMap["device"]=userGroup.device;
									studentMap["grade_name"]=userGroup.grade_name;
									studentMap["office_name"]=userGroup.office_name;
									studentMap["sex"]=userGroup.sex;
									studentList.push(studentMap);
								}
								
								groupMap["studentList"]=studentList;
								groupMap["groupLeader"]=studentLeaderMap;
							}
							
						}
				        stuGrouplist.push(groupMap);
					});	
					teachingGroupMap["userGrouplist"]=stuGrouplist;
				}
				res.json({
					data: teachingGroupMap,			
					message: "获取小组和成员成功",
					ret: 200
				})
			})
		}else{
			res.json({
					message: "获取失败",
					ret: 400
			})
		}
	})
});

function callback(result,res){
    res.json({
        msg: result
    })
}

module.exports = router;
