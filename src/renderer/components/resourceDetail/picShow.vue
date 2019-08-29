<template>
  <div class="wrapper">
    <div class="resouceBg">
      <span class="closefullscreen fr" @click="closeimgtc">
        <em class="iconfont icon-guanbi1 exitResTc"></em>
      </span>
      <div class="imgZoom">
        <button type="button" class="iconfont icon-fangda" @click="imgChange('big')"></button>
        <button type="button" class="iconfont icon-suoxiao1" @click="imgChange('small')"></button>
        <button type="button" class="iconfont icon-xuanzhuan" @click="revolve"></button>
        <button type="button" class="iconfont icon-xiangzuo" @click="displacement('left')"></button>
        <button type="button" class="iconfont icon-xiangyou" @click="displacement('right')"></button>
        <button type="button" class="iconfont icon-xiangshang" @click="displacement('top')"></button>
        <button type="button" class="iconfont icon-xiangxia" @click="displacement('bottom')"></button>
      </div>
      <div class="contentBox  clearfix imgTransform" style="text-align:center;"> 
        <img class="imgshowtc" :src="imgsrc" alt="" id="imgshowtc"/> 
      </div>
    </div>
    <div class="commonTitle" ref="commonTitle">
       
    </div>
  </div>
</template>

<script>
  import $ from 'jquery';
  export default {
    name: "picShow",
    data() {
      return {
        imgZoomRate: 1, //图片缩放比率
        crosswise: 0,    //左右移动
        lengthways: 0,   //上下移动
        imgRevolve: 1,   //图片旋转
        imgsrc:'',  //地址
        resourceId:''
        
      }
    },
    sockets:{
			closeimgtc(){
				this.closeimgtc();
			},
			imgZoom(){
				this.imgChange(data[0]);
			},
			imgMove(){
				this.displacement(data[0]);
			},
			imgRotate(){
				this.revolve();
			}
		},
    methods: {
      getRouterData() {
        this.imgsrc = this.$route.params.imgsrc;
        this.resourceId = this.$route.params.resourceId;
      },
      error:function(){
        const that=this;
        this.$refs.commonTitle.innerHTML="图片加载失败...";
        this.$refs.commonTitle.style.display="block";
        setTimeout(function(){
          that.$refs.commonTitle.style.display="none";
        },1000);
      },
      imgChange (num) { //缩放图片
        if (num == "big") {
          this.imgZoomRate += 0.2;
        } else if (num == "small" && this.imgZoomRate >= 0.4) {
          this.imgZoomRate += -0.2;
        };
        $(".imgTransform").css("transform", 'scale(' + this.imgZoomRate + ')');
      },
      displacement (direction){
        if (direction == "left") {
          this.crosswise += -40;
        } else if (direction == "right") {
          this.crosswise += 40;
        } else if (direction == "top") {
          this.lengthways += -40;
        } else if (direction == "bottom") {
          this.lengthways += 40;
        };
        $("#imgshowtc").css("margin-left", this.crosswise + "px");
        $("#imgshowtc").css("margin-top", this.lengthways + "px");
      },
      revolve(){
        var rotatenum = 90 * this.imgRevolve + 'deg';
        this.imgRevolve++
        $("#imgshowtc").css("transform", 'rotate(' + rotatenum + ')');
      },
      closeimgtc () {
      	this.$router.back();
        sessionStorage.removeItem("resourceImgId");
        sessionStorage.removeItem("resourceImgUrl");
      },
      min(){
        sessionStorage.setItem("resourceImgId",this.resourceId);
        sessionStorage.setItem("resourceImgUrl",this.imgsrc);
        $(this.$parent.$refs.indexItem).append("<li id='imgMax'><div><i class='iconfont icon-quanping'></i><p>img</p></div></li>");
        this.$router.push({"name":"Resourceslist"});
      }
    },
    created() {
      this.getRouterData();
    },
    mounted() {
      var newImg = new Image()
      newImg.src = this.$route.params.imgsrc;
      newImg.onload = () => { // 图片加载成功执行
        this.imgsrc = newImg.src;
        var imgwidth = newImg.width;
        var imgheight = newImg.height;
        if (imgwidth > imgheight) { //横着的图
          if (imgwidth < 1300) {
            $(".imgshowtc").css({
              "width": imgwidth,
              "height": ""
            })
          } else {
            $(".imgshowtc").css({
              "width": "100%",
              "height": "calc(100% - 96px);"
            })
          }
        } else if (imgwidth <= imgheight) { //竖着的图
          if (imgheight < 768) {
            $(".imgshowtc").css({
              "height": imgheight - 100,
              "width": ""
            })
          } else {
            var PcHeight = document.body.clientHeight - 100;
            $(".imgshowtc").css({
              "height": PcHeight,
              "width": ""
            })
          }
        }
      }
    }
  }
</script>

<style scoped>
  .resouceBg{
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 100%;
    height: 100%;
    background: rgb(82, 86, 89) !important;
    border: .1rem solid rgba(18, 18, 18, 0.3);
    box-shadow: .1rem .1rem 1rem #0003;
    overflow: hidden;
    box-sizing: border-box;
    z-index: 2;
  }
  .contentBox img{
    margin-top: 2rem;
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
    z-index: 1;
  }
  .exitResTc {
    font-size: 3rem !important;
    opacity: 1;
    cursor: pointer;
  }
  .minimizeResources {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 3rem;
    height: 2.6rem;
    padding-top:.4rem;
    display: inline-block;
    background: #fff;
    border-radius: .3rem;
    box-shadow: -1px 1px 20px 4px #1296db;
    border: 0;
    z-index: 1;
    cursor: pointer;
  }
  .minimizeResources>em {
    font-size: 3rem;
    color: #1296db;
  }
  .imgZoom {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 3rem;
    text-align: center;
    background: rgb(82, 86, 89);
    z-index: 2;
    width: 35rem;
    margin: auto;
  }
  
  .imgZoom button {
    width: 4rem;
    height: 2rem;
    line-height: 2.3rem;
    font-size: 1.6rem;
    margin-top: 0.5rem;
    margin-left: 0.5rem;
    color: #535353;
    border-radius: 0.2rem;
    border: none;
    outline: none;
    cursor: pointer;
  }
</style>