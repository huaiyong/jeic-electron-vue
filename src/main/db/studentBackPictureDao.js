const DB = require('./db').getdb();
const conn = require('./db');
var log4js = require('log4js');
var logger = log4js.getLogger();

/**
 * 学生pad获取学生回传图片列表
 * @param {Object} classRecordId
 * @param {Object} callback
 */
function getStudentBackPicture(classRecordId,sendRecordId,stuId,callback) {
	var sql="SELECT * FROM student_back_picture a WHERE 1=1 AND a.class_record_id = '"+classRecordId+"' and stu_id = '"+stuId+"' ORDER BY a.create_time DESC;"
	if(sendRecordId!= undefined){
		sql="SELECT * FROM student_back_picture a WHERE 1=1 AND a.class_record_id = '"+classRecordId+"' and send_record_id = '"+sendRecordId+"' and stu_id = '"+stuId+"' ORDER BY a.create_time DESC;"
	}
	logger.info(sql);
  	conn.queryData(sql,callback);
}

function get(obj,callback) {
    var sql="SELECT * FROM student_back_picture a WHERE a.send_record_id = '"+obj.sendRecordId+"' AND a.stu_id = '"+obj.stuId+"';"
    logger.info(sql);
    conn.queryData(sql,callback);
}

function insertStudentBackPicture(obj) {
    var sql="INSERT INTO student_back_picture (class_record_id,send_record_id,type,resource_id,resource_name,resource_url,stu_id,create_time) VALUES (?,?,?,?,?,?,?,?)"
    let stmt = DB.prepare(sql);
    stmt.run(obj.classRecordId,obj.sendRecordId,obj.type,obj.resourceId,obj.resourceName,obj.resourceUrl,obj.stuId,obj.createTime);
    stmt.finalize();
}

module.exports.getStudentBackPicture = getStudentBackPicture
module.exports.insertStudentBackPicture = insertStudentBackPicture
module.exports.get = get