var express = require('express');
var router = express.Router();
var async = require("async");
const returnMsgUtil = require('../common/returnMsgUtils');
const signindb = require('../db/signindb');
const AnswerResult = require('../entity/AnswerResult');
var config = require('../config')
const ClassStuUpload = require('../entity/ClassStuUpload');
const uuid = require('node-uuid');
const studentDao = require('../db/studentDao');
 const httpUtil = require('../utils/httpUtil');
const studentPadDao = require('../db/studentPadDao');
 
const sendRecordDao = require('../db/sendRecordDao');
const Constants = require('../common/Constants');
const studentBackPictureDao = require('../db/studentBackPictureDao');


/**************************签到答题 *******************************/
	global.padSigninUserList = [];
	
	/**
	 * 学生pad签到
	 */
	router.post('/signin', (req, res) => {
		var userId = req.param('userId');
//		var userId = req.param('crId');
//		var classRecordId = req.param('classRecordId');
		if(userId != null && userId != "" ) {
			if(global.padSigninUserList.indexOf(userId)<0){
				global.padSigninUserList.push(userId);
			}
		}
		returnMsgUtil.returnMsg(res,200,'签到成功',Constants.classRecordId)
	})
	
	

	/*****学生pad答题接口 start*****/
	global.padAnswerList = [];			//pad答题记录的全局变量
	global.padAnswerUserList = [];		//pad答题用户的全局变量
	router.post('/insertAnswer', function(req, res, next) {
		let obj;
		if (req.body) {
			obj = req.body.jsonData;
			obj = JSON.parse(obj);
		}else {
			returnMsgUtil.returnMsg(res,400,'请传参数！',null)
		}
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
	    studentBackPictureDao.get(classStuBack,function(rows) {
	        if(rows.length < 0 || rows.length == 0) {
	            studentBackPictureDao.insertStudentBackPicture(classStuBack);
	        }
	    });	
	    sendRecordDao.getId(obj.sendRecordId,function (rows) {
	        if(rows.length > 0){
            	stopAnswer = rows[0].stop_answer;
	        }
	        if(stopAnswer==1){
		    	return returnMsgUtil.returnMsg(res,"400","已停止答题",null);
		    }else{
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
				global.padIntResponder --;
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
	 * 学生pad获取学生上传图片列表
	 */
	router.get('/findStudentUploadPicture', function(req, res) {
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


	/**
	 * 学生pad获取教师下发列表
	 */
	router.get('/getTeacherSend', function(req, res) {
		var classRecordId = req.param('classRecordId');
		sendRecordDao.findSendRecord(classRecordId,function (rows) {
//			if(rows.length>0)(
//				for
//			)
			res.json({ret:200,data:rows,message:"操作成功"});
		})
	})

	/**
	 * 学生pad获取学生回传列表（试题和图片）
	 */
	router.get('/getStudentBackPicture', function(req, res) {
		var sendRecordId = req.param('id');
		var stuId = req.param('stuId');
		var classRecordId = req.param('classRecordId');
		studentBackPictureDao.getStudentBackPicture(classRecordId,sendRecordId,stuId,function (rows) {
//			if(rows.length>0)(
//				for
//			)
			res.json({ret:200,data:rows,message:"操作成功"});
		})
	})


//*************************************教師拍照下發*********************************************
var resultList=[];
//创建 教师拍照后 下发任务保存教師拍照下發的記錄信息
router.post('/sendPhotos',function(req, res){
	var jsonObj = req.body;
	var resultMap={};
	console.log(">>>>>>>>>>>>>.>>>>>>>>>>>>>"+jsonObj)
	studentPadDao.insertSend(req,function(rows){
		if(rows.length>0){//拍照下發成功  開始上報數據
			 resultMap["id"]=jsonObj.id
			 console.log("id?id"+jsonObj.id)
			 resultMap["rId"]=jsonObj.classRecordId
			 resultMap["name"]=jsonObj.name
			 resultMap["resId"]=jsonObj.resourceId
			 resultMap["url"]=jsonObj.resourceUrl
			 resultMap["type"]=jsonObj.type
			 resultMap["createBy"]=rows.createTime
		httpUtil.httpPostJSON(config.adminInsertSend, resultMap);	  
		}
		 
		res.json({
			data: rows.id,
			message: "拍照下發成功",
			ret: 200
		})
	})
});

//*************************************學生回傳*********************************************
router.post('/backPhotos',function(req,res){
	var jsonObj = req.body;
	var resultMap={};
	console.log(">>>>>>>>>>>>>.>>>>>>>>>>>>>"+jsonObj)
	studentPadDao.backPhotos(req,function(rows){
		if(rows.length>0){//拍照下發成功  開始上報數據
			 resultMap["id"]=jsonObj.id
			 console.log("id??????????????"+jsonObj.id)
			 resultMap["rId"]=jsonObj.classRecordId
			 resultMap["name"]=jsonObj.name
			 resultMap["resId"]=jsonObj.resourceId
			 resultMap["url"]=jsonObj.resourceUrl
			 resultMap["type"]=jsonObj.type
			 resultMap["createBy"]=rows.createTime
		httpUtil.httpPostJSON(config.adminBackPhotos, resultMap);	
		
		}
		
		res.json({
			data: rows,
			message: "學生回傳成功",
			ret: 200
		})
	})
});

/**************************upload  end*******************************/
module.exports = router;