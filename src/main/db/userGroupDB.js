const db = require('./db').getdb();
const uuid = require('node-uuid');
const conn = require('./db');
//存入教学分组的所有信息
function saveUserGroup(req, callback) {
	
	var data = '';
	var creatuuid = uuid.v1();
	req.on('data', function(chunk) {
		// chunk 默认是一个二进制数据，和 data 拼接会自动 toString
		data += chunk;
	});

	req.on('end', function() {
		data = decodeURI(data);
		console.log("&&&&&&&" + data);
		dataobj = JSON.parse(data)
		const obj = dataobj;
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
	        var userList=obj.userList;//多个组的list
			for(var u in userList){
				//存入用户组数据
				let saveUserGroupStmt = db.prepare(saveUserGroupSql);
				var id = uuid.v1();
				saveUserGroupStmt.run([id,userList[u].name,creatuuid,start,0]);
				saveUserGroupStmt.finalize();
				var students = userList[u].students;
		        for(var t in students){
		        	//存入用户组的学生信息
		        	var stuUuid = uuid.v1();
		        	let saveStudentStmt = db.prepare(saveStudentSql);
		        	saveStudentStmt.run([stuUuid,id,students[t].student_id,students[t].student_name,students[t].leader_flag,0]);
		        	saveStudentStmt.finalize();
		        }
			}
	        db.run('COMMIT');
	    });
	})
	callback(creatuuid);
}

//更新教学分组的所有信息
function updateUserGroup(req, callback) {
	
	var data = '';
	req.on('data', function(chunk) {
		// chunk 默认是一个二进制数据，和 data 拼接会自动 toString
		data += chunk;
	});

	req.on('end', function() {
		data = decodeURI(data);
		console.log("&&&&&&&" + data);
		dataobj = JSON.parse(data)
		const obj = dataobj;
		var start = new Date();
	    var teachingGroupId = obj.id;
	    var saveStudentSql="INSERT INTO student_usergroup(id,usergroup_id,student_id,student_name,leader_flag,del_flag) VALUES (?,?,?,?,?,?);";
	    var saveUserGroupSql="INSERT INTO usergroup(id,name,teachinggroup_id,create_date,del_flag) VALUES (?,?,?,?,?);";
	    db.serialize(function (err, result) {
	        db.run('BEGIN');
	        var userList=obj.userList;//多个组的list
			for(var u in userList){
				//存入用户组数据
				let saveUserGroupStmt = db.prepare(saveUserGroupSql);
				//v1 根据时间戳和随机数生成的uuid
				var id = uuid.v1();
				saveUserGroupStmt.run([id,userList[u].name,teachingGroupId,start,0]);
				saveUserGroupStmt.finalize();
				var students = userList[u].students;
		        for(var t in students){
		        	var stuUserGroupId = uuid.v1();
		        	//存入用户组的学生信息
		        	let saveStudentStmt = db.prepare(saveStudentSql);
		        	saveStudentStmt.run([stuUserGroupId,id,students[t].student_id,students[t].student_name,students[t].leader_flag,0]);
		        	saveStudentStmt.finalize();
		        }
			}
	        db.run('COMMIT');
	        
	    });
	    callback(teachingGroupId);
	})
   
}





//查询教学分组列表
function findTeachingGroup(teachingGroup,callback) {
    var sql = "select * from teachinggroup where class_id = '"+teachingGroup.classId+"' and subject_id = '"+teachingGroup.subjectId+"';";
    //var sql = "select * from teachinggroup where class_id = '"+teachingGroup.classId+"' and subject_id = '345';"
    //logger.info(sql);
    conn.queryData(sql,callback)
}
//删除某个教学组
function deleteTeachingGroup(teachingGroupId,callback) {
    var sql = "update teachinggroup set del_flag = 1 where id = '"+teachingGroupId+"';";
    //logger.info(sql);
    conn.executeSql(sql)
}
//删除某个教学组中的小组
function deleteUserGroup(teachingGroupId,callback) {
    var sql = "DELETE FROM usergroup where teachinggroup_id = '"+teachingGroupId+"';";
    //logger.info(sql);
    conn.executeSql(sql)
}
//通过教学组id查询教学组里面的小组
function findUserGroupById(id,callback) {
    var sql = "select * from usergroup where  teachinggroup_id= '"+id+"';";
    //logger.info(sql);
    conn.queryData(sql,callback)
}
//通过小组id删除小组的成员
function deleteStudentUserGroup(userGroupId,callback) {
    var sql = "DELETE FROM student_usergroup where usergroup_id = '"+userGroupId+"';";
    //logger.info(sql);
    conn.executeSql(sql)
}






//查询某个教学分组的组信息和小组成员
function findUserGroup(userGroup,callback) {
    //var sql = "SELECT a.id,a.name,b.student_id,b.student_name,b.leader_flag from usergroup as a LEFT JOIN student_usergroup as b on a.id = b.usergroup_id where a.teachinggroup_id = '"+userGroup.teachinggroupId+"';";
    var sql = "SELECT a.id,a.name,b.student_id,b.leader_flag,c.class_id,c.class_name,c.device,c.grade_name,c.name as student_name,c.office_name,c.sex from usergroup as a LEFT JOIN student_usergroup as b on a.id = b.usergroup_id LEFT JOIN student AS c ON b.student_id=c.id where a.teachinggroup_id = '"+userGroup.teachinggroupId+"';";
    //logger.info(sql);
    conn.queryData(sql,callback)
}


module.exports.saveUserGroup = saveUserGroup
module.exports.findTeachingGroup = findTeachingGroup
module.exports.findUserGroup = findUserGroup
module.exports.findUserGroupById = findUserGroupById
module.exports.deleteStudentUserGroup = deleteStudentUserGroup
module.exports.deleteUserGroup = deleteUserGroup
module.exports.deleteTeachingGroup = deleteTeachingGroup
module.exports.updateUserGroup = updateUserGroup


