var express = require('express');
var router = express.Router();

//定义一个get请求 path为根目录
/* GET home page. */
router.get('/getsendPhotos', function(req, res, next) {

});

function callback(result,res){
res.json({
    msg: result
})
}



module.exports = router;
