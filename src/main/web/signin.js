var express = require('express');
var router = express.Router();
const renderer = require("../../../modules/renderer");
const signindb = require('../db/signindb');
const returnMsgUtil = require('../common/returnMsgUtils');

	// 获取签到表中的学生信息
	router.get("/findSigninResult",(req, res) =>{
		signindb.findSigninResult(req,function (rows) {
			var resultList = [];
			if(rows.length > 0) {
				for(var signinList of rows){
					var resultMap = new Map;
					resultMap.classRecordId = signinList.class_record_id;
					resultMap.userId = signinList.user_id;
					resultMap.realname = signinList.realname;
					resultMap.sex = signinList.sex;
					resultMap.deviceId = signinList.device_id;
					resultMap.type = signinList.type;
					resultList.push(resultMap)
				}
			}
			returnMsgUtil.returnMsg(res,200,'获取签到列表成功',resultList)
		})
	})
		

	//开始签到
	router.get('/signinStart', (req, res) => {
		var i = renderer.signinStart();
		if(i==1){
			returnMsgUtil.returnMsg(res,200,'开始签到开启成功',1)
		}else{
			returnMsgUtil.returnMsg(res,400,'开始签到开启失败',0);
		}
		
	})
	
	//获取签到结果
	router.get('/getSignin', (req, res) => {
		var userList = renderer.getSignin();
		if(userList.length > 0) {
			returnMsgUtil.returnMsg(res,200,'获取签到结果成功',userList);
		}else {
			returnMsgUtil.returnMsg(res,200,'获取签到结果成功',global.padSigninUserList);
		}
	})	
	
	//结束签到
	router.get('/signinStop', (req, res) => {
		renderer.signinStop();	// 结束签到
		// 添加到数据库中
		var userList = renderer.getSignin();
		var type = 1;
		return signindb.saveSignin(req,type,userList,res);
	})
	
	function callback(result,res){
		res.json({
			msg: result
		})
	}



module.exports = router;

