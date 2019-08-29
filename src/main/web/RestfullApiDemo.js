var express = require('express');
var router = express.Router();
const db = require('../db/db');


// 开始上课 保存上课信息
router.post('/test', function(req, res) {
	console.log("jsonData>>>>>>>>>>>"+ req.body);
	res.json({ret: 200, message: '成功', data: req.body})
});

 router.get('/test',async function(req, res, next) {
	var sql = "select * from answer_result;";
	var rows = await db.syncqueryData(sql)
	//返回结果
	 console.log(rows)
	res.json({
		message: rows,
		ret: 200
	})
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

