const os= require('os');
const path= require('path');
const docDir = path.join(os.homedir(), 'electron-vue-jeic');
const dbPath = path.join(docDir, 'data.sqlite3');
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();

var DB = DB || {};
DB.db = new sqlite3.Database(dbPath);

function getdb(){
  return DB.db;
}

DB.printErrorInfo = function(err){
  console.log("Error Message:" + err.message + " ErrorNumber:" + err);
};

DB.createTable = function(sql){
  DB.db.serialize(function(){
    DB.db.run(sql, function(err){
      if(null != err){
        DB.printErrorInfo(err);
        return;
      }
    });
  });
};

/// tilesData format; [[level, column, row, content], [level, column, row, content]]
DB.insertData = function(sql, objects){
  DB.db.serialize(function(){
    var stmt = DB.db.prepare(sql);
    for(var i = 0; i < objects.length; ++i){
      stmt.run(objects[i]);
    }

    stmt.finalize();
  });
};

DB.queryData = function(sql, callback){
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

DB.executeSql = function(sql){
  DB.db.run(sql, function(err){
    if(null != err){
      DB.printErrorInfo(err);
    }
  });
};

DB.close = function(){
  DB.db.close();
};

DB.asyncRun=function(query) {
	return new Promise(function(resolve, reject) {
    DB.db.all(query,function(err, row)  {
	    if(err){
	    	reject(err.message)
	    }else{
	    	//console.log("&&&&&&&"+row)
	    	resolve(row)
	    }
    })
	})   
}

module.exports = DB
module.exports.getdb = getdb

