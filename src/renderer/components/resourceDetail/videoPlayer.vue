<template>
  <div class="wrapper">
    <div id="video-div">
        <video :src="videoUrl" id="my-video" preload="metadata">
        </video>
        <div class="play-one"></div>
        <div class="yinyin yinyin-on">
            <div class="play-footer">
                <div class="progress">
                    <span class="timeBar"></span>
                </div>
                <div class="play-btn stop"></div>
                <div class="time">
                    <span id="currentTime">00:00</span>
                    <span>/</span>
                    <span id="duration">00:00</span>
                </div>
                <div class="right-bottom">
                    <div class="bottom all"></div>
                    <div class="bottom loop" id="loop"></div>
                    <div class="bottom set">
                        <div class="set-list">
                            <div class="play-speed">播放速度</div>
                            <div class="play-speed-list">
                                <span id="speed05Btn">X0.5</span>
                                <span class="moren" id="speed1Btn">X1</span>
                                <span id="speed2Btn">X2</span>
                            </div>
                        </div>
                        <div class="konge1"></div>
                    </div>
                    <div class="bottom huazhi">自动</div>
                    <div class="bottom sound" id="soundBtn">
                        <div class="sound-list">
                            <div class="sound-number">90</div>
                            <div class="volume">
                                <span class="volumeBar"></span>
                            </div>
                        </div>
                        <div class="konge"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <span class="closefullscreen fr" @click="closeVideotc">
      <em class="iconfont icon-guanbi1 exitResTc"></em>
    </span>
  </div>
</template>

<script>
import $ from "jquery";  
export default {
  name: 'videoPlayer',
  data () {
    return {
      arrVideo: this.$route.params.arrVideo, //视频地址
      arrAudio: this.$route.params.arrAudio, //音频地址
      videoUrl:'' //地址
    }
  },
  methods:{
    closeVideotc () {
      this.$router.push({"name": "Resourceslist"});
    },
    getRouterData() {
      if(this.arrVideo){
        this.videoUrl = this.configure.videoPlay + this.arrVideo;
      }else{
        this.videoUrl = this.configure.videoPlay + this.arrAudio;
      }
    }
  },
  mounted: function(){
    var video = $("#my-video");
    var loop = 0;
    var qieh = 1;
    var loopture = 0;
    var videoIndex = 10;
    var ddd = document.getElementById('video-div');
    var full = false;
    var timer;
    var hidding = false;
    var isFull = true;
    var videoList = $('.player-list-video').length;
    var videoSpeed = 1;
    //播放列表切换
    function qiehuan(){
        video.prop("src",'source/' + videoIndex +'.mp4');
        video.prop("poster",'source/' + videoIndex + '.jpg');
        $('.timeBar').css('width', 0);
        video[0].play();
        $('.play-btn').removeClass('stop').addClass('play');
        $('.play-one').hide();
    }
    $('.player-list-video').on('click', function () {
        if (!full || !hidding){
            videoIndex = $(this).index();
            for(var i =0; i < videoList; i++){
                $('.player-list-video').eq(i).removeClass('video-now');
            }
            $(this).addClass('video-now');
            qiehuan();
            qieh = 0;
        }
    });
    // 读取初始时间
    function timeFormat(seconds) {
        var minite = Math.floor(seconds / 60);
        if(minite < 10) {
            minite = "0" + minite;
        }
        var second = Math.floor(seconds % 60);
        if(second < 10) {
            second = "0" + second;
        }
        return minite + ":" + second;
    }
    //更新时间进度条
    function updateProgress(x){
        if (!full || !hidding){
            var progress = $('.progress');
            var position = x - progress.offset().left;
            var percentage = 100 * position / progress.width();
            if(percentage > 100) {
                percentage = 100;
            }
            if(percentage < 0) {
                percentage = 0;
            }
            $('.timeBar').css('width', percentage+'%');
            video[0].currentTime = video[0].duration * percentage / 100;
        }
    }
    // 拖拽时间进度条
    function enableProgressDrag() {
        if (!full || !hidding){
            var progressDrag = false;
            $('.progress').on('mousedown', function(e) {
                progressDrag = true;
                updateProgress(e.pageX);
            });
            $(document).on('mouseup', function(e) {
                if(progressDrag) {
                    progressDrag = false;
                    updateProgress(e.pageX);
                }
            });
            $(document).on('mousemove', function(e) {
                if(progressDrag) {
                    updateProgress(e.pageX);
                }
            });
        }
    };
    // 控制栏展示消失
    function showControl(shouldShow) {
        if(shouldShow) {
            $('.yinyin').removeClass('yinyin-off').addClass('yinyin-on');
            $('.player-list').removeClass('player-list-off').addClass('player-list-on');
        } else {
            $('.yinyin').removeClass('yinyin-on').addClass('yinyin-off');
            $('.player-list').removeClass('player-list-on').addClass('player-list-off');
        }
    }
    function fillShow() {
        if (full){
            if(hidding){
                hidding = false;
                return;
            }
            if (timer) {
                clearTimeout(timer);
                timer = 0;
            }
            $('.yinyin').removeClass('yinyin-off').addClass('yinyin-on');
            $('.player-list').removeClass('player-list-off').addClass('player-list-on');
            timer = setTimeout(function () {
                hidding = true;
                $('.yinyin').removeClass('yinyin-on').addClass('yinyin-off');
                $('.player-list').removeClass('player-list-on').addClass('player-list-off');
            }, 2000)
        }
    }
    //声音按钮
    var soundAndMute = function() {
        if (!full || !hidding){
            if(video[0].muted) {
                video[0].muted = false;
                $('#soundBtn').removeClass("jinyin").addClass("sound");
                $('.volumeBar').css('height', (1 - video[0].volume) * 100 + '%');
                $('.sound-number').text(parseInt(video[0].volume * 100));
            } else {
                video[0].muted = true;
                $('#soundBtn').removeClass("sound").addClass("jinyin");
                $('.sound-number').text(0);
                $('.volumeBar').css({
                    "height": "50px",
                })
            }
        }
    };
    //声音拖拽
    function enableSoundDrag() {
        if (!full || !hidding){
            var volumeDrag = false;
            $('.volume').on('mousedown', function(e) {
                volumeDrag = true;
                updateVolume(e.pageY);
                video[0].muted = false;
                $('#soundBtn').removeClass("jinyin").addClass("sound");
            });
            $(document).on('mouseup', function(e) {
                if(volumeDrag) {
                    volumeDrag = false;
                    updateVolume(e.pageY);
                }
            });
            $(document).on('mousemove', function(e) {
                if(volumeDrag) {
                    updateVolume(e.pageY);
                }
            });
        }
    };
    // 更新声音
    function updateVolume(y, vol) {
        if (!full || !hidding){
            var volume = $('.volume');
            var soundTop = y - volume.offset().top;
            var percentage;
            if(vol) {
                percentage =100- (vol * 100);
            } else {
                var position = soundTop;
                percentage = 100 * position / 50;
            }
            if(percentage > 100) {
                $('#soundBtn').removeClass("sound").addClass("jinyin");
                percentage = 100;
            } else {
                $('#soundBtn').removeClass("jinyin").addClass("sound");
            }
            if(percentage < 0) {
                percentage = 0;
            }
            percentage = parseInt(percentage);
            $('.sound-number').text(100 -percentage);
            $('.volumeBar').css('height', percentage + '%');
            video[0].volume = (100 - percentage) / 100;
        }
    };
    //开始暂停
    function playAndPause() {
            if(video[0].paused || video[0].ended) {
                video[0].play();
                $('.play-btn').removeClass('stop').addClass('play');
                $('.play-one').hide();
                playSpeed(videoSpeed);
            }
            else {
                video[0].pause();
                $('.play-btn').removeClass('play').addClass('stop');
                $('.play-one').show();
            }
    }
    //播放速度
    function playSpeed(speed) {
        if (!full || !hidding){
            if(speed == 1) {
                $('#speed05Btn').removeClass("moren");
                $('#speed2Btn').removeClass("moren");
                $('#speed1Btn').addClass("moren");
                videoSpeed = 1;
            } else if(speed == 2) {
                $('#speed05Btn').removeClass("moren");
                $('#speed1Btn').removeClass("moren");
                $('#speed2Btn').addClass("moren");
                videoSpeed = 2;
            } else if(speed == 0.5) {
                $('#speed1Btn').removeClass("moren");
                $('#speed2Btn').removeClass("moren");
                $('#speed05Btn').addClass("moren");
                videoSpeed = 0.5;
            }
            video[0].playbackRate = speed;
        }
    }
    //循环播放
    function isloop() {
        if (!full || !hidding){
            if(loop == 0){
                $('#loop').removeClass('loop').addClass('loop-ture');
                video[0].loop = true;
                loop = 1;
            } else if(loop == 1){
                $('#loop').removeClass('loop-ture').addClass('loop');
                video[0].loop = false;
                loop = 0;
            }
        }
    }
    //全屏
    function launchFullScreen() {
        if (!full || !hidding){
            var element = document.documentElement;
            if (isFull){
                if(element.requestFullScreen) {
                    ddd.requestFullScreen();
                } else if(element.mozRequestFullScreen) {
                    ddd.mozRequestFullScreen();
                } else if(element.webkitRequestFullScreen) {
                    ddd.webkitRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    ddd.msRequestFullscreen();
                }
            }else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
                else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
                else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                }
                else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                }
            }
        }
    }
    //监听退出全屏事件
    document.addEventListener("fullscreenchange", function(e) {
        isFull = !isFull;
        full = !full;
        if (!full){
            clearTimeout(timer);
            $('.yinyin').removeClass('yinyin-off').addClass('yinyin-on');
            $('.player-list').removeClass('player-list-off').addClass('player-list-on');
        }
    });
    document.addEventListener("mozfullscreenchange", function(e) {
        isFull = !isFull;
        full = !full;
        if (!full){
            clearTimeout(timer);
            $('.yinyin').removeClass('yinyin-off').addClass('yinyin-on');
            $('.player-list').removeClass('player-list-off').addClass('player-list-on');
        }
    });
    document.addEventListener("webkitfullscreenchange", function(e) {
        isFull = !isFull;
        full = !full;
        if (!full){
            $('#video-div').css({
                "width": 800 + "px",
                "height": 450 + "px",
            });
            clearTimeout(timer);
            $('.yinyin').removeClass('yinyin-off').addClass('yinyin-on');
            $('.player-list').removeClass('player-list-off').addClass('player-list-on'); //处理不支持div
        }                                                                                //全屏带动video
        if ($('#my-video').width() == 800 && full){                                      //的情况
            $('#video-div').css({
                "width": window.screen.availWidth + "px",
                "height": window.screen.availHeight + "px",
            })
        }
    });
    document.addEventListener("MSFullscreenChange", function(e) {
        isFull = !isFull;
        full = !full;
        if (!full){
            $('#video-div').css({
                "width": 800 + "px",
                "height": 450 + "px",
            });
            clearTimeout(timer);
            $('.yinyin').removeClass('yinyin-off').addClass('yinyin-on');
            $('.player-list').removeClass('player-list-off').addClass('player-list-on');
        }
        if ($('#my-video').width() == 800 && full){
            $('#video-div').css({
                "width": window.screen.availWidth + "px",
                "height": window.screen.availHeight + "px",
            })
        }
    });
    updateVolume(0, 0.9);  // 初始化声音
    video.on("loadedmetadata", function(){
        if (qieh == 0){
            qiehuan();
            qieh = 1;
        }
        $('header').hover(function() {
            showControl(true);
        }, function() {
            showControl(false);
        });
        $('body').on('mousedown', function (e) {
            e.preventDefault();
        }).on('mousemove', function () {
            fillShow();
        })
        $('.play-one').on('click', function () {
            playAndPause();
        });
        $('.play-btn').on('click', function () {
            if (!full || !hidding){
                playAndPause();
            }
        });
        $('.all').on('click', launchFullScreen);
        $('#currentTime').text(timeFormat(0));
        $('#duration').text(timeFormat(video[0].duration));
        enableProgressDrag();
        enableSoundDrag();
        playSpeed(videoSpeed);
        $('#speed1Btn').on('click', function() {
            playSpeed(1);
        });
        $('#speed2Btn').on('click', function() {
            playSpeed(2);
        });
        $('#speed05Btn').on('click', function() {
            playSpeed(0.5);
        });
        //  阻止事件冒泡
        $('.sound-list').bind("click",function(event){
            event.stopPropagation();
        });
        $('.konge').bind("click",function(event){
            event.stopPropagation();
        });
        $('#soundBtn').on('click',soundAndMute);
        $(window).keypress(function(e) {
            if (e.keyCode == 0 || e.keyCode == 32) {
                playAndPause();
            }
        });
        $('#loop').on('click', isloop);
    })
    video.on('timeupdate', function() {
        var currentTime = video[0].currentTime;
        var duration = video[0].duration;
        var percent = 100 * currentTime / duration;
        $('.timeBar').css('width', percent + '%');
        $('#currentTime').text(timeFormat(currentTime));
    });
    video.on('canplay', function() {
        $('.loading').fadeOut(100);
    });
    video.on('ended', function() {
        $('.play-btn').removeClass("play").addClass("stop"); // 列表切换
        if(loopture == 0){
            videoIndex += 1;
            if(videoIndex == videoList){
                videoIndex = 0;
            }
            for(var i =0; i < videoList; i++){
                $('.player-list-video').eq(i).removeClass('video-now');
            }
            $('.player-list-video').eq(videoIndex).addClass('video-now');
            qiehuan();
            qieh = 0;
        }
    });
  },
  created() {
    this.getRouterData()
  }
}
</script>

<style scoped>
  .wrapper{
    position: relative;
    width: 100%;
    height: 100%;
    background:#000;
    z-index: 2;
  }
  #video-div{
      position: relative;
      margin: 0 auto;
      width: 100%;
      height: 100%;
      z-index: 2;
  }
  video{
      width: 100%;
      height: 100%;
  }
  .play-one{
      width: 70px;
      height: 70px;
      background: url("../../assets/img/player/playone.png") no-repeat;
      opacity: .7;
      background-size:cover;
      position: absolute;
      bottom: 70px;
      right: 60px;
      cursor: pointer;
  }
  .play-footer{
      position: absolute;
      width: 100%;
      height: 36px;
      bottom: 0;
  }
  .yinyin{
      position: absolute;
      height: 80px;
      width: 100%;
      background: blue;
      bottom: 0;
      background:linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0.3));
      transition: opacity .3s;
  }
  .yinyin-on{
      opacity: 1;
  }
  .yinyin-off{
      opacity: 0;
  }
  .play-footer .play-btn{
      width: 23px;
      height: 23px;
      float: left;
      margin-left: 3%;
      cursor: pointer;
      z-index: 3;
  }
  .stop{
      background: url("../../assets/img/player/stop.png") no-repeat;
      background-size:cover;
  }
  .play{
      background: url("../../assets/img/player/play.png") no-repeat;
      background-size:cover;
  }
  
  .time{
      float: left;
      font-size: 15px;
      line-height: 23px;
      color: white;
      margin-left: 10px;
      z-index: 2;
  }
  .right-bottom{
      float: right;
      margin-right: 3%;
      z-index: 4;
  }
  .bottom{
      width: 23px;
      height: 23px;
      float: right;
      margin-left: 20px;
      cursor: pointer;
  }
  .all{
       background: url("../../assets/img/player/all.png") no-repeat;
       background-size:cover;
  }
  .loop{
      background: url("../../assets/img/player/loop.png") no-repeat;
      background-size:cover;
  }
  .loop-ture{
      background: url("../../assets/img/player/1loop.png");
      background-size:cover;
  }
  .set{
      position: relative;
      background: url("../../assets/img/player/set.png") no-repeat;
      background-size:cover;
  }
  .set-list{
      display: none;
      background: black;
      width: 200px;
      height: 200px;
      position: absolute;
      bottom: 40px;
      left: -85px;
      opacity: .7;
      border-radius: 4px;
  }
  .konge1{
      display: none;
      position: absolute;
      width: 200px;
      height: 17px;
      bottom: 23px;
      left: -85px;
      text-align: center;
      z-index: 4;
  }
  .set:hover .set-list,
  .set:hover .konge1{
      display: block;
  }
  .play-speed{
      color: white;
      font-weight: bolder;
      width: 100%;
      height: 30px;
      line-height: 30px;
      font-size: 20px;
      text-align: center;
  }
  .play-speed-list{
      padding-top: 5px;
      font-weight: bolder;
      font-size: 17px;
      color: azure;
      text-align: center;
  }
  .play-speed-list span{
      margin-left: 15px;
      margin-right: 15px;
  }
  .play-speed-list span:hover{
      color: #7969ff;
  }
  .moren{
      color: #7969ff;
  }
  .huazhi{
      width: 50px;
      font-size: 15px;
      line-height: 23px;
      color: white;
  }
  .sound{
      position: relative;
      background: url("../../assets/img/player/sound.png") no-repeat;
      background-size:cover;
  }
  .jinyin{
      position: relative;
      background: url("../../assets/img/player/jinyin.png") no-repeat;
      background-size:cover;
  }
  .progress{
      width: 95%;
      background: white;
      height: 2px;
      position: absolute;
      bottom: 50px;
      left: 2.5%;
      cursor: pointer;
      transition: bottom 0.1s;
      border-radius: 3px;
  }
  .progress:hover{
      height: 6px;
      bottom: 48px;
  }
  .progress .timeBar {
      height: 100%;
      position: absolute;
      top: 0;
      display: block;
      z-index: 2;
      width: 0;
      background: #F9D43A;
      border-radius:3px;
  }
  #soundBtn:hover .sound-list,
  #soundBtn:hover .konge{
       display: block;
  }
  .sound-list{
      display: none;
      position: absolute;
      width: 30px;
      height: 85px;
      bottom: 40px;
      left: -6px;
      text-align: center;
      background: black;
      border-radius: 3px;
  }
  .konge{
      display: none;
      position: absolute;
      width: 30px;
      height: 17px;
      bottom: 23px;
      left: -6px;
      text-align: center;
      z-index: 4;
  }
  .sound-number{
      position: relative;
      width: 100%;
      text-align: center;
      height: 20px;
      padding-top:5px;
      line-height: 20px;
      font-size: 15px;
      color: white;
  }
  .volume{
      position: relative;
      margin: auto;
      margin-top: 5px;
      width: 7px;
      height: 50px;
      background: aqua;
      border-radius: 2px;
      overflow: hidden;
  }
  .volumeBar {
      display: block;
      width: 100%;
      height: 40px;
      position: absolute;
      background-color: white;
      z-index: 2;
  }
  .player-list{
      position: absolute;
      padding-left: 10px;
      width: 30px;
      height: 60px;
      top: 50%;
      margin-top: -30px;
      background: url("../../assets/img/player/list.png") -10px 0px rgba(0,0,0,.1);
      background-size: cover;
      transition: opacity .3s;
  }
  .player-list-on{
      opacity: 1;
  }
  .player-list-off{
      opacity: 0;
  }
  .player-list-bk{
      display: none;
      position: absolute;
      width: 160px;
      height: 250px;
      top: 50%;
      margin-top: -150px;
      background: rgba(0,0,0,.3);
  }
  .player-list:hover{
      background: none;
  }
  .player-list:hover .player-list-bk{
      display: block;
  }
  .player-list-head{
      width: 100%;
      height: 30px;
      text-align: center;
      line-height: 30px;
      font-size: 25px;
      color: white;
      background: #7c7d7f;
  }
  .player-list-cotent{
      height: 220px;
      width: 160px;
      overflow: hidden;
  }
  .player-list-box{
      height: 220px;
      width: 195px;
      text-align: center;
      overflow: auto;
  }
  .player-list-video{
      padding-top: 5px;
      margin-left: -17px;
      width: 100%;
      height: 20px;
      text-align: center;
      line-height: 15px;
      font-size: 16px;
      color: #00F7DE;
      cursor: pointer;
      font-weight: bolder;
      border-bottom: 1px #60bff2 dashed;
      transition: all .2s;
  }
  .player-list-video:hover{
      height: 25px;
      font-size: 18px;
      line-height: 20px;
  }
  .video-now,
  .video-now:hover{
      height: 30px;
      font-size: 20px;
      line-height: 25px;
      background: rgba(139,288,255,.3);
      color: #6956ff;
  }
  footer{
      width: 100%;
      height: 30px;
      text-align: center;
      color: darkcyan;
      font-size: 20px;
      line-height: 30px;
      top: 0;
  }
  .wrap{
      margin-top: 10px;
      font-size: 12px;
      color: #acacac;
      text-align: center;
  }
  .wrap a{
      text-decoration: none;
      display: inline-block;
      color: #aaaaaa;
      margin: 0 25px;
  }
  .closefullscreen {
    position: absolute;
    top: 5px;
    right: 0;
    width: auto;
    height: auto;
    color: #fff;
    display: inline-block;
    background: transparent;
    box-shadow: none;
    border-radius: 0;
    border: 0;
    z-index: 3;
  }
  .exitResTc {
    font-size: 3rem !important;
    opacity: 1;
    cursor: pointer;
  }
</style>