var express = require('express');
var router = express.Router();
var async = require("async");
const returnMsgUtil = require('../common/returnMsgUtils');
const signindb = require('../db/signindb');
const AnswerResult = require('../entity/AnswerResult');
const config = require('../config')
const ClassStuUpload = require('../entity/ClassStuUpload');
const uuid = require('node-uuid');
const studentDao = require('../db/studentDao');
const httpUtil = require('../utils/httpUtil');
const studentPadDao = require('../db/studentPadDao');
const sendRecordDao = require('../db/sendRecordDao');
const DB = require('../db/votingElectionsDao');
const Constants = require('../common/Constants');
const studentBackPictureDao = require('../db/studentBackPictureDao');
const VoteResult = require('../entity/VoteResult');
const dateUtil = require('../utils/dateUtil');
/**************************签到答题 *******************************/
global.padSigninUserList = [];
/**
 * 学生pad签到
 */
router.post('/signin', (req, res) => {
	var userId = req.param('userId');
	//		var userId = req.param('crId');
	//		var classRecordId = req.param('classRecordId');
	if(userId != null && userId != "") {
		if(global.padSigninUserList.indexOf(userId) < 0) {
			global.padSigninUserList.push(userId);
		}
	}
	returnMsgUtil.returnMsg(res, 200, '签到成功', Constants.classRecordId)
})

/*****学生pad答题接口 start*****/
global.padAnswerList = []; //pad答题记录的全局变量
global.padAnswerUserList = []; //pad答题用户的全局变量
router.post('/insertAnswer', function(req, res, next) {
	let obj;
	if(req.body) {
		obj = req.body.jsonData;
		obj = JSON.parse(obj);
	} else {
		returnMsgUtil.returnMsg(res, 400, '请传参数！', null)
	}
	var userId = obj.userId;
	var answerList = obj.answerList;
	for(var i = 0; i < answerList.length; i++) {
		var answerResult = new AnswerResult();
		answerResult.userId = userId;
		answerResult.datamark = answerList[i].qid;
		answerResult.answer = answerList[i].answer;
		global.padAnswerList.push(answerResult); // 添加到全局变量缓存中  结束下发使用
	}
	global.padAnswerUserList.push(userId); // 添加到全区变量中  轮询获取学生答题使用

	let classStuBack = {};
	classStuBack["classRecordId"] = obj.classRecordId;
	classStuBack["createTime"] = new Date();
	classStuBack["resourceId"] = obj.resourceId;
	classStuBack["sendRecordId"] = obj.sendRecordId;
	classStuBack["stuId"] = obj.userId;
	classStuBack["type"] = obj.type;
	classStuBack["resourceName"] = obj.resourceName;
	classStuBack["resourceUrl"] = obj.resourceUrl;
	var stopAnswer = 0;
	studentBackPictureDao.get(classStuBack, function(rows) {
		if(rows.length < 0 || rows.length == 0) {
			studentBackPictureDao.insertStudentBackPicture(classStuBack);
		}
	});
	sendRecordDao.getId(obj.sendRecordId, function(rows) {
		if(rows.length > 0) {
			stopAnswer = rows[0].stop_answer;
		}
		if(stopAnswer == 1) {
			return returnMsgUtil.returnMsg(res, "400", "已停止答题", null);
		} else {
			return returnMsgUtil.returnSuccessMsg(res);
		}
	});

});

/**
 * 学生抢答保存userId
 */
global.padResponder = "";
global.padIntResponder = 1;
router.post('/padResponder', function(req, res, next) {
	var userId = req.param('userId');
	if(userId != "" && userId != null) {
		if(global.padIntResponder > 0) {
			global.padResponder = userId;
			global.padIntResponder--;
		}
	}
	return returnMsgUtil.returnSuccessMsg(res);
});

/**************************upload*******************************/

/**
 * 学生上传图片
 */
router.post('/studentUploadPicture', function(req, res, next) {
	let obj;
	if(req.body) {
		obj = req.body;
	} else {
		returnMsgUtil.returnMsg(res, 400, '请传参数！', null)
	}
	if(obj.resourceId == null || obj.resourceId == "" || obj.resourceId == undefined) {
		var creatuuid = uuid.v1(); //v1 根据时间戳和随机数生成的uuid
		var startDate = dateUtil.currentTime();
		var classStuUpload = new ClassStuUpload();
		classStuUpload.resourceId = creatuuid;
		classStuUpload.createTime = startDate;
		classStuUpload.resourceName = obj.resourceName; // startDate..Format("yyyy-MM-dd HH:mm:ss")
		classStuUpload.classRecordId = obj.classRecordId;
		classStuUpload.resourceUrl = obj.resourceUrl;
		classStuUpload.stuId = obj.stuId;
		studentDao.savePadStuUpload(classStuUpload);
		let map = {};
		map["rId"] = obj.classRecordId;
		map["name"] = obj.resourceName;
		map["resId"] = creatuuid;
		map["url"] = obj.resourceUrl;
		map["createBy"] = obj.stuId;
		syncDataToAdmin(config.adminStuSend, map);
	} else {
		var classStuUpload = new ClassStuUpload();
		classStuUpload.resourceId = obj.resourceId;
		classStuUpload.resourceUrl = obj.resourceUrl;
		studentDao.update(classStuUpload);
	}

	returnMsgUtil.returnSuccessMsg(res);
});

/**
 * 学生pad获取学生上传图片列表
 */
router.get('/findStudentUploadPicture', function(req, res) {
	var classRecordId = req.param('classRecordId');
	var stuId = req.param('stuId');
	var classStuUpload = new ClassStuUpload();
	classStuUpload.classRecordId = classRecordId;
	classStuUpload.stuId = stuId;
	studentDao.findClassStuUploadList(classStuUpload, function(rows) {
		if(rows.length > 0) {
			returnMsgUtil.returnSuccessData(res, rows);
		}
	})
})

/**
 * 查询课堂学生上传数量
 */

router.get('/findClassStuUploadCount', function(req, res) {
	var classRecordId = req.param('classRecordId');
	studentDao.findClassStuUploadCount(classRecordId, function(rows) {
		if(rows.length > 0) {
			returnMsgUtil.returnSuccessData(res, rows);
		}
	})
})

/**
 * 学生pad获取教师下发列表
 */
router.get('/getTeacherSend', function(req, res) {
	var classRecordId = req.param('classRecordId');
	var userId = req.param('userId');
	sendRecordDao.findSendRecord(classRecordId, userId, function(rows) {
		//			if(rows.length>0)(
		//				for
		//			)
		res.json({
			ret: 200,
			data: rows,
			message: "操作成功"
		});
	})
})

/**
 * 学生pad获取学生回传列表（试题和图片）
 */
router.get('/getStudentBackPicture', function(req, res) {
	var sendRecordId = req.param('id');
	var stuId = req.param('stuId');
	var classRecordId = req.param('classRecordId');
	studentBackPictureDao.getStudentBackPicture(classRecordId, sendRecordId, stuId, function(rows) {
		//			if(rows.length>0)(
		//				for
		//			)
		res.json({
			ret: 200,
			data: rows,
			message: "操作成功"
		});
	})
})

//*************************************教師拍照下發*********************************************
router.post('/sendPhotos', function(req, res) {
	var jsonObj = req.body;
	var id = uuid.v1();
	var createTime = dateUtil.currentTime();
	jsonObj.createTime = createTime;
	jsonObj.id = id;
	jsonObj.name = createTime;	//名字先用时间代替
	console.log(JSON.stringify(jsonObj))
	studentPadDao.insertSend(jsonObj);
	var resultMap = {};
	resultMap["id"] = id
	resultMap["rId"] = jsonObj.classRecordId
	resultMap["name"] = jsonObj.name
	resultMap["resId"] = jsonObj.resourceId
	resultMap["url"] = jsonObj.resourceUrl
	resultMap["type"] = jsonObj.sendType
	resultMap["createBy"] = createTime
	reportDataToAdmin(resultMap)
	res.json({
		data: id,
		message: "教師下發成功",
		ret: 200
	})
});

//上报数据
function reportDataToAdmin(resultMap) {
	var url = config.adminInsertSend;
	httpUtil.httpPostJSON(url, resultMap);
}
//***********************understanding**************學生回傳*********************************************
router.post('/backPhotos', function(req, res) {
	var jsonData = req.body;
	var resultMap = {};
	var createTime = dateUtil.currentTime();
	jsonData["createTime"] = createTime;
	resultMap["id"] = jsonData.id
	resultMap["rId"] = jsonData.classRecordId
	resultMap["name"] = jsonData.resourceName
	resultMap["resId"] = jsonData.resourceId
	resultMap["url"] = jsonData.resourceUrl
	resultMap["type"] = jsonData.type
	studentPadDao.backPhotos(jsonData)
	reportDataToAdmin(resultMap)
	res.json({
		data: jsonData.id,
		message: "學生回傳成功",
		ret: 200
	})

});
//上报数据
function reportDataToAdmin(resultMap) {
	var url = config.adminBackPhotos;
	httpUtil.httpPostJSON(url, resultMap);
}
/**************************upload  end*******************************/

/**
 * 向管理端同步数据
 * @param resultList
 */
function syncDataToAdmin(url, resultList) {
	httpUtil.httpPostJSON(url, resultList);
}

/**
 * 学生pad：存入每个学生选举结果
 */
router.put('/updateVoteResult', function(req, res, next) {
	let obj;
	if(req.body) {
		obj = req.body;
	} else {
		returnMsgUtil.returnMsg(res, 400, '请传参数！', null)
	}
	var creatuuid = uuid.v1();
	//v1 根据时间戳和随机数生成的uuid
	//var creatuuid= uuid.v1();
	var start = new Date();
	var voteResultList = obj.voteResultList;
	var voteResult = new VoteResult();
	voteResult.voteId = obj.voteId;
	voteResult.userId = obj.userId;
	DB.findVoteByIdStuPad(obj.voteId, function(rows) {
		if(rows.length > 0) {
			var voteObj = rows[0];
			if(voteObj.stop_vote == 0) {
				for(var u in voteResultList) {
					voteResult.ticketNumber = voteResultList[u].ticket_number;
					voteResult.result = voteResultList[u].result;
					DB.updateVoteResultStuPad(voteResult, function(rows) {

					})
				}
				return returnMsgUtil.returnMsg(res, 200, "操作成功");
			} else {
				return returnMsgUtil.returnMsg(res, 400, "已停止投票");
			}
		} else {
			return returnMsgUtil.returnMsg(res, 400, "操作失败");
		}
	});
});

router.get('/findVoteCandidateList', function(req, res) {
	var voteId = req.param('voteId');

	DB.findCandidateList(voteId, async function(rows) {
		var voteMap = {};
		if(rows.length > 0) {
			voteMap["candidateList"] = rows
			var vote = await DB.findVoteById(voteId);
			if(vote.length > 0) {
				voteMap["name"] = vote[0].name;
				voteMap["type"] = vote[0].type;
				voteMap["candidate_no"] = vote[0].candidate_no;
				voteMap["anonymous"] = vote[0].anonymous;
				voteMap["vote_number"] = vote[0].vote_number;
				voteMap["voting_rules"] = vote[0].voting_rules;
				voteMap["stop_vote"] = vote[0].stop_vote;
			}
		}
		return res.json({
			ret: 200,
			data: voteMap,
			message: "操作成功"
		});
	})

})
module.exports = router;