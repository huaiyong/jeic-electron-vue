<template>
  <div class="teachModel">
    <!-- 展示区域 -->
    <div class="subject" v-show="!allClassMask && !chooseGroupMask  && !lookGroupMask">
      <!-- 头部 -->
      <div class="headNav clearfix">
        <span class="fl">教学模式</span>
        <i class="fr iconfont icon-shanchu1" @click="closeModel()"></i>
      </div>
      <!-- 切换导航 -->
      <div class="subNav">
        <span @click="tabTeachModel(1)" :class="{'active':groupIndex == 1}">全班教学模式</span>
        <span @click="tabTeachModel(2)" :class="{'active':groupIndex == 2}">分组教学模式</span>
      </div>
      <!-- 主体内容 -->
      <div class="conent">
        <!-- 全班教学 -->
        <div class="allClass" v-show="$route.query.classType == 'all'">
          <img src="../../assets/img/allClass.png" alt />
          <p>全班教学模式为班级整体教学</p>
          <!-- 按钮  -->
          <div class="btn" @click="allConfirm()">确认选择</div>
        </div>

        <!-- 分组教学 -->
        <div class="groupClass"  v-show="$route.query.classType == 'group'">
          <div class="addGroup" @click="addGroup()"  v-show="groupTeachData.length == 0">
            <i class="iconfont icon-jiahao"></i>
            <p>添加分组</p>
          </div>
          <div class="groupList" v-show="groupTeachData.length != 0">
              <ul>
                <li class="clearfix" v-for="item,index in groupTeachData" :key='index' :class="{'active':tabIndex == index }" @click="tabList(index)">
                  <div class="fl listLeft">
                    <em>{{item.name}}</em>
                    <span :class="[{ blue : item.type =='2' },{ orange : item.type =='1' }]">
                      {{item.type=='1'?'临时组':'固定组'}}
                    </span>
                  </div>
                  <div class="fr listRight">
                    <i class="iconfont icon-chakan" @click="lookGroup(index)"></i>
                    <i class="iconfont icon-bianji" @click="editGroup(index)"></i>
                    <i class="iconfont icon-shanchu2" @click="deleteGroup(index)"></i>
                  </div>
                </li>
              </ul>
              <div class="smallAdd" @click="addGroup()"><i class="iconfont icon-jiahao"></i></div>
              <div class="btn" @click="groupConfirm()">确认选择</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 弹层区域 -->
    <div class="maskBox">
      <!-- 全班教学弹层 -->
      <div class="allClassMask mask" v-if="allClassMask">
        <i class="iconfont icon-qiehuan"></i>
        <p>{{msg}}</p>
      </div>

      <!-- 选择组别弹层 -->
      <div class="chooseGroup mask" v-if="chooseGroupMask">
        <div class="head">
          <i class="iconfont icon-fanhui" @click="backIndex()"></i>
          <span>选择组别</span>
        </div>
        <ul class="groupBox clearfix">
          <router-link tag='li' :to="{path:'/foundGroup',query:{info:'1',type:'newBuilt'}}">
            <span><i class="iconfont icon-linshizu"></i></span>
            <strong>临时组</strong>
            <p>此分组为课中临时分化小组下课后分组自动消失</p>
          </router-link>
          <router-link tag='li'  :to="{path:'/foundGroup',query:{info:'2',type:'newBuilt'}}">
            <span><i class="iconfont icon-gudingzu"></i></span>
            <strong>固定组</strong>
            <p>此分组为固定分组，分组后自动保存可随时调用修改</p>
          </router-link>
        </ul>
      </div>

      <!-- 查看分组弹层 -->
      <div class="lookGroup mask" v-show="lookGroupMask">
        <div class="head clearfix">
          <div class="fl">
            <i class="iconfont icon-fanhui" @click="lookGroupClose()"></i>
            <span>{{groupTitle}}</span>
          </div>
          <i class="fr iconfont icon-shanchu1" @click="lookGroupClose()"></i>
        </div>
        <ul class="branchList">
          <li class="line" v-for="(item,index) in lookGroupData" :key='index'>
              <h3 class="title">{{item.name}}</h3>
              <div class="clearfix" >
                <div class="fl lineLeft">
                    <img :src='"../../assets/img/"+ getImgUrl(item.groupLeader.sex) +".png"' alt="">
                    <p>{{item.groupLeader.name}}</p>
                </div>
                <ul class="clearfix fr lineRight" >
                    <li class="fl" v-for="(ele,i) in item.studentList" :key='i'>
                      <img :src='"../../assets/img/"+ getImgUrl(ele.sex) +".png"' alt="">
                      <p>{{ele.name}}</p>
                    </li>
                </ul>
              </div>
          </li>
        </ul>
      </div>

      <!-- 删除分组弹层 -->
      <div class="deleteGroup" v-show="deleteGroupMask">
        <div class="hide"></div>
        <div class="con mask">
            <p>删除当前分组</p>
            <div class="btns">
              <span @click="cancel()">取消</span>
              <span @click="sure(deleGroupIndex)">确认</span>
            </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "teachModel",
  data() {
    return {
      groupIndex:1,                 //分组和全班教学模式的索引
      groupTitle:'',                   //分组弹层的组title
      groupTeachData:[],               // 分组教学列表数据
      lookGroupData : [],             // 查看组的数据
      tabIndex:-1,                  // 分组列表切换索引
      allClassMask: false,        // 添加分组弹层
      chooseGroupMask: false,    // 选择分组弹层
      lookGroupMask: false,     // 查看分组弹层
      deleteGroupMask:false,   // 删除分组
      deleGroupIndex:-1,       //删除分组列条的索引
      msg:'',                  //分组或全班弹层文字提示
    };
  },
  //created函数中调用ajax获取页面初始化所需的数据
  created() {
    this.groupList();
  },
  sockets: {
    closeTeacheModel(){
      this.closeModel();
    },
    teacheModelType(type){
      this.tabTeachModel(type);
    },
    sureTeacheModelAll(){
      this.allConfirm();
    },
    sureTeacheModelGroup(){
      this.groupConfirm();
    },
    selectedTeacheModel(index){
      this.tabList(index);
    },
    lookTeacheModel(index){
      this.lookGroup(index)
    },
    teacheModelBack(){
      this.lookGroupClose();
    },
    deleteTeacheModel(index){
      this.deleteGroup(index);
    },
    deleteCanCel(){
      this.cancel();
    },
    deleteConfirm(index){
      this.sure(index);
      console.log(index)
    }
  },
  methods: {
    // 分组列表接口
    groupList(){
      const that = this;
      // 分组列表接口
      this.$http.get('http://127.0.0.1:3000/jeic/api/teachingGroup?classId=' +  this.$store.state.state.classId + '&subjectId=' + this.$store.state.state.subjectId).then(function(data){
        that.groupTeachData = data.data.data;
      });
    },
    // 获取img地址
    getImgUrl(obj){
      return obj == '男'?'boy':'girl'
    },
    // 分组和全班教学模式的切换
    tabTeachModel(i){
      if(i==1){
        this.groupIndex = 1;
        this.$router.push({
          path:'/teachModel',
          query:{
            classType:'all'
          }
        })
      }else if(i==2){
        this.groupIndex = 2;
        this.$router.push({
          path:'/teachModel',
          query:{
            classType:'group'
          }
        })
      }
    },
    // 关闭按钮
    closeModel() {
      this.$router.push({
        name: "Index"
      });
    },
    // 添加分组按钮
    addGroup() {
      this.chooseGroupMask = true;
    },
    // 选择组别的返回按钮
    backIndex() {
      this.chooseGroupMask = false;
    },
    // 全班教学 --- 确认选择
    allConfirm() {
      this.allClassMask = true;
      this.msg = '切换为全班教学';
      setTimeout(() => {
        this.allClassMask = false;
        this.$router.push({
          name: "Index"
        });
      }, 1000);
      this.$store.dispatch("getPattern",true);
      console.log(this.$store.state.state.pattern)
    },
    // 分组教学 --- 确认选择
    groupConfirm(){
      if(this.tabIndex != -1){
        this.allClassMask = true;
        this.msg = '切换为分组教学';
        setTimeout(() => {
          this.allClassMask = false;
          this.$router.push({
            name: "Index"
          });
        }, 1000);
        this.$store.dispatch("getPattern",false);
        this.$store.dispatch("getGroupId",this.groupTeachData[this.tabIndex].id);
        console.log(this.$store.state.state.pattern)
        console.log(this.groupTeachData[this.tabIndex].id)
      }else{
        this.allClassMask = true;
        this.msg = '请先选择分组';
        setTimeout(() => {
          this.allClassMask = false;
        }, 1000);
      }
    },
    //分组教学 --- 切换选择分组列表
    tabList(i){
      this.tabIndex = i ;
      this.groupTitle = this.groupTeachData[i].name;
    },
    // 分组教学 --- 查看分组按钮
    lookGroup(i){
      this.lookGroupMask = true;
      const that = this;
      this.$http.get('http://127.0.0.1:3000/jeic/api/teachingGroup/'+ this.groupTeachData[i].id).then(function(data){
        that.lookGroupData = data.data.data.userGrouplist;
      });
    },
    // 分组教学 --- 关闭 和 返回 查看分组弹层
    lookGroupClose(){
      this.lookGroupMask = false;
      this.$router.push({
        path:'/teachModel',
        query:{
          classType:'group'
        }
      })
    },
    // 分组教学 ---编辑查看按钮
    editGroup(i){
      this.$router.push({
        path:'/foundGroup',
        query:{
          info:this.groupTeachData[i].type,
          type:'edit',
          Id:this.groupTeachData[i].id
        }
      });
    },
    // 分组教学 ---删除按钮
    deleteGroup(i){
      this.deleteGroupMask = true;
      this.deleGroupIndex = i ;
    },
    // 分组教学 --- 删除的取消
    cancel(){
      this.deleteGroupMask = false;
    },
    // 分组教学 --- 删除的确认
    sure(i){
      let that = this;
      this.$http.delete('http://127.0.0.1:3000/jeic/api/teachingGroup/'+ this.groupTeachData[i].id).then(function(data){
        // 重新调用分组列表接口
        that.$http.get('http://127.0.0.1:3000/jeic/api/teachingGroup?classId=' +  that.$store.state.state.classId + '&subjectId=' + that.$store.state.state.subjectId).then(function(data){
          that.groupTeachData = data.data.data;
        });
      });
      this.deleteGroupMask = false;
    }
  }
};
</script>

<style>
.subject{width: 80rem; height: 42rem; border-radius: 6rem; position: fixed; top: 0; left: 0; bottom: 5.25rem; right: 0; margin: auto;color: #333333;}
.subject .headNav{width: 100%; height: 5.875rem; line-height: 5.875rem; background: -webkit-gradient( linear, 0% 0%, 0% 100%, from(#e8e6e7), to(#d2d0d3), color-stop(0.5, #dbd9dc) ); border-top-left-radius: .6rem; border-top-right-radius: .6rem;}
.subject .headNav span{margin-left: 3rem; width: 8.33333rem; height: 3.2291rem; line-height: 3.2291rem; border: .1rem solid #acacac; border-radius: 5px; font-size: 1.6rem; text-align: center; background: #fff; margin-top: 1.4rem;}
.subject .headNav i,.maskBox .lookGroup .head i.icon-shanchu1{margin-right: 3.3rem; font-size: 3rem; margin-top: 5px; color: #d61e06; cursor: pointer;}

.subject .subNav{width: 100%; height: 5.9375rem; line-height: 5.9375rem; border-bottom: .1rem solid #cecece; background: #888;}
.subject .subNav span{display: inline-block; width: 15rem; height: 3.125rem; line-height: 3.125rem; background: #ccc; text-align: center; font-size: 1.45rem; margin-top: 1.6rem; border-radius: 30px; color: #fff; margin-left: 3rem; cursor: pointer;}
.subject .subNav span.router-link-exact-active,.subject .subNav span.active{background: #4092f4;}

.subject .conent{width: 100%; height: 70%; text-align: center; margin: 0 auto; background: #898989; padding-top: 2rem; box-sizing: border-box;}
.subject .allClass{padding-bottom: 2rem; box-sizing: border-box;}
.subject .allClass img{width: 13rem; height: 13.875rem;}
.subject .allClass p{font-size: 1.45rem; margin-top: 1.25rem; color: #fff;}
.subject .btn{width: 20rem; height: 4rem; line-height: 4rem; text-align: center; background: #4092f4; color: #fff; border-radius: 40px; margin: 2rem auto; cursor: pointer; font-size: 1.6rem;}

.subject .groupClass .addGroup{width: 18.75rem; height: 15rem; font-size: 1.6rem; background: #fff; border-radius: 5px; margin: 4rem auto 0; box-shadow: 10px 10px 10px #46494a; box-sizing: border-box; padding-top: 4rem;}
.subject .groupClass i{cursor: pointer; font-size: 70px; color: #4092f4;}
.subject .groupClass .smallAdd{width: 7rem; height: 7rem; border-radius: 5px; background: #fff; box-sizing: border-box; text-align: center; padding-top: 2.2rem; margin-top: 2rem; cursor: pointer; box-shadow: 0 0 20px #46494a;}
.subject .groupClass .smallAdd i{font-size: 4rem;}
.subject .groupClass .addGroup p{cursor: pointer; margin-top: 0.8rem;}
.subject .groupClass .groupList{box-sizing: border-box; padding:0 5rem;}
.subject .groupClass .groupList{height: 27rem;overflow-y: auto;}
.subject .groupClass .groupList li{width: 100%; height: 7rem; box-shadow: 0 0 20px #46494a; background: #fff; border-radius: .5rem; margin-top: 2rem;}
.subject .groupClass .groupList li:first-child{margin-top: 0;}
.subject .groupClass .groupList li:hover{border:.2rem solid #4092f4;}
.subject .groupClass .groupList li.active{border:.2rem solid #4092f4;}
.subject .groupClass .groupList .listLeft{height: 7rem; line-height: 7rem; padding-left: 3rem;}
.subject .groupClass .groupList .listLeft em{font-size: 1.45rem;}
.subject .groupClass .groupList .listLeft span{display: inline-block; width: 5rem; height: 1.35rem; line-height: 1.35rem; text-align: center; border-radius: 5px; margin-left: 1rem; font-size: .93rem;}
.subject .groupClass .groupList .listLeft span.orange{border:.1rem solid #fe9c02; color: #fe9c02;}
.subject .groupClass .groupList .listLeft span.blue{border:.1rem solid #4092f4; color: #4092f4;}
.subject .groupClass .groupList .listRight{height: 7rem; line-height: 8rem; padding-right: 3rem;}
.subject .groupClass .groupList .listRight i{font-size: 3.5rem;margin: 0 .2rem;cursor: pointer;}

.maskBox .mask{background-color: #898989; border-radius: 10px; position: fixed; top: 0; left: 0; bottom: 5.25rem; right: 0; margin: auto;}

.maskBox .allClassMask{width: 30rem; height: 16.25rem; text-align: center; background: #fff; padding-top: 3rem; box-sizing: border-box;}
.maskBox .allClassMask i.icon-qiehuan{font-size: 6rem; color: #4092f4;}
.maskBox .allClassMask p{font-size: 1.45rem; margin-top: 1.25rem;}

.maskBox .chooseGroup,.maskBox .lookGroup{width: 70rem; height: 40rem; border-radius: .6rem;}
.maskBox .chooseGroup .head,.maskBox .lookGroup .head{width: 100%; height: 5.7812rem; line-height: 5.7812rem; background: -webkit-gradient( linear, 0% 0%, 0% 100%, from(#e8e6e7), to(#d2d0d3), color-stop(0.5, #dbd9dc) ); padding-left: 3rem; box-sizing: border-box; border-top-left-radius: .6rem; border-top-right-radius: .6rem;}
.maskBox .chooseGroup .head span ,.maskBox .lookGroup .head span{font-size: 1.45rem; height: 3.2291rem; padding:0 1rem; line-height: 3.2291rem; border: .1rem solid #acacac; border-radius: 5px; font-size: 1.6rem; text-align: center; background: #fff; margin-top: 1.4rem; display: inline-block;}
.maskBox .chooseGroup .head i,.maskBox .lookGroup .head i{font-size: 2.5rem; position: relative; top: 0.5rem; right: 0.6rem; cursor: pointer;}
.maskBox .chooseGroup .groupBox{padding-top: 4rem;}
.maskBox .chooseGroup .groupBox li{float: left; width: 24%; text-align: center; cursor: pointer; padding: 10px;}
.maskBox .chooseGroup .groupBox li:hover{border-radius: 5px; box-shadow: 0px 0px 30px #ccc; animation-name: shake-slow; animation-duration: 5s; animation-timing-function: ease-in-out; animation-iteration-count: infinite;}
.maskBox .chooseGroup .groupBox li:first-child{margin-left: 11rem; margin-right: 13rem;}
.maskBox .chooseGroup .groupBox li span{display: inline-block; width: 15.6rem; height: 15.6rem; border-radius: 50%; background: #4092f4; text-align: center; padding-top: 4.2rem; box-sizing: border-box;}
.maskBox .chooseGroup .groupBox li span i{font-size: 8rem; color: #fff;}
.maskBox .chooseGroup .groupBox li strong{font-size: 1.6rem; color: #fff; margin-top: 3rem; margin-bottom: 0.6rem; display: block;}
.maskBox .chooseGroup .groupBox li p{color: #ccc; font-size: 1.35rem; line-height: 2rem;}

.maskBox .lookGroup{width: 80rem;}
.maskBox .lookGroup .head i.icon-shanchu1{margin-top: 0px; margin-right: 2rem;}
.maskBox .lookGroup .branchList{width:100%;height:calc( 100% - 6.8rem ) ;overflow-y: auto;}
.maskBox .lookGroup .branchList li.line{box-sizing: border-box; padding: 2rem;}
.maskBox .lookGroup .branchList li.line>div{box-sizing: border-box;padding-top: 1.5rem;}
.maskBox .lookGroup .branchList li.line .title{color: #fff; font-size: 1.6rem;}
.maskBox .lookGroup .branchList li.line img{width: 7rem;height: 7rem;margin-bottom: 1rem;}
.maskBox .lookGroup .branchList li.line .lineLeft{width: 11%;height: 11rem;text-align: center;font-size: 1.45rem;color: #fff;margin-top:1rem;}
.maskBox .lookGroup .branchList li.line .lineRight{width: 86%;}
.maskBox .lookGroup .branchList li.line .lineRight li{width: 12%;height: 11rem; float: left;text-align: center; margin-left: 1.4rem;margin-top:1rem;}
.maskBox .lookGroup .branchList li.line .lineRight li p{text-align: center;font-size: 1.45rem;color: #fff;}

.maskBox .deleteGroup .hide{position: fixed; z-index: 1000; left: 0px; right: 0px; top: 0px; bottom: 0px; opacity: 0.5; background: rgba(0,0,0,1);}
.maskBox .deleteGroup .con{width: 30rem; height: 16.25rem;background-color: #FFFFFF;z-index: 1003;opacity:1;text-align: center;}
.maskBox .deleteGroup .con p{color: #333;font-size: 1.6rem;margin-top:5rem;margin-bottom: 3rem;}
.maskBox .deleteGroup .con span{display: inline-block;width:9.3rem;height: 2.7rem;line-height: 2.7rem;border-radius: 0.5rem;cursor: pointer;font-size: 1.25rem; }
.maskBox .deleteGroup .con span:first-child{border:0.1rem solid #acacac;color: #acacac;margin-right: 1.5rem;}
.maskBox .deleteGroup .con span:last-child{background: #4092f4;border:0.1rem solid #4092f4;color: #fff;}

@keyframes shake-slow{2%{transform: translate(0px, -7px) rotate(2.5deg);} 4%{transform: translate(6px, 3px) rotate(-0.5deg);} 6%{transform: translate(6px, -5px) rotate(0.5deg);} 8%{transform: translate(3px, 3px) rotate(-1.5deg);} 10%{transform: translate(-4px, 5px) rotate(1.5deg);} 12%{transform: translate(2px, 7px) rotate(2.5deg);} 14%{transform: translate(0px, 6px) rotate(-1.5deg);} 16%{transform: translate(-9px, 5px) rotate(-2.5deg);} 18%{transform: translate(4px, -8px) rotate(-0.5deg);} 20%{transform: translate(2px, 9px) rotate(3.5deg);} 22%{transform: translate(-5px, 1px) rotate(-2.5deg);} 24%{transform: translate(-2px, -8px) rotate(0.5deg);} 26%{transform: translate(4px, -2px) rotate(-0.5deg);} 28%{transform: translate(-4px, 9px) rotate(1.5deg);} 30%{transform: translate(-4px, -3px) rotate(3.5deg);} 32%{transform: translate(-2px, 6px) rotate(-2.5deg);} 34%{transform: translate(4px, -4px) rotate(-0.5deg);} 36%{transform: translate(-1px, 6px) rotate(0.5deg);} 38%{transform: translate(8px, 8px) rotate(1.5deg);} 40%{transform: translate(9px, -2px) rotate(3.5deg);} 42%{transform: translate(-2px, -9px) rotate(0.5deg);} 44%{transform: translate(-1px, 10px) rotate(-1.5deg);} 46%{transform: translate(-1px, 1px) rotate(-0.5deg);} 48%{transform: translate(6px, -8px) rotate(2.5deg);} 50%{transform: translate(-1px, -7px) rotate(-1.5deg);} 52%{transform: translate(0px, 1px) rotate(-1.5deg);} 54%{transform: translate(1px, -8px) rotate(-2.5deg);} 56%{transform: translate(-4px, 2px) rotate(1.5deg);} 58%{transform: translate(10px, -7px) rotate(-2.5deg);} 60%{transform: translate(-2px, -4px) rotate(-1.5deg);} 62%{transform: translate(-3px, 3px) rotate(1.5deg);} 64%{transform: translate(8px, 2px) rotate(-1.5deg);} 66%{transform: translate(-4px, -1px) rotate(1.5deg);} 68%{transform: translate(-1px, -2px) rotate(-1.5deg);} 70%{transform: translate(8px, 8px) rotate(0.5deg);} 72%{transform: translate(-8px, -3px) rotate(-2.5deg);} 74%{transform: translate(6px, 5px) rotate(0.5deg);} 76%{transform: translate(4px, -9px) rotate(1.5deg);} 78%{transform: translate(-2px, -6px) rotate(3.5deg);} 80%{transform: translate(1px, 0px) rotate(1.5deg);} 82%{transform: translate(-4px, 6px) rotate(-2.5deg);} 84%{transform: translate(-4px, -3px) rotate(1.5deg);} 86%{transform: translate(7px, 10px) rotate(2.5deg);} 88%{transform: translate(-3px, -2px) rotate(1.5deg);} 90%{transform: translate(8px, -3px) rotate(3.5deg);} 92%{transform: translate(0px, 3px) rotate(1.5deg);} 94%{transform: translate(5px, -5px) rotate(-2.5deg);} 96%{transform: translate(7px, -2px) rotate(-0.5deg);} 98%{transform: translate(-6px, 0px) rotate(3.5deg);} 0%, 100%{transform: translate(0, 0) rotate(0);}}

</style>
