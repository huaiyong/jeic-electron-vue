var express = require('express');
var router = express.Router();
var url = require('url');

const AnswerResult = require('../entity/AnswerResult');


const studentDao = require('../db/studentDao');
var log4js = require('log4js');
var logger = log4js.getLogger();
/*
 通过下发记录ID获取整体答题结果
 * */
router.get('', function(req, res, next) {
	var classId = req.param('classId');
//	var dataMap = {};
	var answerResultParam = new AnswerResult();
//	answerResultParam.recordId = recordId;
	studentDao.findAll(classId,function (rows) {
		res.json({
			data: rows,
			message: "获取学生列表成功",
			ret: 200
		})
	})

});




//function callback(result,res){
//	res.json({
//		msg: result
//	})
//}

var answerList = [];

//定义一个get请求 path为根目录
/* GET home page. */
router.get('/insertAnswer', function(req, res, next) {
	var recordId = req.param('recordId');
	// 答过题的用户
	answerList = global.answerList;
	// 获取答题器信息 处理答题器获取到的数据 并去重
	var answerMap = new Map();
	for(var index in answerList){
		var answerResult = answerList[index];
		var deviceId = answerResult.deviceId; // 答题数据中的答题器编号
		var datamark = answerResult.datamark; // 答题数据中的题号
		answerResult.recordId = recordId;
		answerMap.set(deviceId+"_"+datamark,answerResult);
	}
	//查询该次下发所有的试题信息
	var answerResultParam = new AnswerResult();
	answerResultParam.recordId = recordId;
	anwerResultDB.findAnswerResult(answerResultParam,function (rows) {
		if(rows.length > 0){
			for(var answerResult of rows){
				var deviceId = answerResult.device_id; // 答题数据中的答题器编号
				var datamark = answerResult.datamark; // 答题数据中的题号
				var ar = answerMap.get(deviceId+"_"+datamark);
				if (typeof(ar) == "undefined"){
					continue;
				}
				ar.type = answerResult.type;
				ar.trueAnswer = answerResult.true_answer;
				var resultStr = checkResult(ar);
				ar.result = resultStr;
				anwerResultDB.updateAnswerResult(ar);
			}
		}
	})
	// 获取pad答题数据信息进行处理

	//获取用户答案后发送给管理端
	//syncDataToAdmin(answerList);
	//调用答题器  结束答题
	renderer.answerStop();
	//返回结果
	res.json({
		message: "",
		ret: 200
	})
});

/**
 * 判断是否正确
 * @param answerResult
 */
function checkResult(answerResult) {
	if("1" == answerResult.type) {
		if (answerResult.answer == "1" && answerResult.trueAnswer == "YES") {
			return "1";
		}
	}else if("4" == answerResult.type) {
		if (sort(answerResult.answer) == answerResult.trueAnswer.toLowerCase()) {
			return "1";
		}
	}else {
		if (answerResult.answer == answerResult.trueAnswer) {
			return "1";
		}
	}
	return "0";
}

function sort(str) {
	var arr1=str.split('');
	arr1.sort(function(a,b){
		if(a.toString().toLowerCase()>b.toString().toLowerCase())
			return 1;
		return -1;
	})
}




/**
 * 向管理端同步数据
 * @param resultList
 */
function syncDataToAdmin(resultList){
	var paramList = [];
	for(var index in answerList){
		var answerResult = answerList[index];
		paramList.push(answerResult.toData());
	}
	httpUtil.httpPostJSON(config.adminStuAnswer,paramList);
}

module.exports = router;
