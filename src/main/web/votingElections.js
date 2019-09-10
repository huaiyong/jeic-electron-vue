var express = require('express');
var router = express.Router();
var url = require('url');
const httpUtil = require('../utils/httpUtil');
const returnMsgUtil = require('../common/returnMsgUtils');
const renderer = require("../../../modules/renderer");
const VoteResult = require('../entity/VoteResult');
const DB = require('../db/votingElectionsDao');
const uuid = require('node-uuid');
const db = require('../db/db').getdb();
var log4js = require('log4js');
let async = require('async');
var logger = log4js.getLogger();




/**
 * 存入投票选举数据
 */
router.post('', function(req, res, next) {
		let obj;
		if (req.body) {
			obj = req.body;
			console.log(obj);
		}else {
			returnMsgUtil.returnMsg(res,400,'请传参数！',null)
		}
		var creatuuid = uuid.v1();
		//v1 根据时间戳和随机数生成的uuid
		//var creatuuid= uuid.v1();
	    var start = new Date();
	    var saveVoteSql="INSERT INTO vote(id,name,type,candidate_no,anonymous,vote_number,voting_rules) VALUES (?,?,?,?,?,?,?);"
	    var saveCandidateSql="INSERT INTO candidate(id,name,no,vote_id) VALUES (?,?,?,?);";
	    var saveVoteResultSql="INSERT INTO vote_result(class_record_id,vote_id,user_id,device_id,realname,ticket_number,result,option_number,create_date) VALUES (?,?,?,?,?,?,?,?,?);";
	    db.serialize(function (err, result) {
	        db.run('BEGIN');
	        var flag = "";
	        var candidateList=obj.candidateList;//的list
	        var userList=obj.userList;
			var voteNumber=obj.vote_number;
			for(var j=0;j < voteNumber;j++){
			    flag += "," + 3;  	
			}
	        let stmt = db.prepare(saveVoteSql);
	        stmt.run(creatuuid, obj.name,obj.type,obj.candidate_no,obj.anonymous,obj.vote_number,obj.voting_rules);
	        stmt.finalize();
	        
			for(var u in candidateList){
				let saveCandidateStmt = db.prepare(saveCandidateSql);
				var id = uuid.v1();
				saveCandidateStmt.run([id,candidateList[u].name,candidateList[u].no,creatuuid]);
				saveCandidateStmt.finalize();
			}
			for(var i=0;i < userList.length;i++){
				for(var j=0;j < voteNumber;j++){
			       	let saveVoteResultStmt = db.prepare(saveVoteResultSql);
					saveVoteResultStmt.run([obj.class_record_id,creatuuid,obj.user_id,userList[i].device,userList[i].name,j+1,null,candidateList.length,start]);
					saveVoteResultStmt.finalize(); 
			    }
			}
			if(voteNumber<=64){//可投多少票就有多少道题
				var answerStarParam = "12,1," + voteNumber+flag;
				renderer.answerStart(14, answerStarParam);
			}else{
				returnMsgUtil.returnMsg(res,400,'混合题型超过数量',null)
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
 * 结束答题获取答题器投票结果并保存
 */
router.get('/stopVote', function(req, res, next) {
	//var recordId = req.param('recordId');
	var voteId = req.param('voteId');
	//var userId = req.param('userId');
	
	if(global.answerList.length > 0) {
		for(var i = 0;i < global.answerList.length;i++) {
			var answerResult = global.answerList[i];
			var voteResult = new VoteResult();
			var deviceId = answerResult.deviceId; 			// 答题数据中的答题器编号
			var datamark = answerResult.datamark;			// 答题数据中的题号
			var answer = answerResult.answer;
			//voteResult.classRecordId = recordId;
			voteResult.voteId = voteId;
			//voteResult.userId = userId;
			voteResult.deviceId = deviceId;
			voteResult.ticketNumber = datamark;
			voteResult.result = replaceStr(answer);
			DB.updateVoteResult(voteResult,function (rows) {
					
			})
		}
		
	}else if(global.padAnswerList.length > 0) {
		for(var i = 0;i < global.padAnswerList.length;i++) {
			var answerResult = global.padAnswerList[i];
			var voteResult = new VoteResult();
			var deviceId = answerResult.userId; 			// 答题数据中的答题器编号
			var datamark = answerResult.datamark; 			// 答题数据中的题号
			var answer = answerResult.answer;
			voteResult.classRecordId = recordId;
			voteResult.voteId = voteId;
			voteResult.userId = userId;
			voteResult.deviceId = deviceId;
			voteResult.ticketNumber = datamark;
			voteResult.result = replaceStr(answer);
			DB.updateVoteResult(voteResult,function (rows) {
					
			})
		}
		
	}else {
		returnMsgUtil.returnMsg(res,400,'没有学生答题！！',null);
	}
	renderer.answerStop();
	/*DB.findVoteById(voteId,function (rows) {
		if(rows.length>0){
			var voteObj = rows[0];
			if(voteObj.type==2){//选举
				if(voteObj.voting_rules==1){//候选人不可投票，把候选人的票删除
					DB.findCandidateList(voteId,function (rows) {//查询候选人
						if(rows.length>0){
							for(var candidate of rows){
								var voteResult = new VoteResult();
								var name = candidate.name;
								voteResult.voteId = voteId;
								voteResult.realname = name;
								DB.deleteVoteResult(voteResult,function (rows) {
						
								})
							}
						}
					})
				}else if(voteObj.voting_rules==2){//候选人可投票不可投自己
					DB.findCandidateList(voteId,function (rows) {//查询候选人
						if(rows.length>0){
							for(var candidate of rows){
								var voteResult = new VoteResult();
								var name = candidate.name;
								var no = candidate.no;
								voteResult.voteId = voteId;
								voteResult.realname = name;
								DB.findVoteResultByName(voteResult,function (rows) {
									if(rows.length>0){
										for(var voresult of rows){
											if(voresult.result==no){//如果投的是自己把这票删除
												DB.deleteVoteResult(voteResult,function (rows) {
						
												})
											}
										}
									}
								})
							}
						}
					})
				}
			}
		}
	})*/
	returnMsgUtil.returnSuccessMsg(res);
});
/**
 * 查询投票结果
 */
router.get('/findVoteResult',function(req, res, next) {
	//var recordId = req.param('recordId');
	var voteId = req.param('voteId');
	//var userId = req.param('userId');
	
	DB.findCandidateList(voteId, async function (rows) {
		var resultMap = {};
		var candidateCountlist = [];
		var index = 0;
		if(rows.length>0){
			for(var candidate of rows){
				var voteResult = new VoteResult();
				//voteResult.classRecordId = recordId;
				voteResult.voteId = voteId;
				voteResult.optionNumber = candidate.no;
				voteResult.realname = candidate.name;
				var candidateMap = {};
				candidateMap["name"]=candidate.name;
				candidateMap["no"]=candidate.no;
				var result = await DB.findOneCandidateCount(voteResult);
				console.info(result);
				if(result.length>0){
					var obj = result[0];
					var resultCount = obj.resultCount;
					//先查询主表规则
					var resultVote = await DB.findVoteById(voteId);
					if(resultVote.length>0){
						var voteObj = resultVote[0];
						if(voteObj.voting_rules==2){//候选人可投票不可投自己
							//查询是否投了自己投了几票
							var VoteOwn = await DB.findVoteOwn(voteResult);
							if(VoteOwn.length>0){
								var voteOwnObj = VoteOwn[0];
								var voteCount = voteOwnObj.voteCount;
								resultCount = resultCount-voteCount;
							}
								
						}
					}
					candidateMap["count"]=resultCount;
					index+=resultCount;
				}
				candidateCountlist.push(candidateMap);
			}
			var zongVote = await DB.findZongVote(voteId);
			var zongVoteObj = zongVote[0];
			var zongVoteCount = zongVoteObj.zongVoteCount;
			resultMap["zongVoteNumber"] = zongVoteCount;//总共的票数
			resultMap["invalidVoteCount"] = zongVoteCount-index;//总的无效票数
			resultMap["candidateCountlist"] = candidateCountlist;//候选人有效票数集合
			resultMap["validVotesNumber"] = index;//总的有效票数
		}
		
		res.json({
			data: resultMap,			
			message: "获取成功",
			ret: 200
		})
		
	})
});



router.get('/findVote', async function(req, res, next) {
	var recordId = req.param('recordId');
	var voteId = req.param('voteId');
	var userId = req.param('userId');
	var result = await DB.findCandidateList1(voteId);
	console.log("@@@@@@@@@@@@@"+result)
	res.json({
		data: result,			
		message: "获取成功",
		ret: 200
	})
})

function replaceStr(str){
	if(str.indexOf("A") != -1){
		str = str.replace("A",1);
	}
	if(str.indexOf("B") != -1){
		str = str.replace("B",2);
	}
	if(str.indexOf("C") != -1){
		str = str.replace("C",3);
	}
	if(str.indexOf("D") != -1){
		str = str.replace("D",4);
	}
	if(str.indexOf("E") != -1){
		str = str.replace("E",5);
	}
	if(str.indexOf("F") != -1){
		str = str.replace("F",6);
	}
	if(str.indexOf("G") != -1){
		str = str.replace("G",7);
	}
	if(str.indexOf("H") != -1){
		str = str.replace("H",8);
	}
	if(str.indexOf("I") != -1){
		str = str.replace("I",9);
	}
	if(str.indexOf("J") != -1){
		str = str.replace("J",0);
	}
	//console.info("+++++++++++++++++"+str);
	return str;
}
function callback(result,res){
    res.json({
        msg: result
    })
}

module.exports = router;
