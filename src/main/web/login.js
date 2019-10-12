var express = require('express');
var router = express.Router();
var url = require('url');

var userMap = {};

/**
 * 移动端扫码登录接口
 */
router.get('/phoneLogin', function(req, res, next) {
	var uuid = req.param('uuid');
	var loginName = req.param('loginName');
	var password = req.param('password');
	var user = {};
	user["loginName"] = loginName;
	user["password"] = password;
	userMap[uuid] = user;
	res.json({
		data: null,
		message: "登录成功",
		ret: 200
	})
});

/**
 * 大屏端验证接口
 */
router.get('/longConnectionCheck', function(req, res, next) {
	var uuid = req.param('uuid');
	var user = userMap[uuid];
	if(user!=undefined){
		delete userMap[uuid];
		res.json({
			data: user,
			message: "验证成功",
			ret: 200
		})
	}else{
		res.json({
			data: null,
			message: "验证失败",
			ret: 400
		})
	}
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

module.exports = router;
