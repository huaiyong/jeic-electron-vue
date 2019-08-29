var express = require('express');
var router = express.Router();
const startClassdb = require('../db/startClassdb');
//const db = require('./db').getdb();
// 开始上课 保存上课信息
router.post('/startClass', function(req, res) {
	startClassdb.insertstartClass(req, function(rows) {
		res.json({
			data: rows,
			message: "上课成功",
			ret: 200
		})
	});

});

router.get('/localIP', function(req, res) {
    var interfaces = require('os').networkInterfaces();
    for(var devName in interfaces){
        var iface = interfaces[devName];
        for(var i=0;i<iface.length;i++){
            var alias = iface[i];
            if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
                res.json({
					data: alias.address,
					message: "上课成功",
					ret: 200
				})
            }
        }
    }
});

//查询学生列表
router.get('/findStuList', function(req, res) {
	startClassdb.findStuList(req, function(rows) {
		var resultList = [];
		if(rows.length > 0) {
			for(var sltuList of rows) {

				var resultMap = new Map();
				resultMap.id=sltuList.id ;
				resultMap.deviceId=sltuList.device_id ;
				resultMap.userId=sltuList.user_id ;
				resultMap.realName=sltuList.real_name ;
				resultMap.sex=sltuList.sex ;
				resultMap.officeName=sltuList.office_Name ;
				resultMap.className=sltuList.class_Name ;
				resultMap.classId=sltuList.class_Id ;
				resultList.push(resultMap)
			}
		}
		res.json({
			data: resultList,
			message: "获取学生列表成功",
			ret: 200
		})
	});

});

module.exports = router;
