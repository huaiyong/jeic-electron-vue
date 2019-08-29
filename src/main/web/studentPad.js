var express = require('express');
var router = express.Router();
const returnMsgUtil = require('../common/returnMsgUtils');
const signindb = require('../db/signindb');
const AnswerResult = require('../entity/AnswerResult');

const ClassStuUpload = require('../entity/ClassStuUpload');
const uuid = require('node-uuid');
const studentDao = require('../db/studentDao');

/**************************签到答题 *******************************/
	global.padSigninUserList = [];
	
	/**
	 * 学生pad签到
	 */
	router.post('/signin', (req, res) => {
		var userId = req.param('userId');
//		var userId = req.param('crId');
		var classRecordId = req.param('classRecordId');
		if(userId != null && userId != "" ) {
			if(global.padSigninUserList.indexOf(userId)<0){
				global.padSigninUserList.push(userId);
			}
		}
		returnMsgUtil.returnMsg(res,200,'签到成功',global.padSigninUserList)
	})
	
	

	/*****学生pad答题接口 start*****/
	global.padAnswerList = [];			//pad答题记录的全局变量
	global.padAnswerUserList = [];		//pad答题用户的全局变量
	router.post('', function(req, res, next) {
		let obj;
		if (req.body) {
			obj = req.body.jsonData;
		}else {
			returnMsgUtil.returnMsg(res,400,'请传参数！',null)
		}
		console.log(obj);
		var userId = obj.userId;
		var answerList= obj.answerList;
		for(var i = 0;i < answerList.length;i++) {
			var answerResult = new AnswerResult();
			answerResult.userId = userId;
			answerResult.datamark = answerList[i].qid;
			answerResult.answer = answerList[i].answer;
			global.padAnswerList.push(answerResult);		// 添加到全局变量缓存中  结束下发使用
		}
		global.padAnswerUserList.push(userId);				// 添加到全区变量中  轮询获取学生答题使用
		
		
		return returnMsgUtil.returnSuccessMsg(res);	
	});
	
	

	/**
	 * 学生抢答保存userId
	 */
	global.padResponder = "";
	global.padIntResponder = 1;
	router.get('/padResponder', function(req, res, next) {
		var userId = req.param('userId');
		if(userId != "" && userId != null) {
			if(global.padIntResponder > 0) {
				global.padResponder = userId;
				global.padIntResponder --;
			}
		}
		return returnMsgUtil.returnSuccessMsg(res);	
	});


/**************************upload*******************************/

	/**
	 * 学生上传
	 */
	router.post('', function(req, res, next) {
		let obj;
		if (req.body) {
			obj = req.body;
		}else {
			returnMsgUtil.returnMsg(res,400,'请传参数！',null)
		}
		if(obj.resourceId == null || obj.resourceId == "" ||obj.resourceId == undefined) {
			var creatuuid= uuid.v1();							//v1 根据时间戳和随机数生成的uuid
			var startDate = new Date();
			var classStuUpload = new ClassStuUpload();
			classStuUpload.resourceId = creatuuid;
			classStuUpload.createTime = startDate;
			classStuUpload.resourceName = obj.resourceName;		// startDate..Format("yyyy-MM-dd HH:mm:ss")
			classStuUpload.classRecordId = obj.classRecordId;
			classStuUpload.resourceUrl = obj.resourceUrl;
			classStuUpload.stuId = obj.stuId;
			studentDao.savePadStuUpload(classStuUpload);
		}else {
			var classStuUpload = new ClassStuUpload();
			classStuUpload.resourceId = obj.resourceId;	
			classStuUpload.resourceUrl = obj.resourceUrl;
			studentDao.update(classStuUpload);
		}
	
		returnMsgUtil.returnSuccessMsg(res);	
	});
	
	/**
	 * 获取pad学生上传
	 */
	router.get('/findClassStuUploadList', function(req, res) {
		var classRecordId = req.param('classRecordId');
		var stuId = req.param('stuId');
		var classStuUpload = new ClassStuUpload();
		classStuUpload.classRecordId = classRecordId;
		classStuUpload.stuId = stuId;
		studentDao.findClassStuUploadList(classStuUpload,function (rows) {
			if(rows.length > 0){
				returnMsgUtil.returnSuccessData(res,rows);
			}
		})
	})
	
	/**
	 * 查询课堂学生上传数量
	 */
	router.get('/findClassStuUploadCount', function(req, res) {
		var classRecordId = req.param('classRecordId');
		studentDao.findClassStuUploadCount(classRecordId,function (rows) {
			if(rows.length > 0){
				returnMsgUtil.returnSuccessData(res,rows);
			}
		})
	})

/**************************upload  end*******************************/
module.exports = router;