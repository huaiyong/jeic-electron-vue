var express = require('express');
var router = express.Router();
const uuid = require('node-uuid');
const db = require('../db/db').getdb();

const renderer = require("../../../modules/renderer");
const sendRecordDB = require('../db/sendRecordDao');
const SendRecord = require('../entity/SendRecord');
const RecordStu = require('../entity/RecordStu');
const AnswerResult = require('../entity/AnswerResult');
const anwerResultDB = require('../db/anwerResultDB');
const Answer = require('../entity/Answer');
const PadAnswer = require('../entity/PadAnswer');
const returnMsgUtil = require('../common/returnMsgUtils');

/***************************下发试题********************************/ 
const ChoiceDan = "0";
const ChoiceDuo = "1";
const TrueFalse = "2";

router.post('', function(req, res, next) {
	let obj;
	if (req.body) {
		obj = req.body.jsonData;
	}else {
		returnMsgUtil.returnMsg(res,400,'请传参数！',null)
	}
	// 解析 参数
	var startDate = new Date();
	var creatuuid= uuid.v1();			//v1 根据时间戳和随机数生成的uuid
    db.serialize(function (err, result) {
        db.run('BEGIN');
        sendRecordDB.insertSendRecord(obj,creatuuid,startDate);	// 添加到下发表中
        var userList=obj.userList;
		var trueAnswerList=obj.answer;
		var answerType;
		var flag = "";
		for(var i=0;i < userList.length;i++){
			sendRecordDB.insertRecordStu(userList[i],creatuuid);				// 添加到学生下发关联表中
			// 如果下发状态 等于2  下发图片  学生答题表不保存
			if(obj.type != "2") {
				for(var t in trueAnswerList){
		        	answerType = trueAnswerList[t].type;
		        	sendRecordDB.insertAnswerResult(obj,userList[i],trueAnswerList[t],creatuuid,startDate);	// 添加到学生答题表中
		        	if("2" == answerType) {
		        		if(i == 0) {
							flag = initFlag(ChoiceDan,flag);
						}
		        	}
		        	if("1" == answerType) {
		        		if(i == 0) {
		        			flag = initFlag(TrueFalse,flag);
		        		}
		        	}
		        	if("4" == answerType) {
		        		if(i == 0) {
		        			flag = initFlag(ChoiceDuo,flag);
		        		}
		        	}
		        }
			}
	        
		}
		var total = obj.titotal;	//判断这个试题的题量
		var answerStarParam;
		if(total<=64){
			answerStarParam = "12,1," + trueAnswerList.length + ","+flag;
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

function initFlag(value,flag) {
	if(flag == null || flag.length == 0 || flag == "") {
		flag += value;
	}else {
		flag += "," + value;
	}
	return flag;
}


/***************************结束下发********************************/ 
router.get('/stopAnswer', function(req, res, next) {
	var recordId = req.param('recordId');
	var answerResultMap = new Map();				// 把所有的的答题情况放到map中
	var answerMap = new Map();
	if(global.answerList.length > 0) {
		for(var i = 0;i < global.answerList.length;i++) {
			var answerResult = global.answerList[i];
			var deviceId = answerResult.deviceId; 			// 答题数据中的答题器编号
			var datamark = answerResult.datamark; 			// 答题数据中的题号
			answerResult.recordId = recordId;
			answerResultMap.set(deviceId+"_"+datamark,answerResult);
			var answer = new Answer();
			answer.datamark = datamark;
			answer.deviceId = deviceId;
			answer.recordId = recordId;
			answer.fullId = recordId + deviceId + datamark;
			answerMap.set(recordId+deviceId+datamark,answer);
		}
		saveAnswer(recordId,answerResultMap,answerMap,0,res);
	}else if(global.padAnswerList.length > 0) {
		for(var i = 0;i < global.padAnswerList.length;i++) {
			var answerResult = global.padAnswerList[i];
			var userId = answerResult.userId; 			// 答题数据中的答题器编号
			var datamark = answerResult.datamark; 			// 答题数据中的题号
			answerResult.recordId = recordId;
			answerResultMap.set(userId+"_"+datamark,answerResult);
			var padAnswer = new PadAnswer();
			padAnswer.qid = datamark;
			padAnswer.userId = userId;
			padAnswer.recordId = recordId;
			padAnswer.fullId = recordId + userId + datamark;
			answerMap.set(recordId+userId+datamark,padAnswer);
		}
		saveAnswer(recordId,answerResultMap,answerMap,1,res);
	}else {
		returnMsgUtil.returnMsg(res,400,'没有学生答题！！',null);
	}
	renderer.answerStop();
});



//、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、

function saveAnswer(recordId,answerResultMap,answerMap,flag,res) {
	//查询该次下发所有的试题信息
	var answerResultParam = new AnswerResult();
	answerResultParam.recordId = recordId;
	anwerResultDB.findAnswerResult(answerResultParam,function (rows) {
		if(rows.length > 0){
			for(var answerResult1 of rows){
				var datamark = answerResult1.datamark; // 答题数据中的题号
				if(0 == flag) {
					var deviceId = answerResult1.device_id; // 答题数据中的答题器编号
					var ar = answerResultMap.get(deviceId+"_"+datamark);
					var ans = answerMap.get(recordId+deviceId+datamark);
				}else {
					var userId = answerResult1.user_id; // 答题数据中的答题器编号
					var ar = answerResultMap.get(userId+"_"+datamark);
					var ans = answerMap.get(recordId+userId+datamark);
				}
				
				if (typeof(ar) == "undefined" && typeof(ans) == "undefined"){
					continue;
				}
				ar.type = answerResult1.type;
				if("1" == ar.type) {
					ans.data = ar.answer == "A"?"YES":"NO";
					if(ans.data == answerResult1.true_answer) {
						ar.result = "1";
						ans.result = "1";
					}else {
						ar.result = "0";
						ans.result = "0";
					}
					ar.answer = ans.data;
				}else if("4" == ar.type) {
					ans.data = sortStr(ar.answer);
					ar.answer = ans.data;
					if(ar.answer == answerResult1.true_answer) {
						ar.result = "1";
						ans.result = "1";
					}else {
						ar.result = "0";
						ans.result = "0";
					}
				}else {
					ans.data = ar.answer;
					if(ans.data == answerResult1.true_answer) {
						ar.result = "1";
						ans.result = "1";
					}else {
						ar.result = "0";
						ans.result = "0";
					}
				}
				anwerResultDB.updateAnswerResult(ar,flag);		// 修改学生回答表
				if(0 == flag) {
					sendRecordDB.insertAnswer2(ans);			// 添加到答题表
				}else {
					sendRecordDB.insertPadAnswer(ans);
				}
				
			}
		}
	})
    returnMsgUtil.returnSuccessMsg(res);
}


//、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、

function sortStr(str) {
		let StrList = [];
		let returnStr = "";
//		System.out.println("字符型数组排序，排序前："+str);
		for(var i=0;i < str.length;i++) {
			StrList.push(str.substring(i,i+1));
		}
		var resArr = StrList.sort();
		for(var i=0;i < resArr.length;i++) {
			console.log(resArr[i]);
			if(i == 0) {
				returnStr += resArr[i];
			}else {
				returnStr += ","+ resArr[i];
			}
		}
		console.log(resArr);
		return returnStr;
}

// 获取已答题的用户列表设备号
router.get('/getAnsweredList', function(req, res, next) {
	if(global.padAnswerUserList.length > 0) {		// pad 答题用户id
		returnMsgUtil.returnMsg(res,200,'获取签到结果成功',global.padAnswerUserList);
	}else {											// 答题设备id
		returnMsgUtil.returnSuccessData(res,renderer.getAnswer());
	}
});





router.get('/getAnsweredList', function(req, res, next) {
  const answeredList = [];
  var ans = global.answer;
  for(var key in ans){
    console.log("属性：" + key + "  ,值："+ ans[key]);
    answeredList.push(key);
  }
  return res.json({err_code: 1, msg: answeredList, affectedRows: 0})
});

//开始抢答
router.get('/startResponder', function(req, res, next) {
  var number = req.query.number;
  if(number <= 0 ||number == undefined){
    return res.json({ret:400,data:number,message:"参数异常！"})
  }
  var result = renderer.startRushAnswer(13, "0");
  return res.json({ret:200,data:result,message:"操作成功"})
});

//获取抢答结果
router.get('/getStartResponder', function(req, res, next) {
    var answered = {};
    var winner = global.winner;
    var type = req.query.type;
    if(winner.length==0){
    	res.json({ret:400,data:answered,message:"操作失败"})
    }else{
    	if(type==1){//全班抢答
    		sendRecordDB.getRushAnswered(winner,type,"",function (rows) {
		        if(rows.length > 0){
		            for(var k of rows){
		                answered["realname"]=k.name;
		                answered["deviceName"]=k.device;
		                answered["sex"]=k.sex;
		            }
		        }
		        res.json({ret:200,data:answered,message:"操作成功"})
	    	})
    	}else if(type==3){//分组教学全组抢答
    		var teachingGroupId = req.query.teachingGroupId;
    		sendRecordDB.getRushAnswered(winner,type,teachingGroupId,function (rows) {
		        if(rows.length > 0){
		            for(var k of rows){
		                answered["realname"]=k.realname;
		                answered["device"]=k.device;
		                answered["sex"]=k.sex;
		                answered["groupName"]=k.groupName;
		            }
		        }
		        res.json({ret:200,data:answered,message:"操作成功"})
	    	})
    	}else{
    		res.json({ret:400,data:answered,message:"type值错误"})
    	}
    	
    }
   
});

//结束抢答
router.get('/stopResponder', function(req, res, next) {
	global.padIntResponder = 1;
  	var result = renderer.answerStop();
  	return res.json({ret:200,data:result,message:"操作成功"})
});

//根据课堂id查询下发列表
router.get('/findClassRecordByRid', function(req, res, next) {
  var classRecordId = req.param('classRecordId');
  var dataMap = {};
  sendRecordDB.findSendRecord(classRecordId,function (rows) {
    if(rows.length > 0){
      for(var i of rows){
        var resultMap = {};
        console.log(i);

        resultMap["id"]= i.id,
          resultMap["name"]= i.name,
          resultMap["teacherId"]= i.teacher_id,
          resultMap["resourceId"]= i.resource_id,
          resultMap[ "createDate"]= i.create_date,
          resultMap["resourceUrl"]= i.resource_url,
          resultMap["stopAnswer"]= i.stop_answer,
          resultMap["type"]= i.type,
          resultMap["sendType"]= i.send_type,
          resultMap["answerType"]= i.answer_type,
          resultMap["classRecordId"]= i.class_record_id,
          resultMap["stuId"]= "",
          resultMap["stuList"]= ""
        dataMap[i.id] = resultMap;
      }
      var list = [];
      for (var value in dataMap) {
        list.push(dataMap[value])
      }
    }
    res.json({ret:200,data:list,message:"操作成功"})
  })

});


//根据课堂id查询下发列表
router.get('/getAnsweredUser', function(req, res, next) {
  var sendRecordId = req.param('sendRecordId');
  var type = req.param('type');
  if(type==1){
  	sendRecordDB.getAnsweredUser(sendRecordId,function (rows) {
  		if(rows.length > 0){
  			res.json({ret:200,data:rows,message:"操作成功"})
  		}else{
  			res.json({ret:400,data:rows,message:"操作失败"})
  		}
  	})
  }else{
  	sendRecordDB.getAnsweredUserBy(sendRecordId,function (rows) {
  		if(rows.length > 0){
  			res.json({ret:200,data:rows,message:"操作成功"})
  		}else{
  			res.json({ret:400,data:rows,message:"操作失败"})
  		}
  	})
  	
  }
});



function callback(result,res){
    res.json({
        msg: result
    })
}



module.exports = router;

