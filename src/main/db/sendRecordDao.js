const DB = require('./db').getdb();
const conn = require('./db');
var log4js = require('log4js');
var logger = log4js.getLogger();
const SendRecord = require('../entity/SendRecord');
const RecordStu = require('../entity/RecordStu');
const answerResult = require('../entity/answerResult');


// 添加 下发表
function insertSendRecord(obj,creatuuid,startDate) {
	var sql="INSERT INTO send_record(id,name,type,send_type,answer_type,teaching_group_id,stop_answer,class_record_id,resource_id,resource_url,teacher_id,create_date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?);"
	let stmt = DB.prepare(sql);
    stmt.run(creatuuid, obj.resourceName,obj.type,obj.sendType,obj.answerType,obj.teachingGroupId,0,obj.classRecordId,obj.resourceId,obj.resourceUrl,obj.teacherId,startDate);
    stmt.finalize();
}

// 添加到下发学生关联表中

function insertRecordStu(obj,creatuuid) {
	var sql="INSERT INTO record_stu(record_id,user_id,device_id) VALUES (?,?,?);";
	let recordStuStmt = DB.prepare(sql);
	recordStuStmt.run([creatuuid,obj.userId,obj.deviceName]);
	recordStuStmt.finalize();
}

// 添加学生答题表
function insertAnswerResult(obj,user,trueAnswer,creatuuid,startDate) {
	var sql="INSERT INTO answer_result(class_record_id,record_id,user_id,device_id,realname,resource_id,datamark,answer,true_answer,result,score,type,option_number,create_date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?);";
    let answerResultStmt = DB.prepare(sql);
	answerResultStmt.run([obj.classRecordId, creatuuid, user.userId,user.deviceName,user.realname,obj.resource_id, trueAnswer.order,null,trueAnswer.answer,null,trueAnswer.score,trueAnswer.type, trueAnswer.option.length,startDate]);
	answerResultStmt.finalize();
}

function insertAnswer(list,res) {
	var sql="INSERT INTO answer(full_id,record_id,device_id,datamark,data,result) VALUES (?,?,?,?,?,?);";
    DB.serialize(function (err, result) {
    	DB.run('BEGIN');
    	for(var i=0;i < list.length;i++) {
    		console.log(sql);
    		let stmt = DB.prepare(sql);
		    stmt.run(list[i].fullId,list[i].recordId,list[i].deviceId,list[i].datamark,list[i].data,list[i].result);
		    stmt.finalize();
    	}
    	DB.run('COMMIT');
    	if(err){
        	return res.json({err_code: 0, msg: '保存失败', affectedRows: 0})
        }else{
        	return res.json({err_code: 1, msg: "保存成功", affectedRows: 0})
        }
    });
}

function insertAnswer2(answer) {
	var sql="INSERT INTO answer(full_id,record_id,device_id,datamark,data,result) VALUES (?,?,?,?,?,?);";
    DB.serialize(function (err, result) {
    	DB.run('BEGIN');
    		let stmt = DB.prepare(sql);
		    stmt.run(answer.fullId,answer.recordId,answer.deviceId,answer.datamark,answer.data,answer.result);
		    stmt.finalize();
    	DB.run('COMMIT');
    });
}

function insertPadAnswer(answer) {
	var sql="INSERT INTO pad_answer(full_id,record_id,user_id,qid,data,result) VALUES (?,?,?,?,?,?);";
    DB.serialize(function (err, result) {
    	DB.run('BEGIN');
    		let stmt = DB.prepare(sql);
		    stmt.run(answer.fullId,answer.recordId,answer.userId,answer.qid,answer.data,answer.result);
		    stmt.finalize();
    	DB.run('COMMIT');
    });
}

//获取抢答结果
function getRushAnswered(param,type,teachinggroupId,callback){
	var sql = "select * from student where device in('"+param+"');";
	if(type==3){
		sql = "SELECT a.name AS realname, a.device AS device, a.sex AS sex, c.name AS groupName FROM student AS a JOIN student_usergroup AS b ON a.id = b.student_id JOIN usergroup AS c ON b.usergroup_id = c.id WHERE c.teachinggroup_id = '" + teachinggroupId+"' AND device IN ('"+param+"');";
	}
    logger.info(sql);
    conn.queryData(sql,callback);
}

//根据课堂id查询下发列表
function findSendRecord(classRecordId,callback) {
  var sql="select * FROM send_record WHERE class_record_id ='"+classRecordId+"'";
  logger.info(sql);
  conn.queryData(sql,callback);
}
//获取课堂记录里已答题的用户
function getAnsweredUser(classRecordId,callback) {
  var sql="select DISTINCT user_id FROM answer_result WHERE record_id ='"+classRecordId+"' AND answer IS NOT NULL";
  logger.info(sql);
  conn.queryData(sql,callback);
}

//获取课堂记录里已答题的用户
function getAnsweredUserBy(classRecordId,callback) {
  var sql="select DISTINCT stu_id FROM class_stu_back WHERE send_record_id ='"+classRecordId+"'";
  logger.info(sql);
  conn.queryData(sql,callback);
}



module.exports.insertSendRecord = insertSendRecord
module.exports.insertRecordStu = insertRecordStu
module.exports.insertAnswerResult = insertAnswerResult
module.exports.insertAnswer = insertAnswer
module.exports.insertAnswer2 = insertAnswer2
module.exports.insertPadAnswer = insertPadAnswer
module.exports.getRushAnswered = getRushAnswered
module.exports.findSendRecord = findSendRecord


module.exports.getAnsweredUser = getAnsweredUser
module.exports.getAnsweredUserBy = getAnsweredUserBy
