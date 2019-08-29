<template>
  <div class="wrapper">
    <div class="resouceBg">
      <span class="closefullscreen fr" @click="closeWordtc">
        <em class="iconfont icon-guanbi1 exitResTc"></em>
      </span>
      <span class="minimizeResources" id="wordMinimize" @click="min">
        <em class="iconfont icon-zuixiaohua"></em>
      </span>
      <iframe :src="showWordsrc" id="showWordsrc"  style="width:100%;height:100%;"  frameborder="0"></iframe>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery';
  export default {
    name: "word",
    data() {
      return {
		    showWordsrc: '', //word展示路径
		    resourceId:this.$route.params.resourceId,
		    isFirstEnter: false
      }
    },
    inject: ["reload"],
    methods: {
      closeWordtc () {
        this.$router.push({"name": "Resourceslist"});
        sessionStorage.removeItem("resourcewordId");
        this.reload();
      },
      getRouterData() {
      	const that = this;
        this.$http.get(this.configure.showResourceIp + this.resourceId).then(function(res) {

        	that.showWordsrc = res.data.result.viewURL.officeView;
        })
      },
      min () {
        sessionStorage.setItem("resourcewordId",this.resourceId);
        $(this.$parent.$refs.indexItem).append("<li id='wordMax'><div><i class='iconfont icon-quanping'></i><p>word</p></div></li>");
        this.$router.push({"name":"Resourceslist"});
      }
    },
    mounted(){
		  window.addEventListener('scroll', this.handleScroll);
		},
    activated() {
      if (this.isFirstEnter) {
        this.getRouterData();
      };
      this.isFirstEnter = false;
    },
    created() {
      this.isFirstEnter = true;
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
</style>