<template>
  <div class="foundGroup">
      <div class="heads">
        <router-link tag='i' :to="{path:'/teachModel',query:{classType:'group'}}">
          <i class="iconfont icon-fanhui"></i>
        </router-link>
        <em>此次分组名称</em>
        <span contenteditable='false' @click="titleEdit()">{{groupName}}</span>
        <small>( {{this.$route.query.info=='1'?'临时组':'固定组'}} )</small>
      </div>
      <div class="mainBox clearfix">
        <!-- 左侧 -->
        <div class="mainL fl" @mouseup="mainL($event)">
          <div class="newBuild" v-for="(item,i) in newBuild" :key='i'>
            <div class="tit clearfix">
              <strong contenteditable='false' >{{item.name}}</strong>
              <span @click="Editable($event)">修改</span>
              <i class="iconfont icon-shanchuzu fr" @click="deleteNewBuiid($event,item,i)"></i>
            </div>
            <div class="groupLeader">
              <h3>组长</h3>
              <div class="leftDrag clearfix" @click.stop="leader($event,i)">
                <em class="fl" v-if=" JSON.stringify(item.groupLeader) != '{}'" >
                  <i>{{item.groupLeader.name}}</i>
                  <img src="../../assets/img/delete.png" @click.stop="deleteName($event,i)">
                </em>
              </div>
            </div>
            <div class="teamMember">
              <h3>组员</h3>
              <div class="leftDrag clearfix" @click.stop="menber($event,i)">
                <em class="fl" v-for="element,index in item.studentList" :key="index">
                  <i>{{element.name}}</i>
                  <img src="../../assets/img/delete.png" @click.stop="deleteName($event,i,index)">
                </em>
              </div>
            </div>
          </div>
          <div class="smallAdd" @click="addGroup()"><i class="iconfont icon-jiahao"></i></div>
          <div class="btn" @click="finish()">完成</div>
        </div>

        <!-- 右侧 -->
        <ul class="mainR fr">
          <li class="fl" v-for="element,index in list" :key="index" @click="rightStudent(element,index)">
            <img :src='"../../assets/img/"+ getImgUrl(element.sex) +".png"' alt="">
            <p>{{element.name}}</p>
          </li>
        </ul>

      </div>
  </div>
</template>

<script>
import $ from "jquery";
import draggable from 'vuedraggable';
import { constants } from 'fs';
export default {
  name:'foundGroup',
  data(){
    return {
      newBuild:[],     // 左侧新建数据
      ids:'',          //ID号
      addId:0,         //添加分组的组数
      list:[],         //全班的学生
      groupName:'',   //组名
      newClassData:[], //左侧同学临时汇总数组，便于与右侧同学去重
      indexNum:'',    //左侧每小组的索引
      Highlight:false, //左侧是否高亮点亮
      userInfo:'',    //是组长还是组员
      LargeArr:{},   //完成返回出去的数据
      targetObj : '', //组员和组长的目标对象，存储地
    }
  },
  //created函数中调用ajax获取页面初始化所需的数据
  created () {
    const that = this;
    // 右侧全班接口数据
    this.$http.get('http://127.0.0.1:3000/jeic/api/student?classId=' + this.$store.state.state.classId).then(function(data){
      that.list = data.data.data;
    });
    // 新建
    if(this.$route.query.type == 'newBuilt'){
      // 新建id
      that.ids = '';
      // 每小组的索引
      that.addId = 1;
      // 默认显示一组
      that.newBuild = [{
          name: that.addId +'组',
          studentList:[],  //组员
          groupLeader:{}, //组长
        }
      ];
      // 分组标题
      var myDate = new Date();
      var y = myDate.getFullYear();
      var m = myDate.getMonth()+1 < 10 ? '0'+(myDate.getMonth()+1) : myDate.getMonth()+1;
      var d = myDate.getDate() < 10 ? '0' + (myDate.getDate()) : myDate.getDate();
      this.groupName = sessionStorage.getItem("subjectName") + y +  m  + d +'分组';
    }
    // 编辑
    if(this.$route.query.type == 'edit'){
      // 左侧接口数据
      this.$http.get('http://127.0.0.1:3000/jeic/api/teachingGroup/'+ this.$route.query.Id).then(function(data){
        that.newBuild = data.data.data.userGrouplist;
        that.groupName = data.data.data.name;
        that.ids = data.data.data.id;
        console.log(that.newBuild)
        console.log(that.groupName)
        console.log(that.ids)
        console.log(that.$route.query.type)
        that.removeName();
      });
    }
  },
  methods: {
    // 去除相同名字
    removeName(){
      // 把左侧同学push到一个新数组newClassData里
      if(this.newBuild  != undefined){
        for(var i = 0; i < this.newBuild.length; i++){
          this.newClassData.push(this.newBuild[i].groupLeader)
          this.newBuild[i].studentList.map((item) => {
            return this.newClassData.push(item)
          });
        }
      }
      // 两个数组比较，相同的去除
      this.newClassData.map((item,index)=>{
        this.list.map((item1,index1)=>{
          if(item.id == item1.id){
            this.list.splice(index1,1)
          }
        })
      })
    },
    // 去重
    removal(array){
      let arrRemoval = []; //一个新的临时数组
      for(var i = 0; i < array.length; i++){
        if(arrRemoval.indexOf(array[i]) == -1){
          arrRemoval.push(array[i]);
        }
      }
      return arrRemoval;
    },
    // 获取img地址
    getImgUrl(obj){
      return obj == '男'?'boy':'girl'
    },
    // 标题的编辑
    titleEdit(){
      $('.heads span').attr('contenteditable',true);
    },
    // 修改的可编辑
    Editable(obj){
      $(document).mouseup(function(e){
        var con2 = $('.tit strong');   // 设置目标区域
        if(!con2.is(e.target)){ // 判断是不是目标区域
          $('.tit strong').attr('contenteditable',false).css({'border':'0rem solid #F2CB80'})
        }
      });
      $(obj.target).prev().attr('contenteditable',true).css({'border':'.1rem solid #F2CB80'});
    },
    //删除名字
    deleteName(obj,i,index){
      if($(obj.target).parents('div').prev('h3').html() == "组长"){
        this.list.push(this.newBuild[i].groupLeader)
        this.newBuild[i].groupLeader = {};
      }else{
        this.list.push(this.newBuild[i].studentList[index])
        this.newBuild[i].studentList.splice(index,1)
      }
    },
    // 删除每小组
    deleteNewBuiid(obj,arr,i){
      this.newBuild.splice(i,1);
      if(JSON.stringify(arr.groupLeader) != '{}'){
        this.list.push(arr.groupLeader);
      }
      if(arr.studentList.length>0){
        for(var i=0;i<arr.studentList.length;i++){
          this.list.push(arr.studentList[i])
        };
      }
      // this.list = this.removal(this.list);
    },
    // 添加分组按钮
    addGroup(){
      this.addId++;
      this.newBuild.push({
        name:  this.addId + '组',
        studentList:[],  //组员
        groupLeader:{}, //组长
      })
    },
    // 点击右侧学生列表添加人员
    rightStudent(obj,i){
      //组员
      if(this.Highlight && this.userInfo == '组员'){
        this.newBuild[this.indexNum].studentList.push(this.list[i]);
        this.list.splice(i,1);
      }
      //组长
      if(this.Highlight && this.userInfo == '组长'){
        if(JSON.stringify(this.newBuild[this.indexNum].groupLeader) != '{}'){
          let oldLaberName =  this.newBuild[this.indexNum].groupLeader;
          this.list.push(oldLaberName)
        }
        this.newBuild[this.indexNum].groupLeader = obj;
        this.list.splice(i,1);
      }
    },
    // 组长选中高亮
    leader(obj,i){
      let that = this;
      this.indexNum = i;
      this.Highlight = true;
      this.userInfo = $(obj.target).prev().html();
      $(obj.target).css({'border':'.1rem solid #F2CB80'});
      this.targetObj = obj ;
    },
    // 组员选中高亮
    menber(obj,i){
      let that = this;
      this.indexNum = i;
      this.Highlight = true;
      this.userInfo = $(obj.target).prev().html();
      $(obj.target).css({'border':'.1rem solid #F2CB80'});
      this.targetObj = obj ;
    },
    // 左侧任何地方取消高亮选中
    mainL(e){
      let temporaryObj = $(this.targetObj.target);   // 设置目标区域
      if(!temporaryObj.is(e.target) && temporaryObj.has(e.target).length === 0){ // 判断是不是目标区域
        $(temporaryObj).css({'border':'0rem solid #F2CB80'});
        this.Highlight = false;
      }
    },
    //完成事件
    finish(){
      let that = this;
      this.LargeArr.id = this.ids;
      this.LargeArr.name = this.groupName;
      this.LargeArr.class_id = this.$store.state.state.classId;
      this.LargeArr.subject_id = this.$store.state.state.subjectId;
      this.LargeArr.teacher_id = this.$store.state.state.userId;
      this.LargeArr.type = this.$route.query.info;
      this.LargeArr.userGrouplist = this.newBuild;
      // 新建页面
      if(this.$route.query.type == 'newBuilt'){
        this.$http.post("http://127.0.0.1:3000/jeic/api/teachingGroup", { GroupData: this.LargeArr}).then(function(res){
          that.$router.push({
            path:'/teachModel',
            query:{
              classType:'group'
            }
          });
        });
      }
      // 编辑页面
      if(this.$route.query.type == 'edit'){
        this.$http.put("http://127.0.0.1:3000/jeic/api/teachingGroup", { GroupData: this.LargeArr}).then(function(res){
          console.log(res)
          that.$router.push({
            path:'/teachModel',
            query:{
              classType:'group'
            }
          });
        });
      }
    },
  }
}
</script>

<style>
  .foundGroup{width: 100%;height: 100%;background:#fff;font-size: 1.354rem;color: #333333;}
  .foundGroup .heads{width: 100%;height: 5.2rem;line-height: 5.2rem;border-bottom:.1rem solid #ececec;box-sizing: border-box;padding: 0 3rem;}
  .foundGroup .heads i{font-size: 1.6rem;cursor: pointer;color: #4092f4;}
  .foundGroup .heads em{font-size: 1.6rem;margin:0 .5rem;}
  .foundGroup .heads span{display: inline-block;min-width: 6rem;height: 2.2rem;line-height: 2.2rem;padding: 0 1rem; font-size: 1.4583rem;background: #4092f4;border-radius: .5rem;color: #fff;}
  .foundGroup .heads small{color: #acacac;font-size: 1.354rem;}
  
  .foundGroup .mainBox{height: 93%;}
  .foundGroup .mainBox .mainL{width: 38%;height: 96%;border-right: .1rem solid #ececec;box-sizing: border-box;padding: 3rem 3rem 0;overflow-y: auto;}
  .foundGroup .mainBox .mainL .smallAdd{width: 7rem; height: 7rem; border-radius: 5px; background: #eeeeee; box-sizing: border-box; text-align: center; padding-top: 2.2rem; margin-top: 2rem; cursor: pointer;}
  .foundGroup .mainBox .mainL .smallAdd i{font-size: 4rem;color: #4092f4;}
  .foundGroup .mainBox .mainL .btn{width: 10rem;height: 3rem;line-height: 3rem;text-align: center;background: #4092f4;color: #fff;border-radius: 40px;margin: 2rem auto 0;cursor: pointer;font-size: 1.458rem;}
  .foundGroup .mainBox .mainL .newBuild{margin-bottom: 3rem;}
  .foundGroup .mainBox .mainL .newBuild .tit strong{font-size: 1.6rem;padding: 0 .5rem;}
  .foundGroup .mainBox .mainL .newBuild .tit span{color: #4092f4;font-size: 1.145rem;cursor: pointer;}
  .foundGroup .mainBox .mainL .newBuild .tit i{color: #4092f4;font-size: 1.6rem;cursor: pointer;}
  .foundGroup .mainBox .mainL .newBuild .groupLeader h3,
  .foundGroup .mainBox .mainL .newBuild .teamMember h3{font-size: 1.354rem; margin: 2rem 0 0.8rem;}
  .foundGroup .mainBox .mainL .newBuild .groupLeader>div,
  .foundGroup .mainBox .mainL .newBuild .teamMember>div{width: 100%;min-height: 5rem;background: #eeeeee;box-sizing: border-box;padding: 1.5rem;border-radius: .5rem;}
  .foundGroup .mainBox .mainL .newBuild .teamMember>div{min-height: 10rem;}

  .foundGroup .mainBox .mainL .newBuild .addBorder{border:0.1rem solid  #F2CB80;}

  .leftDrag,.rightDrag{display: inline-block;width: 100%;min-height: 8rem;height: 100%;}
  .laberDrag{display: inline-block;width: 100%;min-height: 2rem;}

  .leftDrag em,.leftDrag em,.laberDrag em{display: inline-block; width: 8.3rem;height: 2.6rem;line-height: 2.6rem;text-align: center;background: #4092f4;color: #fff; border-radius: 0.5rem;font-size: 1.458rem;position: relative;margin-right: 1rem;margin-bottom: 1.5rem;cursor: pointer;}
  .leftDrag em:nth-child(3n){margin-right: 0;}
  .leftDrag em img,.leftDrag em img{position: absolute;top: -0.7rem;right: -0.7rem;;cursor: pointer;width: 1.485rem;height: 1.485rem;}
  .laberDrag em{margin-bottom: 0;}

  .foundGroup .mainBox .mainR{width: 62%;height: 96%; overflow-y: auto;}
  .foundGroup .mainBox .mainR li{margin-left: 3rem;margin-top:2rem;cursor: pointer;list-style: none;}
  .foundGroup .mainBox .mainR li img{width: 7rem;height: 7rem;margin-bottom: 1rem;}
  .foundGroup .mainBox .mainR li p{text-align: center;}



 
  .flip-list-move {transition: transform 0.5s;}
  .ghost {opacity: 0.5;background: #c8ebfb;}


</style>
