const db = require('./db').getdb();
const conn = require('./db');
var log4js = require('log4js');
var logger = log4js.getLogger();

function getAnswerByRecordId(answerResult,callback) {
    var sql = "select * from answer_result where record_id = '"+answerResult.recordId+"'GROUP BY datamark;";
    conn.queryData(sql,callback)
}

//统计全班教學模式  答题情况   小組教學模式  組長作答 每道題情況  usergroupId,, teachinggroupId
function getDataGroupByUser(req, callback) {
	var type = req.param('type');
	var recordId = req.param('recordId');
	var teachinggroupId= req.param('teachinggroupId');
	var usergroupId=req.param('usergroupId');
	if(type == 1) {
		var sql = "select a.option_number AS optionNumber, a.type AS type, a.answer AS answer, a.user_id AS userId, a.realname AS realname, COUNT(record_id) AS Count, COUNT(result = 1 OR NULL) AS trueCount, COUNT(result = 1 OR NULL)/COUNT(record_id) AS accuracy, COUNT(result = 0 OR NULL) AS falseCount  from answer_result AS a where a.record_id ='" + recordId + "' GROUP BY a.user_id ORDER BY trueCount DESC";
	} else if(type == 2) {
		var sql = "SELECT a.option_number AS optionNumber,a.answer AS answer,a.realname AS userName, a.user_id AS userId, a.type AS type, b.usergroup_id AS usergroupId, c.name AS usergroupName, COUNT(record_id) AS Count, COUNT(result = 1 OR NULL) AS trueCount, COUNT(result = 1 OR NULL) / COUNT(record_id) AS accuracy, COUNT(result = 0 OR NULL) AS falseCount FROM answer_result AS a, student_usergroup AS b, usergroup AS c, teachinggroup AS d WHERE a.record_id = '" + recordId + "' AND b.student_id = a.user_id  AND d.id = '"+teachinggroupId+"' AND c.id =b.usergroup_id  AND b.leader_flag = 1  GROUP BY	a.user_id ORDER BY trueCount DESC "
	} else if(type == 3) { // 
		if(usergroupId!=null && usergroupId !=''){
			var sql = "SELECT a.option_number AS optionNumber,a.answer AS answer,a.realname AS userName, a.user_id AS userId, a.type AS type, b.usergroup_id AS usergroupId, c.name AS usergroupName, COUNT(record_id) AS Count, COUNT(result = 1 OR NULL) AS trueCount, COUNT(result = 1 OR NULL) / COUNT(record_id) AS accuracy, COUNT(result = 0 OR NULL) AS falseCount FROM answer_result AS a, student_usergroup AS b, usergroup AS c, teachinggroup AS d WHERE a.record_id = '" + recordId + "' AND b.student_id = a.user_id  AND d.id = '"+teachinggroupId+"' AND  c.id='"+usergroupId+"' AND b.usergroup_id=c.id     GROUP BY	a.user_id ORDER BY trueCount DESC "
		}else{
			var sql = "SELECT a.option_number AS optionNumber,a.answer AS answer,a.realname AS userName, a.user_id AS userId, a.type AS type, b.usergroup_id AS usergroupId, c.name AS usergroupName, COUNT(record_id) AS Count, COUNT(result = 1 OR NULL) AS trueCount, COUNT(result = 1 OR NULL) / COUNT(record_id) AS accuracy, COUNT(result = 0 OR NULL) AS falseCount FROM answer_result AS a, student_usergroup AS b, usergroup AS c, teachinggroup AS d WHERE a.record_id = '" + recordId + "' AND b.student_id = a.user_id  AND d.id = '"+teachinggroupId+"' AND b.usergroup_id = c.id    GROUP BY	a.user_id ORDER BY trueCount DESC "
		}
	}
	logger.debug('debug...');
	logger.info(sql);
	conn.queryData(sql, callback)
}
/**
 * 通过学生ID获取该学生答题情况
 * @param {Object} answerResult
 * @param {Object} callback
 */
function getDataByUserId(answerResult,callback) {
    var sql = "SELECT * FROM answer_result AS a	WHERE a.record_id = '"+answerResult.recordId+"'	AND a.user_id = '"+answerResult.userId+"'";
    conn.queryData(sql,callback)
}

function haveTheAnswerCount(answerResult,callback) {
    var sql = "SELECT COUNT(DISTINCT user_id) FROM answer_result AS a WHERE	a.record_id = '"+answerResult.recordId+"' AND a.`answer` IS NOT NULL";
    conn.queryData(sql,callback)
}

function findAnswerResult(answerResult,callback) {
    var sql = "select * from answer_result where record_id = '"+answerResult.recordId+"';";
    logger.info(sql);
    conn.queryData(sql,callback)

}

/**
 * 查询小组内答题总体情况
 * @param {Object} answerResult
 * @param {Object} callback
 */
function findAnswerResultByUsergroupId(recordId,usergroupId,callback) {
	var sql = "select * from answer_result where record_id = '"+recordId+"';";
	if(typeof(usergroupId)!=="undefined"&&usergroupId!==""){
		sql = "SELECT * FROM answer_result AS a JOIN student_usergroup AS b ON a.user_id = b.student_id WHERE a.record_id = '"+recordId+"' AND b.usergroup_id = '"+usergroupId+"';";
	}
    
    logger.info(sql);
    conn.queryData(sql,callback)

}


function updateAnswerResult(answerResult,flag) {
	if(0 == flag) {
		var sql = "update answer_result set answer = '"+answerResult.answer+"',result = '"+answerResult.result+"' where record_id = '"+answerResult.recordId+"' and " +
      " datamark = '"+answerResult.datamark+"' and device_id = '"+answerResult.deviceId+"';";
	}else {
		var sql = "update answer_result set answer = '"+answerResult.answer+"',result = '"+answerResult.result+"' where record_id = '"+answerResult.recordId+"' and " +
      " datamark = '"+answerResult.datamark+"' and user_id = '"+answerResult.userId+"';";
	}
    logger.info(sql);
    conn.executeSql(sql)
}

function getAnswerResult(answerResult,callback) {
	var sql = "SELECT * FROM answer_result WHERE record_id = '"+answerResult.recordId+"' AND device_id = '"+answerResult.deviceId+"' AND datamark = '"+answerResult.datamark+"';";
	conn.queryData(sql,callback)
}
// 查看單題選項情況
function getDataByQuestionId(req, callback) {
	var type = req.param('type');
	var recordId = req.param('recordId');
	var teachinggroupId= req.param('teachinggroupId');
	var usergroupId=req.param('usergroupId');
	var datamark=req.param('datamark');
	if(type == 1) { //全班教學模式
		var sql = "select result,score,device_id,user_id, realname,answer,true_answer,type,option_number  from answer_result a  WHERE a.record_id = '" + recordId + "' and a.datamark=" + datamark;
	} else if(type == 2) { //小組教學模式 組長作答
		var sql = "select   a.result, a.score, c.name, a.answer, a.true_answer, b.usergroup_id, a.option_number, a.device_id, a.realname, a.user_id, a.type from answer_result a, student_usergroup b ,usergroup c , teachinggroup d  WHERE a.record_id = '" + recordId + "' AND b.student_id=a.user_id AND b.leader_flag= '" + 1 + "'AND d.id='" + teachinggroupId + "'  AND b.usergroup_id=c.id and a.datamark=" + datamark;
	} else if(type == 3) { //小組教學模式   全組作答
		if(teachinggroupId!=null&&usergroupId!=null){
			console.log("題號1》》》"+datamark)
			var sql = "select   a.result, a.score, c.name, a.answer, a.true_answer, b.usergroup_id, a.option_number, a.device_id, a.realname, a.user_id, a.type from answer_result a, student_usergroup b ,usergroup c , teachinggroup d  WHERE a.record_id = '" + recordId + "' AND b.student_id=a.user_id AND   d.id='" + teachinggroupId + "'  AND c.id='"+usergroupId+"' AND c.id=b.usergroup_id and a.datamark=" + datamark;
		}else{
			console.log("題號2》》》"+datamark)
			var sql = "select   a.result, a.score, c.name, a.answer, a.true_answer, b.usergroup_id, a.option_number, a.device_id, a.realname, a.user_id, a.type from answer_result a, student_usergroup b ,usergroup c , teachinggroup d  WHERE a.record_id = '" + recordId + "' AND b.student_id=a.user_id AND    c.id=b.usergroup_id and a.datamark=" + datamark;
		}
	}
	logger.debug('debug...');
	logger.info(sql);
	conn.queryData(sql, callback)
}

module.exports.getDataByQuestionId = getDataByQuestionId //統計單個題的答題情況
module.exports.findAnswerResult = findAnswerResult
module.exports.updateAnswerResult = updateAnswerResult
module.exports.getAnswerByRecordId = getAnswerByRecordId
module.exports.getAnswerResult = getAnswerResult
module.exports.getDataGroupByUser = getDataGroupByUser
module.exports.haveTheAnswerCount = haveTheAnswerCount
module.exports.getDataByUserId = getDataByUserId
module.exports.findAnswerResultByUsergroupId = findAnswerResultByUsergroupId