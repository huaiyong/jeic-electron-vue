const DB = require('./db').getdb();
const conn = require('./db');
var log4js = require('log4js');
var logger = log4js.getLogger();

function findAll(classId,callback) {
    var sql = "select * from student where class_id = '"+classId+"';";
    conn.queryData(sql,callback)
}

/************************************upload**********************************/
/**
 * 保存学生上传数据
 * @param {Object} ClassStuUpload
 */
function savePadStuUpload(ClassStuUpload) {
	var sql="INSERT INTO class_stu_upload(class_record_id,resource_id,resource_name,resource_url,stu_id,create_time) VALUES (?,?,?,?,?,?);"
	let stmt = DB.prepare(sql);
    stmt.run(ClassStuUpload.classRecordId,ClassStuUpload.resourceId,ClassStuUpload.resourceName,ClassStuUpload.resourceUrl,ClassStuUpload.stuId,ClassStuUpload.createTime);
    stmt.finalize();
}

/**
 * 修改
 * @param {Object} ClassStuUpload
 */
function update(ClassStuUpload) {
	var sql="UPDATE class_stu_upload SET resource_url = '"+ClassStuUpload.resourceUrl+"' WHERE resource_id = '"+ClassStuUpload.resourceId+"';"
	logger.info(sql);
    conn.executeSql(sql)
}

/**
 * 查询学生pad上传
 * @param {Object} classStuUpload
 */
function findClassStuUploadList(classStuUpload,callback) {
	var sql="SELECT * FROM class_stu_upload a WHERE 1=1 AND a.class_record_id = '"+classStuUpload.classRecordId+"' AND a.stu_id = '"+classStuUpload.stuId+"' ORDER BY a.create_time DESC;"
	logger.info(sql);
  	conn.queryData(sql,callback);
}

//

function findClassStuUploadCount(classRecordId,callback) {
	var sql="SELECT stu_id ,COUNT(stu_id) stuCount FROM class_stu_upload WHERE class_record_id = '"+classRecordId+"' GROUP BY stu_id;"
	logger.info(sql);
  	conn.queryData(sql,callback);
}

/************************************upload end**********************************/



module.exports.savePadStuUpload = savePadStuUpload
module.exports.update = update
module.exports.findClassStuUploadList = findClassStuUploadList
module.exports.findClassStuUploadCount = findClassStuUploadCount


module.exports.findAll = findAll
