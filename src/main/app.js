var express = require('express');


var appHttp = express();

// 设置跨域
appHttp.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Origin', 'req.headers.origin')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('X-Powered-By', '3.2.1')
  res.header('Content-type', 'application/json;charset=utf-8')
  next()
})
// 注册 解析表单的body-parser
const bodyParser = require('body-parser')
appHttp.use(bodyParser.urlencoded({extended:false}))
appHttp.use(bodyParser.json());

//路由引入

var sendRecord = require('./web/sendRecord'); //答题结果接口
appHttp.use('/api/sunvote', sendRecord);//获取答题结果接口

module.exports = appHttp;
