const db = require('./db').getdb();
const uuid = require('node-uuid');
const conn = require('./db');
var log4js = require('log4js');
var logger = log4js.getLogger();


function updateVoteResult(voteResult,callback) {
    var sql = "update vote_result set result = '"+voteResult.result+"' WHERE vote_id = '"+voteResult.voteId+"' and device_id = '"+voteResult.deviceId+"' and ticket_number = '"+voteResult.ticketNumber+"'";
    logger.info(sql);
    conn.queryData(sql,callback);
}

function findCandidateList(voteId,callback){
    var sql = "SELECT * FROM candidate WHERE vote_id='"+voteId+"'";
    logger.info(sql);
  	conn.queryData(sql,callback);
    //return await conn.asyncRun(sql);
}

async function findCandidateList1(voteId){
    var sql = "SELECT * FROM candidate WHERE vote_id='"+voteId+"'";
    logger.info(sql);
//  conn.queryData(sql,callback);
    return await conn.asyncRun(sql);
}

async function findOneCandidateCount(voteResult) {
    /*var sql = "SELECT count(*) as resultCount FROM candidate a left JOIN vote_result b on a.no = b.result "
				+"where a.vote_id = '"+voteResult.voteId+"'"
				+"and b.class_record_id = '"+voteResult.classRecordId+"'"
				+"and b.vote_id = '"+voteResult.voteId+"'"
				+"and b.result = '"+voteResult.optionNumber+"'";*/
				
	var sql = "SELECT count(*) as resultCount from (SELECT * FROM candidate a left JOIN vote_result b on a.no = b.result "
				+"where a.vote_id = '"+voteResult.voteId+"'"
				+"and b.vote_id = '"+voteResult.voteId+"'"
				+"GROUP BY realname, result) a"
				+" WHERE a.result = '"+voteResult.optionNumber+"'";
    logger.info(sql);
    //conn.queryData(sql,callback);
    return await conn.asyncRun(sql);
}
async function findVoteById(voteId) {
    var sql = "SELECT * FROM vote WHERE id='"+voteId+"'";
    logger.info(sql);
    return await conn.asyncRun(sql);
    //conn.queryData(sql,callback);
}
function deleteVoteResult(voteResult,callback) {
    var sql = "delete FROM vote vote_result where vote_id='"+voteResult.voteId+"' and realname = '"+voteResult.realname+"'";
    logger.info(sql);
    conn.executeSql(sql);
}

function findVoteResultByName(voteResult,callback) {
    var sql = "SELECT * FROM vote_result WHERE vote_id='"+voteResult.voteId+"' and realname = '"+voteResult.realname+"'";
    logger.info(sql);
    conn.queryData(sql,callback);
}
async function findVoteOwn(voteResult) {
    //var sql = "SELECT count(*) voteCount FROM vote_result WHERE vote_id = '"+voteResult.voteId+"' AND realname = '"+voteResult.realname+"' AND result = '"+voteResult.result+"'";
    var sql = "SELECT count(*) as voteCount FROM (SELECT * FROM vote_result WHERE vote_id = '"+voteResult.voteId+"' AND realname = '"+voteResult.realname+"' AND result = '"+voteResult.optionNumber+"' GROUP BY result,realname) a";
    logger.info(sql);
    //conn.queryData(sql,callback);
     return await conn.asyncRun(sql);
}
async function findZongVote(voteId){
	 var sql = "SELECT count(*) as zongVoteCount FROM vote_result WHERE vote_id='"+voteId+"'";
    logger.info(sql);
  	return await conn.asyncRun(sql);
}




module.exports.updateVoteResult = updateVoteResult
module.exports.findCandidateList = findCandidateList
module.exports.findCandidateList1 = findCandidateList1
module.exports.findOneCandidateCount = findOneCandidateCount

module.exports.findVoteById = findVoteById
module.exports.deleteVoteResult = deleteVoteResult
module.exports.findVoteResultByName = findVoteResultByName
module.exports.findZongVote = findZongVote
module.exports.findVoteOwn = findVoteOwn


