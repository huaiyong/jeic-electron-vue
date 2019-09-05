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

module.exports = router;
