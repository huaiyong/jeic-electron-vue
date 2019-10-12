
/**
 * 类中定义对象，引用该js   调用方法获取类中的对象，调用方法
 */
const db = require('./db').getdb();
const conn = require('./db');
//const start = require("./startClassdb");
//
function saveSignin(req,type,userList,res) {
//	
//	var sql = "INSERT INTO signin(class_record_id,user_id,realname,sex,device_id,type) VALUES (?,?,?,?,?,?);";
//	db.serialize(function(err){
//		db.run('BEGIN');
//		var stmt = db.prepare(sql);
//		start.findStuList(req, function(rows) {
//			if(rows.length > 0) {
//				for(var sltuList of rows) {
//					var sltuType = 0;
//					for(var i = 0;i < userList.length;i++) {
//						if(type == 1) {
//							if(sltuList.device == userList[i]) {
//								sltuType = 1;
//							}
//						}
//						if(type == 2){
//							if(sltuList.id == userList[i]) {
//								sltuType = 1;
//							}
//						}
//					}
//					stmt.run(sltuList.id,sltuList.id,sltuList.name,sltuList.sex,sltuList.device,sltuType);
//				}
//				stmt.finalize();
//			}
//		});
//	  	db.run('COMMIT');
//	    if(err){
//	    	return res.json({err_code: 0, msg: '保存失败', affectedRows: 0})
//	    }else{
//	        return res.json({err_code: 0, msg: '保存成功', affectedRows: 0})
//	    }
//  });
}


// 查询登入的学生信息
function findSigninResult(req,callback) {
	var classRecordId = req.param("classRecordId");
    var sql = "SELECT * FROM signin WHERE class_record_id = '"+classRecordId+"' ";
    conn.queryData(sql,callback)

}


module.exports.saveSignin = saveSignin
module.exports.findSigninResult = findSigninResult