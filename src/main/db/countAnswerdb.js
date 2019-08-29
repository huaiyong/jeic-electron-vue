const DB = require('./db').getdb();
const uuid = require('node-uuid');
const querystring = require('querystring');
var log4js = require('log4js');
var logger = log4js.getLogger();
const conn = require('./db');
//统计全班教學模式  答题情况   小組教學模式  組長作答 每道題情況  usergroupId,, teachinggroupId
function getDataGroupByUser(req, callback) {
	var type = req.param('type');
	var recordId = req.param('recordId');
	var teachinggroupId= req.param('teachinggroupId');
	var usergroupId=req.param('usergroupId');
	if(type == 1) {
		var sql = "select a.option_number AS optionNumber, a.type AS type, a.answer AS answer, a.user_id AS userId, a.realname AS realname, COUNT(record_id) AS Count, COUNT(result = 1 OR NULL) AS trueCount, COUNT(result = 1 OR NULL)/COUNT(record_id) AS accuracy, COUNT(result = 0 OR NULL) AS falseCount  from answer_result AS a where a.record_id ='" + recordId + "' GROUP BY a.user_id ORDER BY trueCount DESC";
	} else if(type == 2) {
		var sql = "SELECT a.option_number AS optionNumber,a.answer AS answer,a.realname AS userName, a.user_id AS userId, a.type AS type, b.usergroup_id AS usergroupId, c.name AS usergroupName, COUNT(record_id) AS Count, COUNT(result = 1 OR NULL) AS trueCount, COUNT(result = 1 OR NULL) / COUNT(record_id) AS accuracy, COUNT(result = 0 OR NULL) AS falseCount FROM answer_result AS a, student_usergroup AS b, usergroup AS c, teachinggroup AS d WHERE a.record_id = '" + recordId + "' AND b.student_id = a.user_id  AND d.id = '"+teachinggroupId+"' AND b.usergroup_id = c.id  AND b.leader_flag = 1  GROUP BY	a.user_id ORDER BY trueCount DESC "
	} else if(type == 3) { // 
		if(usergroupId!=null && usergroupId !=''){
			console.log("小組ID "+usergroupId)
			var sql = "SELECT a.option_number AS optionNumber,a.answer AS answer,a.realname AS userName, a.user_id AS userId, a.type AS type, b.usergroup_id AS usergroupId, c.name AS usergroupName, COUNT(record_id) AS Count, COUNT(result = 1 OR NULL) AS trueCount, COUNT(result = 1 OR NULL) / COUNT(record_id) AS accuracy, COUNT(result = 0 OR NULL) AS falseCount FROM answer_result AS a, student_usergroup AS b, usergroup AS c, teachinggroup AS d WHERE a.record_id = '" + recordId + "' AND b.student_id = a.user_id  AND d.id = '"+teachinggroupId+"' AND  c.id='"+usergroupId+"'    GROUP BY	a.user_id ORDER BY trueCount DESC "
		}else{
			var sql = "SELECT a.option_number AS optionNumber,a.answer AS answer,a.realname AS userName, a.user_id AS userId, a.type AS type, b.usergroup_id AS usergroupId, c.name AS usergroupName, COUNT(record_id) AS Count, COUNT(result = 1 OR NULL) AS trueCount, COUNT(result = 1 OR NULL) / COUNT(record_id) AS accuracy, COUNT(result = 0 OR NULL) AS falseCount FROM answer_result AS a, student_usergroup AS b, usergroup AS c, teachinggroup AS d WHERE a.record_id = '" + recordId + "' AND b.student_id = a.user_id  AND d.id = '"+teachinggroupId+"' AND b.usergroup_id = c.id    GROUP BY	a.user_id ORDER BY trueCount DESC "
		
		}
		
	}
	logger.debug('debug...');
	logger.info(sql);
	conn.queryData(sql, callback)
}

//統計答題   平均正確率  已答題未答題人數
function getavgeByRecordId(recordId, type, usergroupId, callback) {
	if(type == 1) { //全班教學模式
		var sql = "SELECT 	COUNT(a.record_id) AS Count, COUNT(a.result = 1 OR NULL) AS trueCount, COUNT(a.answer = '' OR NULL) AS nothaveTheAnswerCount, COUNT(a.result=1 OR a.result=0 OR NULL) AS haveTheAnswerCount  FROM answer_result AS a WHERE a.record_id ='" + recordId + "';";
	} else if(type == 2) { //分組教學模式 組長作答
		var sql = "SELECT COUNT(a.record_id) AS Count, COUNT(a.result = 1 OR NULL) AS trueCount, COUNT(a.answer = '' OR NULL) AS nothaveTheAnswerCount, COUNT( a.result = 1 OR a.result = 0 OR NULL ) AS haveTheAnswerCount FROM answer_result AS a, student_usergroup AS b WHERE a.user_id=b.student_id AND	b.leader_flag=1  AND  a.record_id = '" + recordId + "' ;";
	} else if(type == 3) { //分組教學模式 全組作答
		var sql = "SELECT 	COUNT(a.record_id) AS Count, COUNT(a.result = 1 OR NULL) AS trueCount, COUNT(a.answer = '' OR NULL) AS nothaveTheAnswerCount, COUNT(a.result=1 OR a.result=0 OR NULL) AS haveTheAnswerCount  FROM answer_result AS a WHERE a.record_id ='" + recordId + "';";
	}
	logger.debug('debug...');
	logger.info(sql);
	conn.queryData(sql, callback)
}

// 查看單題選項情況
function getDataByQuestionId(recordId, type, datamark, usergroupId, callback) {
	if(type == 1) { //全班教學模式
		var sql = "select result,score,device_id,user_id, realname,answer,true_answer,type,option_number  from answer_result a  WHERE a.record_id = '" + recordId + "' and a.datamark=" + datamark;
	} else if(type == 2) { //小組教學模式 組長作答
		var sql = "select   a.result, a.score, c.name, a.answer, a.true_answer, b.usergroup_id, a.option_number, a.device_id, a.realname, a.user_id, a.type from answer_result a, student_usergroup b ,usergroup c , teachinggroup d  WHERE a.record_id = '" + recordId + "' AND b.student_id=a.user_id AND b.leader_flag= '" + 1 + "'AND d.id='" + usergroupId + "'  AND b.usergroup_id=c.id and a.datamark=" + datamark;
	} else if(type == 3) { //小組教學模式   全組作答
		var sql = "select   a.result, a.score, c.name, a.answer, a.true_answer, b.usergroup_id, a.option_number, a.device_id, a.realname, a.user_id, a.type from answer_result a, student_usergroup b ,usergroup c , teachinggroup d  WHERE a.record_id = '" + recordId + "' AND b.student_id=a.user_id AND   d.id='" + usergroupId + "'  AND b.usergroup_id=c.id and a.datamark=" + datamark;
	}
	logger.debug('debug...');
	logger.info(sql);
	conn.queryData(sql, callback)
}

module.exports.getDataByQuestionId = getDataByQuestionId //統計單個題的答題情況
module.exports.getDataGroupByUser = getDataGroupByUser
module.exports.getavgeByRecordId = getavgeByRecordId