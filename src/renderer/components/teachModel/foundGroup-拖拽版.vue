<template>
  <div class="foundGroup">
      <div class="heads">
        <router-link tag='i' :to="{path:'/teachModel',query:{classType:'group'}}">
          <i class="iconfont icon-fanhui"></i>
        </router-link>
        <em>此次分组名称</em>
        <span contenteditable='false' @click="titleEdit()">语文20190702分组</span>
        <small>( {{this.$route.query.info=='1'?'临时组':'固定组'}} )</small>
      </div>
      <div class="mainBox clearfix">
        <!-- 左侧 -->
        <div class="mainL fl">
          <div class="newBuild" v-for="(item,i) in newBuild" :key='i'>
            <div class="tit clearfix">
              <strong contenteditable='false' >{{item.groupName}}</strong>
              <span @click="Editable($event)">修改</span>
              <i class="iconfont icon-shanchuzu fr" @click="deleteNewBuiid($event)"></i>
            </div>
            <div class="groupLeader">
              <h3>组长</h3>

              <draggable v-model="laberList" v-bind="dragOptions" :move="onMove"  >
                <transition-group class="laberDrag clearfix" :name="'flip-list'">
                    <em class="fl"  v-for="element,index in laberList" :key="element.id"  @click=" element.fixed=! element.fixed" aria-hidden="true">
                      {{element.name}}
                      <!-- <img src="../../assets/img/delete.png" @click="deleteName($event)"> -->
                    </em>
                </transition-group>
              </draggable>


            </div>
            <div class="teamMember">
              <h3>组员</h3>

              <draggable v-model="menberList" v-bind="dragOptions" :move="onMove" >
                <transition-group class="leftDrag clearfix" :name="'flip-list'">
                    <em class="fl" v-for="element,index in menberList" :key="element.id"  @click=" element.fixed=! element.fixed" aria-hidden="true">
                      {{element.name}}
                      <!-- <img src="../../assets/img/delete.png" @click="deleteName($event)"> -->
                    </em>
                </transition-group>
              </draggable>
              
            </div>
          </div>
          <div class="smallAdd" @click="addGroup()"><i class="iconfont icon-jiahao"></i></div>
          <div class="btn" @click="finish()">完成</div>
        </div>

        <!-- 右侧 -->
        <draggable class="mainR fr" v-model="list" v-bind="dragOptions" :move="onMove" >
          <transition-group class="rightDrag clearfix" type="transition" :name="'flip-list'">
            <li class="fl" v-for="element in list" :key="element.id">
              <img :src='"../../assets/img/boy.png"'  @click=" element.fixed=! element.fixed" aria-hidden="true">
              <p>{{element.name}}</p>
            </li>
          </transition-group>
        </draggable>

      </div>
  </div>
</template>

<script>
import $ from "jquery";
import draggable from 'vuedraggable';
$(document).mouseup(function(e){
  var con2 = $('.tit strong');   // 设置目标区域
  if(!con2.is(e.target)){ // 判断是不是目标区域
    $('.tit strong').attr('contenteditable',false).css({'border':'0rem solid #F2CB80'})
  }
});


export default {
  name:'foundGroup',
  data(){
    return {
      newBuild:[   // 新建数据
        {
          // groupName:'1组',
        }
      ],
      addId:1,//添加分组的组数
      list:[], //全班的学生
      laberList:[], //组长
      menberList:[], //组员
    }
  },
  components: {
    draggable,
  },
  computed: {
    dragOptions() {
      return {
        group: "description", //name:description相同的组可以互相拖动
      };
    },
  },
  watch: {

  },
  //created函数中调用ajax获取页面初始化所需的数据
  created () {
    const that = this;
    this.$http.get('http://127.0.0.1:3000/jeic/api/student?classId=class_b1be834b4407448f9f9bd6311e3934b0').then(function(data){
      that.list = data.data.data;
    });
    if(this.$route.query.type == 'newBuilt'){
      //
    }
    if(this.$route.query.type == 'edit'){
      //
    }
  },
  methods: {
    onMove({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element;
      const draggedElement = draggedContext.element;
      return (
        (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      );
    },
    end(evt){
      console.log(evt.to)

      this.isDragging = false;
      if(this.laberList.length != 0){
        // this.editable = false;
        // $('.laberDrag').parents('draggable').attr('editable',false);
      }else{
        // this.disabled = true;
      }
    },
    // 标题的编辑
    titleEdit(){
      $('.heads span').attr('contenteditable',true);
    },
    // 修改的可编辑
    Editable(obj){
      $(obj.target).prev().attr('contenteditable',true).css({'border':'.1rem solid #F2CB80'});
    },
    // 添加分组按钮
    addGroup() {
      //
    },
    //完成事件
    finish(){
      //
    },
    //删除名字
    deleteName(obj){
      $(obj.target).parents('span').remove();
    },
    // 删除分组
    deleteNewBuiid(obj){
      $(obj.target).parents('.newBuild').remove();
    },
    // 添加分组按钮
    addGroup(){
      this.addId++;
      this.newBuild.push({
        groupName:  this.addId + '组',
      })
      this.newBuild.menberList = [];
    }
  }
}
</script>

<style>
  .foundGroup{width: 100%;height: 100%;background:#fff;font-size: 1.354rem;color: #333333;}
  .foundGroup .heads{width: 100%;height: 5.2rem;line-height: 5.2rem;border-bottom:.1rem solid #ececec;box-sizing: border-box;padding: 0 3rem;}
  .foundGroup .heads i{font-size: 1.6rem;cursor: pointer;color: #4092f4;}
  .foundGroup .heads em{font-size: 1.6rem;margin:0 .5rem;}
  .foundGroup .heads span{display: inline-block; font-size: 1.4583rem;background: #4092f4;border-radius: .5rem;color: #fff;min-width: 6rem;height: 2rem;line-height: 2rem;padding: 0 1rem}
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
