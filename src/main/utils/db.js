import fse from 'fs-extra';
import path from 'path';
import sq3 from 'sqlite3';
import logger from './logger';
import { docDir } from './settings';
// 将数据存至系统用户目录，防止用户误删程序
export const dbPath = path.join(docDir, 'data.sqlite3');
fse.ensureFileSync(dbPath);

const sqlite3 = sq3.verbose();
const db = new sqlite3.Database(dbPath);
db.serialize(() => {

	/**
	 * 下发表 send_record
	 * 
	 * type：下发记录类型（1下发试题2下发图片3下发拍照创题）
	 * send_type：1全班教学2分组教学
	 * answer_type：答题类型（1全员作答2组长作答）
	 * answer_type：答题类型（1全班作答2组长作答3全组作答）
	 * stop_answer：是否结束答题（0否1是）
	 */
	db.run(`CREATE TABLE "send_record" (
	"id"  VARCHAR(64) NOT NULL,
	"name"  VARCHAR(64),
	"type"  INTEGER,
	"send_type" INTEGER,
	"answer_type" INTEGER,
	"teaching_group_id"  VARCHAR(64),
	"stop_answer"  INTEGER,
	"class_record_id"  VARCHAR(64),
	"resource_id"  VARCHAR(64),
	"resource_url"  VARCHAR(255),
	"teacher_id"  VARCHAR(64),
	"create_date"  DATETIME,
	PRIMARY KEY ("id" ASC)
	)`, err => {
		logger(err);
	});

	/**
	 * 学生纪录表 record_stu
	 */
	db.run(`CREATE TABLE "record_stu" (
	"record_id"  varchar(64) NOT NULL,
    "user_id"  varchar(64),
    "device_id"  varchar(64)
    )`, err => {
		logger(err);
	});

	/**
	 * 答案结果表 answer_result
	 */
	db.run(`CREATE TABLE "answer_result" (
	"id"  VARCHAR(64) NOT NULL,
	"class_record_id" VARCHAR(64),
	"record_id" VARCHAR(64),
	"user_id" VARCHAR(64),
	"device_id" VARCHAR(64),
	"realname" VARCHAR(255),
	"resource_id" VARCHAR(64),
	"datamark" INT(11),
	"answer" VARCHAR(64),
	"true_answer" VARCHAR(64),
	"result" INT(11),
	"score" INT(11),
	"type" VARCHAR(64),
	"option_number" INT(11),
	"create_date" DATETIME,
	PRIMARY KEY ("id")
    )`, err => {
		logger(err);
	});
	db.run(`CREATE TABLE "class_record" (
  	"id" varchar(64),
  	"teacher_id" varchar(64),
  	"teacher_name" varchar(64) ,
  	"office_id" varchar(64) ,
  	"office_name" varchar(64) ,
  	"grade_id" varchar(64) ,
  	"grade_name" varchar(64) ,
  	"class_id" varchar(64) ,
  	"class_name"  varchar(64) ,
  	"subject_id" varchar(64) ,
  	"subject_name" varchar(64) ,
  	"start_time" DATETIME,
  	"end_time" DATETIME,
  	"create_date" DATETIME
  )`, err => {
		logger(err);
	});

	/**
	 * 学生表
	 * 存入学生基础信息
	 */
	db.run(`CREATE TABLE "student" (
		"id"  varchar(64) NOT NULL,
		"device"  varchar(64),
		"name"  varchar(64),
		"sex"  varchar(64),
		"office_name"  varchar(64),
		"grade_name"  varchar(64),
		"class_id"  varchar(64),
		"class_name"  varchar(64),
		PRIMARY KEY ("id")
	);`, err => {
		logger(err);
	});

	/**
	 * pad答题表
	 */
	db.run(`CREATE TABLE "pad_answer" (
	  "full_id" varchar(255),
	  "record_id" varchar(64),
	  "user_id" varchar(64),
	  "qid" int(11),
	  "data" varchar(255),
	  "result" int(11) 
  	)`, err => {
		logger(err);
	});

	/**
	 * pad上传图片表
	 */
	db.run(`CREATE TABLE "class_stu_upload" (
	  "class_record_id" varchar(64),
	  "resource_id" varchar(64),
	  "resource_name" varchar(64),
	  "resource_url" varchar(255),
	  "stu_id" varchar(64),
	  "create_time" varchar(64) 
  	)`, err => {
		logger(err);
	});

	/**
	 * 答题器答题表
	 */
	db.run(`CREATE TABLE "answer" (
  	"full_id" varchar(64),
  	"record_id" varchar(64),
  	"device_id" varchar(64) ,
  	"datamark" INTEGER(11) ,
  	"data" varchar(64) ,
  	"result" INTEGER(11)
  	)`, err => {
		logger(err);
	});

	/**
	 * 创建签到表
	 */
	db.run(`CREATE TABLE "signin" (
	  	"class_record_id" varchar(64),
	  	"user_id" varchar(64),
	  	"realname" varchar(64) ,
	  	"sex" INTEGER(11) ,
	  	"device_id" varchar(64) ,
	  	"type" INTEGER(11)
	  )`, err => {
		logger(err);
	});
	db.run(`create table "student_back_picture" (
	"class_record_id" varchar (64),
	"send_record_id" varchar (64),
	"type" int (11),
	"resource_id" varchar (64),
	"resource_name" varchar (64),
	"resource_url" varchar (255),
	"stu_id" varchar (64),
	"create_time" datetime 
)`, err => {
		logger(err);
	})
	/**
	 * 教学组表
	 * 
	 * type：教学组类型（1临时组2固定组）
	 */
	db.run(`CREATE TABLE "teachinggroup" (
  "id" VARCHAR(64) NOT NULL,
  "name" VARCHAR(64),
  "type" INTEGER DEFAULT 0,
  "class_id" VARCHAR(64),
  "subject_id" VARCHAR(64),
  "create_by" DATETIME(64),
  "create_date" DATETIME(64),
  "teacher_id" VARCHAR(64),
  "update_by" DATETIME(64),
  "update_date" DATETIME(64),
  "del_flag" INTEGER DEFAULT 0,
  PRIMARY KEY ("id")
	)`, err => {
		logger(err);
	});

	/**
	 * usergroup
	 */
	db.run(`CREATE TABLE "usergroup" (
  "id" VARCHAR(64) NOT NULL,
  "name" VARCHAR(64),
  "teachinggroup_id" VARCHAR(64),
  "create_by" DATETIME(64),
  "create_date" DATETIME(64),
  "update_by" DATETIME(64),
  "update_date" DATETIME(64),
  "del_flag" INTEGER DEFAULT 0,
  PRIMARY KEY ("id")
	)`, err => {
		logger(err);
	});

	/**
	 * student_usergroup
	 */
	db.run(`CREATE TABLE "student_usergroup" (
  "id" VARCHAR(64) NOT NULL,
  "usergroup_id" VARCHAR(64),
  "student_id" VARCHAR(64),
  "student_name" VARCHAR(64),
  "leader_flag" VARCHAR(64) DEFAULT 0,
  "del_flag" INTEGER DEFAULT 0,
  PRIMARY KEY ("id")
	)`, err => {
		logger(err);
	});
	
	db.run(`CREATE TABLE "candidate" (
  "id" VARCHAR(64),
  "name" VARCHAR(64),
  "no" integer(1),
  "vote_id" VARCHAR(64) DEFAULT 0
	)`, err => {
		logger(err);
	});
	
	db.run(`CREATE TABLE "vote" (
  "id" VARCHAR(64) NOT NULL,
  "name" VARCHAR(64),
  "type" integer(1),
  "candidate_no" integer(1),
  "anonymous" integer(1),
  "vote_number" integer(1),
  "voting_rules" INTEGER(1) DEFAULT 0,
  "stop_vote" integer(1),
  PRIMARY KEY ("id")
)`, err => {
		logger(err);
	});
	
	db.run(`CREATE TABLE "vote_result" (
  "class_record_id" VARCHAR(64),
  "vote_id" VARCHAR(64),
  "user_id" VARCHAR(64),
  "device_id" VARCHAR(64),
  "realname" VARCHAR(255),
  "ticket_number" INT(11),
  "result" VARCHAR(64),
  "option_number" INT(11),
  "create_date" DATETIME
)`, err => {
		logger(err);
	});
	
});

export default db;