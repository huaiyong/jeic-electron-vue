var express = require('express');
var router = express.Router();
var url = require('url');

const studentDao = require('../db/studentDao');
var log4js = require('log4js');
var logger = log4js.getLogger();
/*
 * 通过班级ID获取班级下的学生列表
 */
router.get('', function(req, res, next) {
	var classId = req.param('classId');
	studentDao.findAll(classId,function (rows) {
		res.json({
			data: rows,
			message: "获取学生列表成功",
			ret: 200
		})
	})

});


module.exports = router;
