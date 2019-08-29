// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const ffi$1 = require("ffi");
const AnswerResult = require('../src/main/entity/AnswerResult');

var signUser = "已签到用户设备号：";
var answerUser = "已答题用户：";

let iModeType;			// 答题器状态
let userMap = {};
global.answer = {};		//答题记录设备的全局变量
global.answerList = [];		//答题记录设备的全局变量
global.winner = [];		//答题记录设备的全局变量

//sdk方法定义
const libSunVoteSDK =  new ffi$1.Library("SunVoteSDK_x64.dll", {
    "License": [ "int", [ "int","string" ] ],
    "Connect":["int",["int","string"] ],
    "Disconnect":["int",["int"] ],
    "WriteHDParam":["int",["int","int","string"] ],
    "ReadHDParam":["int",["int","int"] ],
    "VoteStart2":["int",["int","int","string"] ],
    "VoteStart":["int",["int","string"] ],	//开始抢答
    "VoteStop2":["int",["int"] ],
    "GetMultiResultByID":["int",["string","int","int"] ],
    "GetResultBySN":["int",["string","int","int"] ],
    "ExitGetResult":["int",[] ],
    "SetLogOn":["int",["int"]],
    "SetHDParamEventCallBack":["void",["pointer"] ],
    "SetConnectEventCallBack":["void",["pointer"] ],
    "SetVoteEventCallBack":["void",["pointer"] ],
    "SetKeyEventCallBack":["void",["pointer"] ],

});



const paramEnum = {
    //连接方式
    conn_type_usb :1,
    conn_type_tcpip :2,

    // 基站设置	更多参数定义请参考 param_def.h文件，此处只列举部分
    BaseStation_RFPower : 1,				//基站功率
    BaseStation_Channel : 2,				// ,  基站主信道
    BaseStation_CommunicationChannels : 3,	//通讯通道：是否中继，通道数，通道1，通道2，通道3，通道4
    BaseStation_IP : 4,						//IP
    BaseStation_MAC : 5,					//mac地址
    BaseStation_SubnetMask : 6,				//子网掩码
    BaseStation_Gateway : 7,				//网关
    BaseStation_Title : 8,					//基站名称
    BaseStation_ID : 9,						//基站编号
    BaseStation_SN : 10,						//硬件序列号（ 只读）
    BaseStation_Version : 11,				//硬件版本
    BaseStation_PairCode : 12,				//配对码
    BaseStation_MatchCode : 12,				//配对码
    SoftwareDongle_VerifyPWD : 13,			//验证密码
    SoftwareDongle_A_PWD : 14,				//软件狗密码
    SoftwareDongle_A_Zone : 15,				//软件狗读写A区
    SoftwareDongle_B_Zone : 16,
    KeyPad_config : 17,						//键盘设置  ReportMode, offtime, SubmisMode, Buzzer, LCD,Vib, Lang
    KeyPad_ConnectionMode : 18,				//键盘连接模式（固定配对、自由配对、免配对）
    Kaypad_WorkingMode : 18,				//键盘连接模式（固定配对、自由配对、免配对）
    KeyPad_IdentificationMode : 19,			//键盘识别模式（是否SN号模式）
    KeyPad_ID : 20,							//键盘编号
    KeyPad_UserID : 21,						//用户编号
    KeyPad_SN : 22,							//键盘出厂序列号
    KeyPad_Version : 23,					//键盘版本信息
    KeyPad_PairCode : 24,					//配对码
    KeyPad_PowerOff : 222,
    WiFi_SSID : 25,							//组合 BaseMode,ssid
    WiFi_WorkMode : 26,
    WiFi_Password : 27,



    // 投票设置
    VoteType_Free : 0,						//空闲模式(停止)
    VoteType_Signin : 1,					//签到
    VoteType_Vote : 2,						//表决
    VoteType_Number : 4,					//数值 （单项评分模式）
    VoteType_TrueFalse : 5,					//判断
    VoteType_KeyPadTest : 9	,				//模拟测试
    VoteType_Choice : 10,					//选择
    VoteType_Sequence : 11,					//排序
    VoteType_FillBlanks : 12,				//填空
    VoteType_Quiz : 13,						//抢答
    VoteType_Examination : 14,				//测验
    VoteType_Homework : 15,					//作业
    VoteType_Election : 22,                 //选举
    VoteType_KeyPadPair : 40,				//配对
    VoteType_KeyPadMatch : 40,				//配对
    VoteType_continue : 100,
    VoteType_submitAndContinue : 101,

    // 键盘结果
    KeyResult_info : 1,						//结果
    KeyResult_status : 2,					//状态
    KeyResult_loginInfo : 3,				//配对（登录）信息
    KeyResult_remoteControlAnswer : 4,		// 表决器遥控指令应答

}

//var BrowserWindow = require('browser-window');
const ffi = require("ffi");
// Special module holding environment variables which you declared
// in config/env_xxx.json file.
const ipc = require("electron").ipcRenderer
const ipcMain = require('electron').ipcMain;
global.sharedObject = {
    loginuser: '',
    objson: {},
};

libSunVoteSDK.License(1, "SUNARS2013");
libSunVoteSDK.SetLogOn(2);

function connCallBack(iBaseID, iMode, sInfo) {
    console.log("ConnectEventCallBack--:"+"baseID :"+iBaseID +" BaseMode:"+ iMode + " sInfo:" +sInfo);
    if(sInfo == "1"){
        console.log("Connected....");

        //var  Base_Version = 11;
        //libSunVoteSDK.ReadHDParam(0,Base_Version);
        //var vote_type_choice = 10;
        // libSunVoteSDK.VoteStart(10,"1,1,0,0,4,1");
    }
}

function voteCallBack(iBaseID, iMode, sInfo) {
    if(iMode==1) {
        iModeType = iMode;
    }else if(iMode==14) {	//答题状态
        iModeType = iMode;
    }else if(iMode==13){
        iModeType = iMode;
    }
    console.log("voteCallBack--:"+"baseID :"+iBaseID +" BaseMode:"+ iMode + " sInfo:" +sInfo);
}

function keyCallBack(BaseID,KeyID,KeySN,iMode,Time,sInfo) {
    signUser = signUser+"**"+KeySN;

    if(iModeType==1){
        answerUser = answerUser+KeySN+"-->"+sInfo+"@@";
        userMap[KeySN] = KeySN;
    }else if(iModeType==14){	//答题状态下记录答题的设备
        global.answer[KeySN] = KeySN;
        //存储答题信息
        if(sInfo.indexOf(":") != -1) {
        	var infoArr = sInfo.split(":");
	        var answerResult = new AnswerResult();
	        answerResult.deviceId = KeySN;
	        answerResult.datamark = infoArr[0];
	        answerResult.answer = infoArr[1];
	        global.answerList.push(answerResult);
        }
    }else if(iModeType==13){
        global.winner.push(KeySN);
    }

    console.log("keyCallBack--: BaseID:"+BaseID+" KeyID :"+KeyID +"KeySN"+KeySN+ " BaseMode:"+ iMode +" Time:"+Time +" sInfo:" +sInfo);
}

const ConnectEventCallBack = ffi.Callback('void', ['int', 'int', 'string'], connCallBack);
//sunVoteSDK调用
// var ConnectEventCallBack = ffi.Callback('void', ['int', 'int', 'string'], function (iBaseID, iMode, sInfo) {
//     if (sInfo == 2) {
//         libSunVoteSDK.Connect(paramEnum.conn_type_usb, "");
//     }
// });
const HDParamEventCallBack = ffi.Callback('void', ['int', 'int', 'string'], function (iBaseID, iMode, sInfo) {
    console.log("HDParamEventCallBack--:"+"baseID :"+iBaseID +" BaseMode:"+ iMode + " sInfo:" +sInfo);
});


const VoteEventCallBack = ffi.Callback('void', ['int', 'int', 'string'], voteCallBack);
const KeyEventCallBack = ffi.Callback('void', ['int','int','string', 'int', 'float','string'], keyCallBack);



libSunVoteSDK.SetConnectEventCallBack(ConnectEventCallBack);
libSunVoteSDK.SetHDParamEventCallBack(HDParamEventCallBack);
libSunVoteSDK.SetKeyEventCallBack(KeyEventCallBack);
libSunVoteSDK.SetVoteEventCallBack(VoteEventCallBack);

libSunVoteSDK.Connect(paramEnum.conn_type_usb, "");


process.on('exit', function() {
    ConnectEventCallBack;
    HDParamEventCallBack;
    VoteEventCallBack;
    KeyEventCallBack;
});

/* function test(){
  var keyStr = 1;
  for(var i=0;i<100;i++){
    console.log(keyStr);
    libSunVoteSDK.VoteStart(keyStr, "1,1,0,0,4,1");
    if(i%2 == 0){
      keyStr=10
    }else{
      keyStr = 1;
    }

  }
} */

//let i = 1;
//const keyStr = paramEnum.VoteType_Choice;//10;
//function test2(){
//
//  /*  if(i%2 == 0){
//     keyStr=10
//     var  Base_Version = 11;
//     libSunVoteSDK.ReadHDParam(0,Base_Version);
//   }else{
//     keyStr = 1;
//   } */
//  i++;
//  console.log("startVote");
//  console.log('i='+i+",type="+keyStr);
//  libSunVoteSDK.VoteStart2(0,keyStr, "1,1,0,0,4,1");
//
//  if(i<2){
//      setTimeout(test2,'5000');
//  }
//}
//test2();

//开始签到
exports.signinStart = function() {
//	signUser = "已签到用户设备号：";
//	signUser = "已答题用户：";
	userMap = {};
    var i = libSunVoteSDK.VoteStart2(1,"1","1");
    return i;
}
// 获取签到结果
exports.getSignin = function() {
    const userList = [];
    for(var key in userMap){
        userList.push(key);
    }
    return userList;
}
//停止签到
exports.signinStop = function() {
    var i = libSunVoteSDK.VoteStop2(1)
    return i;
}

//开始答题
exports.answerStart = function(voteType,answerStarParam) {
    global.answer = {};		//清空答题记录
    global.answerList = [];
    global.padAnswerList = [];		// 添加到全局变量缓存中  结束下发使用
	global.padAnswerUserList = [];	
    signUser = "已签到用户设备号：";
    signUser = "已答题用户：";
//	var i =  libSunVoteSDK.VoteStart2(1,14,"5,1,1,0:4")
    var i =  libSunVoteSDK.VoteStart2(1,voteType,answerStarParam);
    return i;
}

// 获取答题设备结果
exports.getAnswer = function() {
    let userAnswerList = [];
    for(var key in global.answer){
        userAnswerList.push(key);
    }
    return userAnswerList;
}

//开始抢答
exports.startRushAnswer = function(voteType,answerStarParam) {
    global.winner = [];
    signUser = "已签到用户设备号：";
    signUser = "已答题用户：";
    var i = libSunVoteSDK.VoteStart(voteType,answerStarParam);
    return i;
}




//结束答题
exports.answerStop = function() {
    libSunVoteSDK.VoteStop2(1);
}
