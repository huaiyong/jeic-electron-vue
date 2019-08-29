const os= require('os');
const path= require('path');
const docDir = path.join(os.homedir(), 'electron-vue-jeic');
const dbPath = path.join(docDir, 'data.sqlite3');
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();

var DB = {};
DB.db = new sqlite3.Database(dbPath);


class DBUtils{
  //构造函数
  constructor() {

  }


  static printErrorInfo(err){
    console.log("Error Message:" + err.message + " ErrorNumber:" + errno);
  };

  static createTable(sql){
    DB.db.serialize(function(){
      DB.db.run(sql, function(err){
        if(null != err){
          DB.printErrorInfo(err);
          return;
        }
      });
    });
  };

  static insertData(sql, objects){
    DB.db.serialize(function(){
      var stmt = DB.db.prepare(sql);
      for(var i = 0; i < objects.length; ++i){
        stmt.run(objects[i]);
      }

      stmt.finalize();
    });
  };

  static queryData(sql, callback){
    DB.db.all(sql, function(err, rows){
      if(null != err){
        DB.printErrorInfo(err);
        return;
      }

      /// deal query data.
      if(callback){
        callback(rows);
      }
    });
  };

  static executeSql(sql){
    DB.db.run(sql, function(err){
      if(null != err){
        DB.printErrorInfo(err);
      }
    });
  };
}


module.exports = DBUtils

