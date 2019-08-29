const TimeTool = require("../../tools/TimeTool");
const StreamQueue = require("./StreamQueue");
const path = require("path");
var glob = require('glob')
var fs = require('fs');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));

const fileupload = require('../../../fileupload');

var _currentRecorder;

function startRecord(userString) {
	navigator.mediaDevices.getUserMedia({
		audio: {
			mandatory: {
				chromeMediaSource: 'desktop'
			}
		},
		video: {
			mandatory: {
				chromeMediaSource: 'screen',
				minWidth: 1280,
				maxWidth: 1280,
				minHeight: 720,
				maxHeight: 800
			}
		}
	}).then(stream => {
		let systemAudioTrack = stream.getAudioTracks()[0]; //系统音轨
		let systemVideoTrack = stream.getVideoTracks()[0];
		navigator.mediaDevices.getUserMedia({
			audio: true,
			video: false
		}).then(audioStream => { //获取麦克风音频【流】
			let audioContext = new AudioContext(); //创建音频上下文
			let microphoneStreamNode = audioContext.createMediaStreamSource(audioStream); //创建节点
			let sysAudioStream = new MediaStream(); //创建一个媒体流
			sysAudioStream.addTrack(systemAudioTrack); //把系统音轨添加到新的媒体流
			let sysAudioStreamNode = audioContext.createMediaStreamSource(sysAudioStream); //创建系统音频节点
			let mixedOutput = audioContext.createMediaStreamDestination(); //创建一个输出媒体流节点
			microphoneStreamNode.connect(mixedOutput); //把麦克风节点和系统音节点添加到输出媒体流
			sysAudioStreamNode.connect(mixedOutput); //把麦克风节点和系统音节点添加到输出媒体流
			var _currentStream = mixedOutput.stream;
			_currentStream.addTrack(systemVideoTrack);
			//alert(this.getAudioBps());
			_currentRecorder = new MediaRecorder(_currentStream, {
				mimeType: "video/webm;codecs=vp9",
				audioBitsPerSecond: 48000,
				videoBitsPerSecond: 625000
			});
			var urlwebm = userString + ',' + `${TimeTool.formatDate(new Date())}` + '.webm';
			var _currentStreamQueue = new StreamQueue(path.join(getDistDirTextFieldValue(), urlwebm));
			_currentRecorder.ondataavailable = e => {
				_currentStreamQueue.appendData(e.data);
			};
			_currentRecorder.start(20);
		}).catch(err => {
			console.log(err)
			_currentRecorder = new MediaRecorder(stream, {
				mimeType: "video/webm;codecs=vp9",
				audioBitsPerSecond: 48000,
				videoBitsPerSecond: 625000
			});
			var urlwebm = userString + ',' + `${TimeTool.formatDate(new Date())}` + '.webm';
			var _currentStreamQueue = new StreamQueue(path.join(getDistDirTextFieldValue(), urlwebm));
			_currentRecorder.ondataavailable = e => {
				_currentStreamQueue.appendData(e.data);
			};
			_currentRecorder.start(20);
		});

	}).catch(error => {
		alert("设备初始化失败...");
		//this._statusSpan.innerHTML = "初始化失败";
		console.error(error)
	});

}

function stopRecord() {
	//alert("结束录屏");
	_currentRecorder.stop();
}

function getDistDirTextFieldValue() {
	return "C:/screenCap";
}

function uploadScreenCap() {
	glob.sync('C:/screenCap/*.*').forEach(function(entry) {
		//console.log(entry);
		var basename = path.basename(entry)
		//alert(basename);
		if(/(webm)$/.test(basename)) {
			//console.log("需要上传的文件:\n" + entry + "\n")
			updateFile(entry)
		}
	})
}

function updateFile(filepath, dir) {
	let tmp_fileName = filepath.split('/').slice(2).join('/');
	//录屏文件分片上传
	fileupload.chunkUploadFile(filepath);
	/*var formData = {
		file: fs.createReadStream(filepath)
	};
	var _options = {
		method: 'POST',
		uri: 'http://198.9.6.44:8080/MdjEducation/teacher/import/getFileList.do',
		qs: {
			guid: '***',
			rand: 1,
			time: 1,
			platform: 'server'
		},
		formData: formData
	}
	request(_options)
		.then(function(res) {
			var _body = JSON.parse(res.body);
			if(!_body.errno) {
				var resinfo = JSON.parse(res.body);
				console.log(resinfo);
				if(resinfo.state == "200") {
					var fs = require('fs');
					fs.unlinkSync("C:/screenCap/" + resinfo.fileRealName, function(err) {
						if(err) throw err;
					});
				}
				//writeJson(tmp_fileName, resinfo.data.url);
			}
		})
		.catch(function(err) {
			console.log(err)
		})*/
}

export {
	startRecord,
	stopRecord,
	uploadScreenCap,

}