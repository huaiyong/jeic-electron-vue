const room = require('../modules/entity/Room.js');
const open = require('open');

function chatSocket() {
  return this;
}
module.exports = chatSocket;
chatSocket.Start = function Start(io) {

  const rooms = new Array();
  const userList = new Array();
  const userSocketMap = {};

  io.sockets.on('connection', function(socket) {


    socket.on('padId', function() {
      socket.emit('id', socket.id);
      console.log('-- ' + socket.id + ' joined --');
    });
    socket.on('message', function(details) {
		  const otherClient = io.sockets.connected[details.to];

		  if (!otherClient) {
		    return;
		  }

		    delete details.to;
		    details.from = socket.id;
		    otherClient.emit('message', details);
    });

    socket.on('readyToStream', function(options) {
		  console.log('-- ' + socket.id + ' is ready to stream --');

		  // streams.addStream(socket.id, options.name);
    });


    // 接收用户创建房间的指令
    socket.on('cRoom', function(data) {
      let dataobj;
      if (typeof (data) === 'string') {
        dataobj = JSON.parse(data);
      } else {
        dataobj = data;
      }
      let repCreate = false;
      // 判断房间是否存在
      rooms.forEach(function(r) {
        if (r.name == dataobj.classId) {
          repCreate = true;
        }
      });

      if (!repCreate) {
        leaveMyInRoom(dataobj, socket, rooms);
        const r = new room(dataobj.classId, dataobj.userId);
        rooms.push(r);
        socket.join(dataobj.classId);
        console.log('cRoom:：classId====' + dataobj.classId);
      }
    });

    socket.on('jeic', function(data) {
      console.log(data);

      if (typeof (data) === 'string') {
        data = JSON.parse(data);
      } else {
        data = data;
      }

      switch (data.name) {
        case 'getVoteId': // voteId
          io.emit('getVoteId',data);
          break;
		case 'selectClass': // 选择年级
		   io.emit('selectClass',data.data);
		   break;
		case 'selectSubject': // 选择科目
		   io.emit('selectSubject',data.data);
		   break; 
        case 'teacherInfo': // 用户
          io.emit('teacherInfo');
          break;
        case 'closeTeacherInfo': // 关闭用户
          io.emit('closeTeacherInfo');
          break;
        case 'memberAdmin': // 成员
          io.emit('memberAdmin');
          break;
        case 'closeMemberAdmin': // 关闭成员
          io.emit('closeMemberAdmin');
          break;
        case 'ketangjilu': // 教学记录
          io.emit('ketangjilu');
          break;
        case 'closeketangjilu': // 关闭教学记录
          io.emit('closeketangjilu');
          break;
        case 'drawclick': // 画板
          io.emit('drawclick');
          break;
        case 'closeDraw': // 关闭画板
          io.emit('closeDraw');
          break;
        case 'jiaoxueXiangQing': // 点击课堂记录资源详情同步
          io.emit('jiaoxueXiangQing', data.id, data.resourceId, data.imgUrl, data.type, data.resName, data.sendType, data.answerType);
          break;
        case 'historyLastQuestion': // 课堂记录  云试题上一题
          io.emit('historyLastQuestion');
          break;
        case 'historyNextQuestion': // 课堂记录  云试题下一题
          io.emit('historyNextQuestion');
          break;
        case 'showResoce': // 点击单个资源查看资源
          io.emit('showSingleResoce', data.resId, data.resType);
          break;
        case 'closeimgtc': // 关闭图片
          io.emit('closeimgtc');
          break;
        case 'closePpt': // 关闭ppt,word以及excel
          if (data.data == 'ppt') {
            io.emit('closeppttc');
          } else if (data.data == 'word') {
            io.emit('closewordtc');
          } else if (data.data == 'excel') {
            io.emit('closeexceltc');
          }
          break;
        case 'closePdf':
          io.emit('closePdf'); // 关闭pdf
          break;
        case 'closeresdetail':
          io.emit('closeresdetail'); // 关闭音频视频
          break;
        case 'imgBig':
          io.emit('imgZoom', data.name); // 图片放大  big
          break;
        case 'imgSmall':
          io.emit('imgZoom', data.name); // 图片缩小 small
          break;
        case 'imgLeft':
          io.emit('imgMove', data.name); // 图片左移 left
          break;
        case 'imgRight':
          io.emit('imgMove', data.name); // 图片右移  right
          break;
        case 'imgTop':
          io.emit('imgMove', data.name); // 图片上移  top
          break;
        case 'imgBottom':
          io.emit('imgMove', data.name); // 图片下移  bottom
          break;
        case 'imgRotate':
          io.emit('imgRotate'); // 图片旋转
          break;
        case 'PlayVideo': // 视频播放
          io.emit('PlayVideo');
          break;
        case 'PauseVideo': // 视频停止);
          io.emit('PauseVideo');
          break;
        case 'closeWindow':
          io.emit('closeshowType'); // 关闭资源显示类型选项弹窗
          break;
        case 'recordshiticlose': // 关闭课堂试题详情页面
          io.emit('recordshiticlose');
          break;
        case 'checkJiluClass': // 查看课堂记录柱状图
          io.emit('checkJiluClass', data.text);
          break;
        case 'clickStuPicture': // 点击学生头像，查看学生上传的图片
          io.emit('clickStuPicture', data.stuId);
          break;
        case 'clickStuPicUrl': // 点击学生头像，查看学生上传的图片
          io.emit('clickStuPicUrl', data.imgUrl);
          break;
        case 'closeStuPicTC': // 关闭学生上传弹窗
          io.emit('closeStuPicTC');
          break;
        case 'checkStuDeail': // 课堂记录点击学生头像查看答题情况
          io.emit('checkStuDeail', data.stuId, data.stunName);
          break;
        case 'changeClassroomState': // 点击上课或下课
          io.emit('changeClassroomState');
          break;
        case 'sureBeginClass': // 确认上课
          io.emit('sureBeginClass', data.classId, data.subjectId, data.subjectName);
          break;
        case 'sureStopClass': // 确认下课
          io.emit('sureStopClass');
          break;
        case 'closeClassroom': // 取消下课或者关闭上课弹框
          io.emit('closeClassroom');
          break;
        case 'resouceAdmin': // 资源
          io.emit('resouceAdmin');
          break;
        case 'closeResouceAdmin': // 关闭资源
          io.emit('closeResouceAdmin');
          break;
        case 'restabSwitch': // 切换资源和试题
          io.emit('restabSwitch', data.restabN);
          break;
        case 'showShiti': // 查看云试题       参数改为两个 资源id和类型
          io.emit('showShiti', data.shitiId, data.shitiname);
          break;
        case 'closeStudentAnswers': // 关闭云试题
          io.emit('closeStudentAnswers');
          break;
        case 'small': // 试题字体小
          io.emit('small');
          break;
        case 'middle': // 试题字体中
          io.emit('middle');
          break;
        case 'big': // 试题字体大
          io.emit('big');
          break;
        case 'nextQuestion': // 答题页面下一题      改
          io.emit('nextQuestion');
          break;
        case 'prevQuestion': // 答题页面上一题     改
					  io.emit('prevQuestion');
					  break;
			    case 'testImgLook': // 答题页面查看图片
					  io.emit('testImgLook', data.data);
				      break;
        case 'ToggleHide': // 答题页面放大试题盒子
					  io.emit('ToggleHide');
					  break;
        case 'ToggleShow': // 答题页面缩小试题盒子
					  io.emit('ToggleShow');
					  break;
        case 'xiafahomework': // 下发
			        io.emit('xiafahomework');
			        break;
			    case 'stopAnswer': // 结束答题
			        io.emit('stopAnswer');
			        break;
			    case 'datiInfo': // 查看答题情况
			         io.emit('datiInfo');
			         break;
			    case 'watchStudetail': // 查看个人答题情况
			         io.emit('watchStudetail', data.id, data.stuName, data.groupName);
			         break;
			    case 'closestrscorewindow': // 关闭查看个人答题情况
			         io.emit('closestrscorewindow');
			         break;
        case 'closeChooseStudent': // 关闭小组弹框
				      io.emit('closeChooseStudent');
				      break;
        case 'groupMode' : // 切换分组模式    0是组长作答 1是全组作答
					  io.emit('groupMode', data.index);
					  break;
        case 'allGroupLeaderChecked' : // 全选组长
					  io.emit('allGroupLeaderChecked', data.state);
					  break;
        case 'checkedGroupLeader' : // 选择组长    //组长下标
					  io.emit('checkedGroupLeader', data.index, data.state);
					  break;
			    case 'groupLeaderBtn' : // 组长模式下发
			    	  io.emit('groupLeaderBtn');
			    	  break;
        case 'allGroupChecked' : // 全组作答模式全选
					  io.emit('allGroupChecked', data.state);
					  break;
        case 'checkedGroup' : // 全组作答   全选某一小组
					  io.emit('checkedGroup', data.index, data.state);
					  break;
        case 'checkedStudent' : // 全组作答   选择组员（包括组长）  groupIndex 为小组的下标  index为组员的下标 组长为-1，组员为他在数据中的下标减1
					  io.emit('checkedStudent', data.groupIndex, data.index, data.state);
					  break;
        case 'allGroupBtn' : // 全组作答下发
					  io.emit('allGroupBtn');
					  break;
			    case 'showChuangti': // 拍照创题
				      io.emit('showChuangti', data.shitiImageUrl, data.shitiType, data.answer);
			    	  break;
			    case 'luxiang':
			    		io.emit('luxiang', data.imgSrc, data.name);
			    	  break;
        case 'resourcesMinimize': // 最小化资源
					  if (data.data == 'test') { // 云试题
            io.emit('minimizeTest');
					  } else if (data.data == 'ppt') { // ppt
					  	io.emit('minimizePpt');
					  } else if (data.data == 'word') { // word
					  	io.emit('minimizeWord');
					  } else if (data.data == 'excel') { // excel
					  	io.emit('minimizeExcel');
					  } else if (data.data == 'img') { // img
					  	io.emit('minimizeImg');
					  } else if (data.data == 'pdf') { // pdf
					  	io.emit('minimizePdf');
					  }
					  break;
        case 'resourcesMaximization': // 最大化资源
					  if (data.data == 'test') { // 云试题
            io.emit('maximizeTest');
					  } else if (data.data == 'ppt') { // ppt
					  	io.emit('maximizePpt');
					  } else if (data.data == 'word') { // word
					  	io.emit('maximizeWord');
					  } else if (data.data == 'excel') { // excel
					  	io.emit('maximizeExcel');
					  } else if (data.data == 'img') { // img
					  	io.emit('maximizeImg');
					  } else if (data.data == 'pdf') {
					  	io.emit('maximizePdf'); // pdf
					  }
          break;
          // 小工具

        case 'toolsShow': // 小工具展开
					  io.emit('toolsShow');
					  break;
        case 'toolsHide': // 小工具缩小
					  io.emit('toolsHide');
					  break;
        case 'pingtai': // 小工具缩小
					  io.emit('pingtai');
					  break;
			   case 'luping': // 录屏
				  io.emit('luping');
				  break;
        case 'Rollcall': // 点名
					  io.emit('Rollcall');
					  break;
        case 'search': // 搜索
					  io.emit('search');
					  break;
        case 'clock': // 打开倒计时
					  io.emit('clock');
					  break;
        case 'closeClock': // 关闭倒计时
					  io.emit('closeClock');
					  break;
			    case 'annotation': // 批注
			  	  io.emit('annotation', data.type, data.points, data.w, data.h, data.color, data.width);
			  	  break;
        case 'revokeAnnotation': // 撤销批注
					  io.emit('revokeAnnotation');
					  break;
        case 'closeAnnotation': // 关闭批注      新添
					  io.emit('closeAnnotation');
					  break;
        case 'showColor': // 批注选择颜色和大小托盘     新添
					  io.emit('showColor');
					  break;
			    case 'sizeAnnotation': // 批注选择画笔粗细      index为下标 data为大小
					  io.emit('sizeAnnotation', data.index, data.data);
					  break;
			    case 'colorAnnotation': // 批注选择颜色      index为下标 data为颜色
					  io.emit('colorAnnotation', data.index, data.data);
					  break;
        case 'moretoolsClick': // 更多
					  io.emit('moretoolsClick');
					  break;
        case 'qiangDa': // 抢答
					  io.emit('qiangDa');
					  break;
				 case 'startQuickResponseQuestion': // 开始抢答
					  io.emit('startQuickResponseQuestion');
					  break;
        case 'closeqiangda': // 关闭抢答
					  io.emit('closeqiangda');
					  break;
        case 'imageDuiBi': // 拍照对比
				     io.emit('imageDuiBi', data.data);
				     break;
        case 'closeComper': // 关闭拍照对比
					  io.emit('closeComper');
					  break;
        case 'closeimgtc': // 关闭拍照对比二级页面
					  io.emit('closeimgtc');
					  break;
        case 'findImageByIndex': // 拍照对比查看单张详细的图
				      io.emit('findImageByIndex', data.index);
					  break;
        case 'leftImage': // 上一张图片
					  io.emit('leftImage');
					  break;
        case 'rightImage': // 下一张图片
					  io.emit('rightImage');
					  break;
        case 'closeqiangda': // 关闭抢答
                	  io.emit('closeqiangda');
                	  break;
        case 'zhantai': // 实物展台
          io.emit('zhantai', data.data);
          // $(".zhantai").show();
          // toolsHide();
          // new PeerManager().peerInit(data.data)
          break;
        case 'zhantaiClose': // 实物展台
          io.emit('zhantaiClose');
          // closezhantaidetail()
          break;
        case 'toupiao': // 投票
          io.emit('toupiao', data.data);
          break;
        case 'xuanju': // 投票
          io.emit('xuanju', data.data);
          break;
        case 'endtoupiao': // 结束投票
          io.emit('endtoupiao');
          break;
        case 'closetoupiao': // 投票返回
          io.emit('closetoupiao');
          break;
		 case 'changeType': //切换柱状图
		   io.emit('changeType');
		   break;
        case 'clickechart': // 点击柱状图   需要下标
          io.emit('clickechart', data.index);
          break;
		 case 'votingBack': // 返回柱状图
		    io.emit('votingBack');
		  break;
        case 'endClickEChart': //关闭投屏
          io.emit('endClickEChart');
          break;
        // 分组教学模块
        case 'teacheModel': // 进入分组教学模块
          io.emit('teacheModel');
          break;
        case 'closeTeacheModel': // 关闭教学模块
          io.emit('closeTeacheModel');
          break;
        case 'teacheModelType': // 分组和全班教学的切换
          io.emit('teacheModelType', data.type);
          break;
        case 'sureTeacheModelAll': // 全班教学模式---确认选择
          io.emit('sureTeacheModelAll');
          break;
        case 'sureTeacheModelGroup': // 分组教学模式---确认选择
          io.emit('sureTeacheModelGroup');
          break;
        case 'selectedTeacheModel': // 分组教学模式---分组列表切换
          io.emit('selectedTeacheModel', data.position);
          break;
        case 'lookTeacheModel': // 分组教学模式---查看按钮
          io.emit('lookTeacheModel', data.position);
          break;
        case 'teacheModelBack': // 分组教学模式---查看弹层的返回和关闭
          io.emit('teacheModelBack');
          break;
        case 'deleteTeacheModel': // 分组教学模式---删除按钮
          io.emit('deleteTeacheModel', data.position);
          break;
        case 'deleteCanCel': // 分组教学模式---删除按钮 (取消按钮)
          io.emit('deleteCanCel');
          break;
        case 'deleteConfirm': // 分组教学模式---删除按钮 (确认按钮)
          io.emit('deleteConfirm', data.position);
          break;
        case 'completeTeacheModel': // 分组教学模式---监测是否刷新分组接口
          io.emit('completeTeacheModel');
          break;

          // 试题统计模块
        case 'showTable': // 点击切换到统计表格页面
          io.emit('showTable');
          break;
        case 'showPic': // 点击切换到统计表格页面
          io.emit('showPic');
          break;
        case 'tihao': // 点击切换到统计表格页面
          io.emit('tihao', data.data);
          break;
        case 'A': // 切换柱状图ABCD选项
          io.emit('A');
          break;
        case 'B':
          io.emit('B');
          break;
        case 'C':
          io.emit('C');
          break;
        case 'D':
          io.emit('D');
          break;
        case 'E':
          io.emit('E');
          break;
        case 'F':
          io.emit('F');
          break;
        case 'G':
          io.emit('G');
          break;
        case 'H':
          io.emit('H');
          break;
        case 'I':
          io.emit('I');
          break;
        case 'J':
          io.emit('J');
          break;
        case 'YES':
          io.emit('YES');
          break;
        case 'NO':
          io.emit('NO');
          break;
        case 'prevQuestionStatistics': // 查看班级答题情况上一题
          io.emit('prevQuestionStatistics');
          break;
        case 'nextQuestionStatistics': // 查看班级答题情况下一题
          io.emit('nextQuestionStatistics');
          break;
        case 'fanhui': // 查看班级答题情况下一题
          io.emit('fanhui');
          break;
        case 'closeInfoWindow': // 关闭班级答题统计页面
          io.emit('closeInfoWindow');
          break;
        case 'watchStudetail': // 打开小红花页面
          io.emit('watchStudetail');
          break;
        case 'closestrscroce': // 关闭小红花统计页面
          io.emit('closestrscroce');
          break;
			    // 以下是滚动条
        case 'groupScroll': // 选择某组滚动条
          io.emit('groupScroll', data.data);
          break;
        case 'grouperListScroll': // 查看某组学生滚动条
          io.emit('grouperListScroll', data.data);
          break;
        case 'chengyuanScroll': // 成员管理全班滚动条
		  io.emit('chengyuanScroll', data.data);
		  break;
		case 'chengyuangroupScroll': // 成员管理分组滚动条
			  io.emit('chengyuangroupScroll', data.data);
			  break;
        case 'yunziyuanScroll': // 云资源
				      io.emit('yunziyuanScroll', data.data);
					  break;
        case 'yunshitiScroll': // 云试题
				      io.emit('yunshitiScroll', data.data);
					  break;
        case 'yunshitiziyuanScrollxia': // 云试题左边
	       io.emit('yunshitiziyuanScrollxia',data);
		   break;
	    case 'yunshitiziyuanScrollshang': // 云试题左边
		   io.emit('yunshitiziyuanScrollshang',data);
		   break;
	   case 'xueshengliebiaoScroll': // 云试题 右边 学生列表滚动条
		  io.emit('xueshengliebiaoScroll', data.data);
		  break;
	   case 'testDetailListScroll': // 云试题 右边 学生列表滚动条
	   		  io.emit('testDetailListScroll', data.data);
	   		  break;	  
        case 'gerenchengjiScroll': // 查看个人成绩
		  io.emit('gerenchengjiScroll', data.data);
		   break;
        case 'chakanzongchengjiScroll':
          io.emit('chakanzongchengjiScroll', data.data);
          break;
        case 'shitijiangjieScroll':// 试题讲解a-j
		 io.emit('shitijiangjieScroll', data.data);
          break;
        case 'xiaoHongHuaScroll':// 小红花
		  io.emit('xiaoHongHuaScroll', data.data);
          break;
        case 'getGroupStudentRange':
          io.emit('getGroupStudentRange', data.groupId);
          break;
        case 'allGroup':
          io.emit('allGroup');
          break;
        case 'checkGroup':
          io.emit('checkGroup', data.index, data.data);
          break;
        case 'closeGroupStudentRange':
          io.emit('closeGroupStudentRange');
          break;
        case 'closeStudZhenQueLv':
          io.emit('closeStudZhenQueLv');
          break;
      }

      if (data.name == 'shangke') {

        io.emit('shangke');
      }
      if (data.name == 'xiake') {
        io.emit('xiake');
        const path = require('path');
        const glob = require('glob');
        const fs = require('fs');
        const Promise = require('bluebird');
        const readdir = Promise.promisify(fs.readdir);
        const rename = Promise.promisify(fs.rename);
        const readFile = Promise.promisify(fs.readFile);
        const writeFile = Promise.promisify(fs.writeFile);
        const request = Promise.promisify(require('request'));

        function updateFile(filepath, dir) {
          const tmp_fileName = filepath.split('/').slice(2).join('/');
          const formData = {
            file: fs.createReadStream(filepath),
          };
          const _options = {
            method: 'POST',
            uri: 'http://47.93.207.20:9038/jeicAdmin/api/WebmFlileController/webmFile.do',
            qs: {
              guid: '***',
              rand: 1,
              time: 1,
              platform: 'server',
            },
            formData,
          };
          request(_options)
            .then(function(res) {
              const _body = JSON.parse(res.body);
              if (!_body.errno) {
                const resinfo = JSON.parse(res.body);
                console.log(resinfo);
                if (resinfo.state == '200') {
                  const fs = require('fs');
                  fs.unlinkSync('C:/luping/' + resinfo.fileRealName, function(err) {
                    if (err) throw err;
                  });
                }
                // writeJson(tmp_fileName, resinfo.data.url);
              }
            })
            .catch(function(err) {
              console.log(err);
            });
        }


        glob.sync('C:/luping/*.*').forEach(function(entry) {
          console.log(entry);
          basename = path.basename(entry);
          if (/(webm)$/.test(basename)) {
            // console.log("需要上传的文件:\n" + entry + "\n")
            updateFile(entry);
          }
        });
      }

      const tempArr = Object.keys(socket.rooms);
      let room;
      for (let i = 0; i < tempArr.length; i++) {
        if (tempArr[i] == socket.id) {
          tempArr.splice(i, 1);
        }
      }

      room = tempArr[0];

      console.log(data);
      let dataobj;
      if (typeof (data) === 'string') {

        dataobj = JSON.parse(data);
        console.log('pad发送jeic：data.name====' + data.name);
      } else {
        console.log('大屏发送jeic：data.name====' + data.name);
        dataobj = data;
      }
      if (dataobj.name == 'sureBeginClass') {
        io.emit('jeic', dataobj);
      } else {
        io.to(room).emit('jeic', dataobj);
      }

      // 截图批注
      if (dataobj.name == 'pizhu') {
      	const screenshot = require('screenshot-desktop');
        screenshot().then(img => {
          const imgsrc = img.toString('base64');
          const imghost = '' + imgsrc;
          io.emit('jeic', { name: 'jieping', data: imghost });
          console.log(imghost);
        }).catch(err => {
          throw err;
        });
      }
    });

    socket.on('config', function(data) {
      socket.broadcast.emit('config', data);
    });

    socket.on('draw', function(data) {
      socket.broadcast.emit('draw', data);
      console.log(data);
    });
	
	socket.on('vote', function(data) {
	  socket.broadcast.emit('vote', data);
	  console.log(data);
	});

    /** * ppt页面的socket.io连接*/
    socket.on('ppt', function(data) {
      io.emit('ppt', data);
    });

    socket.on('leaveRoom', function(data) {
      console.log(data);
      leaveMyInRoom(data, socket, rooms);
      const index = userList.indexOf(data.user);
      if (index != -1) {
        userList.splice(index, 1);
      }
      socket.broadcast.emit('say', {
        value: ' [' + data.user + ']离开了房间!',
        user: 'System',
      });
      io.emit('refRooms', {
        rooms,
      });
    });


    socket.on('joinRoom', function(data) {
      console.log('data:' + data);

      let dataobj;
      if (typeof (data) === 'string') {
        dataobj = JSON.parse(data);
      } else {
        dataobj = data;
      }
      console.log('dataobj:' + dataobj);
      // 是否重复加入
      let repJoin = false;
      leaveMyInRoom(dataobj, socket, rooms);
      rooms.forEach(function(r) {
        if (r.name == dataobj.classId) {
          repJoin = r.userContains(dataobj.user);
          if (!repJoin) { r.addUser(dataobj.user); }
        }
      });
      if (!repJoin) {
        socket.join(dataobj.classId);
      } else { }

    });
    socket.on('disconnect', function(socket) {
      console.log('有人断开链接:socket.id=====' + socket.id);
    });
  });
};

function leaveMyInRoom(data, socket, rooms) {
  // 记录房间用户为0的序号
  let delRoom = -1;
  let index = 0;
  if (data.currRoom != '无') {
    socket.leave(data.currRoom);
    rooms.forEach(function(r) {
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
