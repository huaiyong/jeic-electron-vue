var room = require("../modules/entity/Room.js")
const screenshot = require('screenshot-desktop')
var open = require("open");

// 关闭系统防火墙
var path = require('path');
var child_process = require("child_process")
child_process.execFile("01.bat", null, { cwd: __dirname }, function (error, stdout, stderr) {
	if (error !== null) {
		console.log("exec error" + error)
	}
	else console.log("yes!")
})

function chatSocket() {
	return this;
}
module.exports = chatSocket;
chatSocket.Start = function Start(io) {

	var rooms = new Array();
	var userList = new Array();
	var userSocketMap = {};

	io.sockets.on('connection', function (socket) {

		//接收用户创建房间的指令
		socket.on('cRoom', function (data) {
			var dataobj
			if (typeof (data) == "string") {
				dataobj = JSON.parse(data)
			} else {
				dataobj = data
			}
			var repCreate = false;
			//判断房间是否存在
			rooms.forEach(function (r) {
				if (r.name == dataobj.classId) {
					repCreate = true;
				}
			});

			if (!repCreate) {
				leaveMyInRoom(dataobj, socket, rooms);
				var r = new room(dataobj.classId, dataobj.userId);
				rooms.push(r);
				socket.join(dataobj.classId);
				console.log("cRoom:：classId====" + dataobj.classId);
			}
		});

		socket.on('jeic', function (data) {
			console.log(data)
			
			if (typeof (data) == "string") {
				data = JSON.parse(data)
			} else {
				data = data;
			};

			switch (data.name) {
				case "teacherInfo":    //用户
					io.emit("teacherInfo");
					break;
				case "closeTeacherInfo": //关闭用户
					io.emit("closeTeacherInfo");
					break;
				case "memberAdmin":   //成员
					io.emit("memberAdmin");
					break;
				case "closeMemberAdmin":   //关闭成员  
					io.emit("closeMemberAdmin");
					break;
				case "ketangjilu":   //教学记录
					io.emit("ketangjilu");
					break;
				case "closeketangjilu":   //关闭教学记录
					io.emit("closeketangjilu");
					break;
				case "drawclick": //画板
					io.emit("drawclick");
					break;	
				case "jiaoxueXiangQing":   //点击课堂记录资源详情同步
					io.emit("jiaoxueXiangQing", data.id, data.resourceId, data.imgUrl, data.type, data.resName);
					break;
				case "historyLastQuestion": //课堂记录  云试题上一题
					io.emit("historyLastQuestion");
					break;
				case "historyNextQuestion": //课堂记录  云试题下一题
					io.emit("historyNextQuestion");
					break;
				case "showResoce": //点击单个资源查看资源
					io.emit("showSingleResoce",data.resId, data.resType);
					break;
				case "closeimgtc": //关闭图片
					io.emit("closeimgtc");
					break;
				case "closePpt": //关闭ppt,word以及excel
					if (data.data == "ppt") {
						io.emit("closeppttc");
					} else if (data.data == "word") {
						io.emit("closewordtc");
					} else if (data.data == "excel") {
						io.emit("closeexceltc");
					};
					break;
				case "closePdf":
					io.emit("closePdf"); //关闭pdf
					break;
				case "closeresdetail":
					io.emit("closeresdetail"); //关闭音频视频
					break;
				case "imgBig":
					io.emit("imgZoom",data.picName); //图片放大  big
					break;
				case "imgSmall":
					io.emit("imgZoom",data.picName); //图片缩小 small
					break;
				case "imgLeft":
					io.emit("imgMove",data.picName); //图片左移 left
					break;
				case "imgRight":
					io.emit("imgMove",data.picName); //图片右移  right
					break;
				case "imgTop":
					io.emit("imgMove",data.picName); //图片上移  top
					break;
				case "imgBottom":
					io.emit("imgMove",data.picName); //图片下移  bottom
					break;
				case "imgRotate":
					io.emit("imgRotate"); //图片旋转
					break;
				case "PlayVideo": //视频播放
					var playVideo = document.getElementById("my-video");
					io.emit("PlayVideo");
					break;
				case "PauseVideo": //视频停止
					var playVideo = document.getElementById("my-video");
					io.emit("PlayVideo");
					break;
				case "closeshowType":
					io.emit("closeshowType"); //关闭资源显示类型选项弹窗
					break;
				case "recordshiticlose": //关闭课堂试题详情页面
					io.emit("recordshiticlose");
					break;
				case "checkJiluClass": //查看课堂记录柱状图
					io.emit("checkJiluClass",data.text);
					break;
				case "clickStuPicture": //点击学生头像，查看学生上传的图片
					io.emit("studentFileEvents",data.stuId);
					break;
				case "clickStuPicUrl": //点击学生头像，查看学生上传的图片
					io.emit("showstuimgResoce",data.imgUrl);
					break;
				case "checkStuDeail":  //课堂记录点击学生头像查看答题情况
					io.emit("checkStuDeail",data.stuId, data.stuName);
					break;
				case "changeClassroomState":  //点击上课或下课
					io.emit("changeClassroomState");
					break;
				case "sureBeginClass": //确认上课
					io.emit("sureBeginClass", data.classId, data.subjectId, data.subjectName);
					break;
				case "sureStopClass": //确认下课
					io.emit("sureStopClass");
					break;
				case "closeClassroom": //取消下课或者关闭上课弹框
					io.emit("closeClassroom");
					break;
				case "resouceAdmin":  //资源
					io.emit("resouceAdmin");
					break;
				case "closeResouceAdmin":  //关闭资源
					io.emit("closeResouceAdmin");
					break;
				case "restabSwitch":  //切换资源和试题
					io.emit("restabSwitch", data.restabN);
					break;
				case "showShiti":  //查看云试题       参数改为两个 资源id和类型
					io.emit("showShiti", data.shitiId, data.shitiname);
					break;
				case "closeStudentAnswers": //关闭云试题
					io.emit("closeStudentAnswers");
					break;	
				case "small": //试题字体小
					io.emit("small");
					break;
				case "middle": //试题字体中
					io.emit("middle");
					break;
				case "big": //试题字体大
					io.emit("big");
					break;
				case "nextQuestion": //答题页面下一题      改
					io.emit("nextQuestion");
					break;
				case "prevQuestion": //答题页面上一题     改
					  io.emit("prevQuestion"); 
					  break;
			    case "testImgLook": //答题页面查看图片
					  io.emit("testImgLook");
				      break;							
				case "ToggleHide": //答题页面放大试题盒子
					  io.emit("ToggleHide"); 
					  break;
				case "ToggleShow": //答题页面缩小试题盒子
					  io.emit("ToggleShow"); 
					  break;							  
				case "xiafahomework": //下发
			        io.emit("xiafahomework"); 
			        break;
			    case "stopAnswer": //结束答题
			        io.emit("stopAnswer"); 
			        break;
			    case "datiInfo": //查看答题情况
			         io.emit("datiInfo"); 
			         break;
			    case "watchStudetail": //查看个人答题情况
			         io.emit("watchStudetail",data.id,data.stuName,data.groupName); 
			         break;
			    case "closestrscorewindow": //关闭查看个人答题情况
			         io.emit("closestrscorewindow"); 
			         break;
				case "closeChooseStudent": //关闭小组弹框
				      io.emit("closeChooseStudent"); 
				      break;	 
				case "groupMode" : //切换分组模式    0是组长作答 1是全组作答
					  io.emit("groupMode",data.index);
					  break;	 
				case "allGroupLeaderChecked" : //全选组长
					  io.emit("allGroupLeaderChecked",data.state);
					  break;
				case "checkedGroupLeader" : //选择组长    //组长下标
					  io.emit("checkedGroupLeader",data.index,data.state);
					  break;
			    case "groupLeaderBtn" : //组长模式下发
			    	  io.emit("groupLeaderBtn");
			    	  break;
				case "allGroupChecked" : //全组作答模式全选
					  io.emit("allGroupChecked",data.state);
					  break;							   
				case "checkedGroup" : //全组作答   全选某一小组
					  io.emit("checkedGroup",data.index,data.state);
					  break;
				case "checkedStudent" : //全组作答   选择组员（包括组长）  groupIndex 为小组的下标  index为组员的下标 组长为-1，组员为他在数据中的下标减1
					  io.emit("checkedStudent",data.groupIndex,data.index,data.state);
					  break;									 
				case "allGroupBtn" : //全组作答下发
					  io.emit("allGroupBtn");
					  break;							   
			    case "showChuangti": //拍照创题
				      io.emit("showChuangti",data.shitiImageUrl, data.shitiType, data.answer);
			    	  break;											   							   
				case "resourcesMinimize": //最小化资源		 
					  if(data.data=="test"){   //云试题
							io.emit("minimizeTest");   
					  }else if(data.data=="ppt"){ //ppt
					  	io.emit("minimizePpt"); 
					  }else if(data.data=="word"){ //word
					  	io.emit("minimizeWord"); 
					  }else if(data.data=="excel"){ //excel
					  	io.emit("minimizeExcel"); 
					  }else if(data.data=="img"){ //img
					  	io.emit("minimizeImg"); 
					  }else if(data.data=="pdf"){ //pdf
					  	io.emit("minimizePdf"); 
					  };
					  break;	   
				case "resourcesMaximization": //最大化资源
					  if(data.data=="test"){   //云试题
						io.emit("maximizeTest");   
					  }else if(data.data=="ppt"){ //ppt
					  	io.emit("maximizePpt"); 
					  }else if(data.data=="word"){ //word
					  	io.emit("maximizeWord"); 
					  }else if(data.data=="excel"){ //excel
					  	io.emit("maximizeExcel"); 
					  }else if(data.data=="img"){ //img
					  	io.emit("maximizeImg"); 
					  }else if(data.data=="pdf"){
					  	io.emit("maximizePdf"); //pdf
					  };
                    break;
				//小工具
			 
				case "toolsShow":  //小工具展开
					  io.emit("toolsShow");
					  break;
				case "toolsHide":  //小工具缩小
					  io.emit("toolsHide");
					  break;	
				case "Rollcall":  //点名
					  io.emit("Rollcall");
					  break;
				case "search":  //搜索
					  io.emit("search");
					  break;	
				case "clock":  //打开倒计时
					  io.emit("clock");
					  break;						 
				case "closeClock":  //关闭倒计时
					  io.emit("closeClock");
					  break;
				case "revokeAnnotation":  //撤销批注
					  io.emit("revokeAnnotation");
					  break;
				case "closeAnnotation":  //关闭批注      新添
					  io.emit("closeAnnotation");
					  break;
				case "showColor":  //批注选择颜色和大小托盘     新添
					  io.emit("showColor");
					  break;			
			    case "sizeAnnotation":  //批注选择画笔粗细      index为下标 data为大小
					  io.emit("sizeAnnotation",data.index,data.data);
					  break;
			    case "colorAnnotation":  //批注选择颜色      index为下标 data为颜色
					  io.emit("colorAnnotation",data.index,data.data);
					  break;	  
				case "moretoolsClick":  //更多
					  io.emit("moretoolsClick");
					  break;
				case "qiangDa":  //抢答
					  io.emit("qiangDa");
					  break;
				 case "startQuickResponseQuestion":  //开始抢答
					  io.emit("startQuickResponseQuestion");
					  break;
				case "closeqiangda":  //关闭抢答
					  io.emit("closeqiangda");
					  break;				   
                case "imageDuiBi":  //拍照对比
				     io.emit("imageDuiBi",data.data);
				     break;			   
				case "closeComper":  //关闭拍照对比
					  io.emit("closeComper");
					  break;
				case "closeimgtc":  //关闭拍照对比二级页面
					  io.emit("closeimgtc");
					  break;						 
				case "findImageByIndex": //拍照对比查看单张详细的图
				      io.emit("findImageByIndex",data.index);
					  break;				   
				case "leftImage": //上一张图片
					  io.emit("leftImage");
					  break;
				case "rightImage": //下一张图片
					  io.emit("rightImage");
					  break;				   		   
                case "closeqiangda":  //关闭抢答
                	  io.emit("closeqiangda");
                	  break;

				// 分组教学模块
				case "teacheModel": //进入分组教学模块
					io.emit("teacheModel");
					break;
				case "closeTeacheModel": //关闭教学模块
					io.emit("closeTeacheModel");
					break;
				case "teacheModelType": //分组和全班教学的切换 
					io.emit("teacheModelType",data.type);
					break;
				case "sureTeacheModelAll": //全班教学模式---确认选择 
					io.emit("sureTeacheModelAll"); 
					break;
				case "sureTeacheModelGroup": //分组教学模式---确认选择 
					io.emit("sureTeacheModelGroup"); 
					break;
				case "selectedTeacheModel": //分组教学模式---分组列表切换
					io.emit("selectedTeacheModel",data.position);
					break;
				case "lookTeacheModel": //分组教学模式---查看按钮 
					io.emit("lookTeacheModel",data.position);
					break;
				case "teacheModelBack": //分组教学模式---查看弹层的返回和关闭    
					io.emit("teacheModelBack");
					break;
				case "deleteTeacheModel": //分组教学模式---删除按钮     
					io.emit("deleteTeacheModel",data.position);
					break;
				case "deleteCanCel": //分组教学模式---删除按钮 (取消按钮)    
					io.emit("deleteCanCel");
					break;
				case "deleteConfirm": //分组教学模式---删除按钮 (确认按钮)    
					io.emit("deleteConfirm",data.position);
					break;
				case "completeTeacheModel": //分组教学模式---监测是否刷新分组接口    
					io.emit("completeTeacheModel");
					break;
					
					// 试题统计模块
				case "showTable": //点击切换到统计表格页面
					io.emit("showTable");
					break;
				case "tihao": //点击切换到统计表格页面	
					io.emit("tihao",data.data);
					break;
				case "A": //切换柱状图ABCD选项
					io.emit("A");
					break;
				case "B":
					io.emit("B");
					break;
				case "C":
					io.emit("C")
					break;
				case "D":
					io.emit("D")
					break;
				case "E":
					io.emit("E")
					break;
				case "F":
					io.emit("F")
					break;
				case "G":
					io.emit("G")
					break;
				case "H":
					io.emit("H")
					break;
				case "I":
					io.emit("I")
					break;
				case "J":
					io.emit("J")
					break;
				case "YES":
					io.emit("YES")
					break;
				case "NO":
					io.emit("NO")
					break;
				case "prevQuestionStatistics": //查看班级答题情况上一题
					io.emit("prevQuestionStatistics")
					break;
				case "nextQuestionStatistics": //查看班级答题情况下一题
					io.emit("nextQuestionStatistics")
					break;
				case "fanhui": //查看班级答题情况下一题
					io.emit("fanhui")
					break;
				case "closeInfoWindow": //关闭班级答题统计页面
					io.emit("closeInfoWindow")
					break;
				case "watchStudetail": //打开小红花页面
					io.emit("watchStudetail")
					break;
				case "closestrscroce": //关闭小红花统计页面
					io.emit("closestrscroce")
					break;
			};

			if (data.name == "shangke") {

				io.emit("shangke");
			}
			if (data.name == "xiake") {
				io.emit("xiake");
				var path = require('path');
				var glob = require('glob')
				var fs = require('fs');
				var Promise = require('bluebird');
				var readdir = Promise.promisify(fs.readdir);
				var rename = Promise.promisify(fs.rename);
				var readFile = Promise.promisify(fs.readFile);
				var writeFile = Promise.promisify(fs.writeFile);
				var request = Promise.promisify(require('request'));

				function updateFile(filepath, dir) {
					let tmp_fileName = filepath.split('/').slice(2).join('/');
					var formData = {
						file: fs.createReadStream(filepath)
					};
					var _options = {
						method: 'POST',
						uri: 'http://47.93.207.20:9038/jeicAdmin/api/WebmFlileController/webmFile.do',
						qs: {
							guid: '***',
							rand: 1,
							time: 1,
							platform: 'server'
						},
						formData: formData
					}
					request(_options)
						.then(function (res) {
							var _body = JSON.parse(res.body);
							if (!_body.errno) {
								var resinfo = JSON.parse(res.body);
								console.log(resinfo);
								if (resinfo.state == "200") {
									var fs = require('fs');
									fs.unlinkSync("C:/luping/" + resinfo.fileRealName, function (err) {
										if (err) throw err;
									});
								}
								//writeJson(tmp_fileName, resinfo.data.url);
							}
						})
						.catch(function (err) {
							console.log(err)
						})
				}


				glob.sync('C:/luping/*.*').forEach(function (entry) {
					console.log(entry);
					basename = path.basename(entry)
					if (/(webm)$/.test(basename)) {
						//console.log("需要上传的文件:\n" + entry + "\n")
						updateFile(entry)
					}
				})
			}

			var tempArr = Object.keys(socket.rooms);
			var room;
			for (var i = 0; i < tempArr.length; i++) {
				if (tempArr[i] == socket.id) {
					tempArr.splice(i, 1);
				}
			}

			room = tempArr[0];

			console.log(data)
			var dataobj
			if (typeof (data) == "string") {

				dataobj = JSON.parse(data)
				console.log("pad发送jeic：data.name====" + data.name)
			} else {
				console.log("大屏发送jeic：data.name====" + data.name)
				dataobj = data
			}
			if (dataobj.name == "sureBeginClass") {
				io.emit('jeic', dataobj);
			} else {
				io.to(room).emit('jeic', dataobj);
			}
			
			if(data.name=="pingtai"){
				var pingtaisrc="http://111.207.13.88:8881/jeuc/api/oauth/toClientUrl?clientId=1&userId="+data.userId+"&areaCode="+data.cityId
				open(pingtaisrc, "chrome");
			}

			if (dataobj.name == "pptAnnotation") {
				//截图
				screenshot().then((img) => {
					var imgsrc = img.toString('base64');
					var imghost = '' + imgsrc
					io.emit('jeic', { "name": "pptJieping", "data": imghost });
					console.log(imghost)
				}).catch((err) => {
					throw err
				})
			}
			
			if (dataobj.name == "resAnnotation") {
				//截图
				screenshot().then((img) => {
					var imgsrc = img.toString('base64');
					var imghost = '' + imgsrc
					io.emit('jeic', { "name": "resJieping", "data": imghost });
					console.log(imghost)
				}).catch((err) => {
					throw err
				})
			}
			
		});

		/*** 创建画板页面的socket.io连接*/
		socket.on('draw', function (data) {
			io.emit('draw', data);
		});

		/*** ppt页面的socket.io连接*/
		socket.on('ppt', function (data) {
			io.emit('ppt', data);
		});

		socket.on('leaveRoom', function (data) {
			console.log(data);
			leaveMyInRoom(data, socket, rooms);
			var index = userList.indexOf(data.user);
			if (index != -1) {
				userList.splice(index, 1);
			}
			socket.broadcast.emit('say', {
				value: ' [' + data.user + ']离开了房间!',
				'user': 'System'
			});
			io.emit('refRooms', {
				rooms: rooms
			});
		});


		socket.on('joinRoom', function (data) {
			console.log("data:" + data);

			var dataobj
			if (typeof (data) == "string") {
				dataobj = JSON.parse(data)
			} else {
				dataobj = data
			}
			console.log("dataobj:" + dataobj);
			//是否重复加入
			var repJoin = false;
			leaveMyInRoom(dataobj, socket, rooms);
			rooms.forEach(function (r) {
				if (r.name == dataobj.classId) {
					repJoin = r.userContains(dataobj.user);
					if (!repJoin)
						r.addUser(dataobj.user);
				}
			});
			if (!repJoin) {
				socket.join(dataobj.classId);


			} else { }

		});
		socket.on('disconnect', function (socket) {
			//console.log(socket.);
			console.log("有人断开链接:socket.id=====" + socket.id)
		});
	});
}

function leaveMyInRoom(data, socket, rooms) {
	//记录房间用户为0的序号
	var delRoom = -1;
	var index = 0;
	if (data.currRoom != '无') {
		socket.leave(data.currRoom);
		rooms.forEach(function (r) {
			if (r.name == data.currRoom) {
				r.removeUser(data.user);
				if (r.getUsers().length == 0) {
					delRoom = index;
				}
			}
			index++;
		});
	}
	if (delRoom != -1) {
		rooms.splice(delRoom, 1);
	}
}
