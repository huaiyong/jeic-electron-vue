var express = require('express');
var router = express.Router();
var log4js = require('log4js');
var logger = log4js.getLogger();
const returnMsgUtils = require('../common/ReturnMsgUtils');

// 开始上课 保存上课信息
router.post('/test', function(req, res) {
	console.log("jsonData>>>>>>>>>>>"+ req.body);

	res.json({ret: 200, message: '成功', data: req.body})
});

router.get('/test', function(req, res, next) {
	var id = req.query.id;
	logger.debug('debug...');
	logger.info('info...');
	logger.warn('warn...');
	logger.error('error...');
	console.log("id>>>>>>>>>>>"+ id);
	//返回结果
	returnMsgUtils.returnSuccessData(res,id)
});


router.delete('/test/:id', function(req, res, next) {
	var id = req.params.id;
	console.log("id>>>>>>>>>>>"+ id);
	//返回结果
	res.json({
		message: id,
		ret: 200
	})
});

router.put('/test/:id', function(req, res) {
	var id = req.params.id;
	console.log("id>>>>>>>>>>>"+ id);
	console.log("jsonData>>>>>>>>>>>"+ req.body);
	res.json({ret: 200, message: '成功', data: req.body})
});




module.exports = router;

