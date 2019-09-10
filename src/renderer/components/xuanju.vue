<template>
	
	<div class="wrapper">
		<div class="foundGroup" style="z-index:1">
			<div class="heads">
				<router-link tag='i' :to="{path:'/teachModel',query:{classType:'group'}}">
					<i class="iconfont icon-fanhui"></i>
				</router-link>
				<em>班级选举</em>
				<span class="fr">
					<input type="checkbox" v-model="checked" @click="checkedAll()" :checked="checked">
					<label for="allcheck">全选</label>
				</span>
			</div>
			<div class="mainBox clearfix">
				<ul class="mainR">
					<li class="fl strSingle" :class="{'active':item.active}" v-for="(item,index) in list" :key="index" @click="checkStudent(item,index)">
						<img :src='"../assets/img/"+ getImgUrl(item.sex) +".png"' alt="">
						<p>{{item.name}}</p>
					</li>
				</ul>

				<button class="finishcreated" @click="finishcreated">完成创建</button>
				
				<!-- 弹窗显示 -->
				<div class="setNum" v-show="complite">
					<div class="bghui"></div>
					<div class="setContent">
						<div class="settitle">
							规则设置
							<i class="fr iconfont icon-hao closeicon" @click="closeSetNum" style=""></i>
							</div>
						<div class="piaoNum">
							投票数量
							<span>﹣</span>
							<input type="number">
							<span>﹢</span>
						</div>
						<div class="piaoStyle">
							计票方式
							<span>匿名</span>
							<span>实名</span>
						</div>
						<div class="guizeSet">
							规则设置
							<input type="radio" name="notou" id="radio1"><label for="radio1">候选人不可投票</label>
							<input type="radio" name="notou1"  id="radio2"><label for="radio2">候选人可投票/不可投自己</label>
							<input type="radio" name="notou2" id="radio3"><label for="radio3">候选人可投票/可投自己</label>
						</div>
					
					</div>
					
				</div>

			</div>
		</div>
	</div>

</template>

<script>
	import $ from "jquery";
	import Vue from 'vue';
	import {
		mapState
	} from "vuex";

	export default {
		name: 'foundGroup',
		data() {
			return {
				list: [], //全班的学生
				checkedstr: [], //选择的学生
				checked: false ,//全选按钮默认状态
				complite:false
			}
		},
		components: {

		},
		watch: {

		},
		created() {
			const that = this;
			that.list = this.remember
		},
		computed: {
			...mapState({
				remember: state => state.state.remember,
				pattern: state => state.state.pattern,
				groupId: state => state.state.groupId
			})
		},
		methods: {
			// 获取img地址
			getImgUrl(obj) {
				return obj == '男' ? 'boy' : 'girl'
			},
			checkStudent(item, index) {
				// console.log(this.checkedstr.length)
				// console.log(this.list.length)
				if (item.active) {
					Vue.set(item, 'active', false); //为item添加不存在的属性，需要使用vue提供的Vue.set( object, key, value )方法。 
					var pos = this.checkedstr.indexOf(item);
					this.checkedstr.splice(pos,1)
				} else {
					Vue.set(item, 'active', true);
					if(this.checkedstr.indexOf(item)==-1){
						this.checkedstr.push(item)
					}
				}
				
				if (this.checkedstr.length == this.list.length) {
					this.checked = true;
				} else {
					this.checked = false;
				}
				console.log(this.checkedstr)
			},
			checkedAll() {  //全选
				if (this.checked) {
					for (var i = 0; i < this.list.length; i++) {
						Vue.set(this.list[i], 'active', false);
						this.checkedstr=[]
					}
				} else {
					for (var i = 0; i < this.list.length; i++) {
						Vue.set(this.list[i], 'active', true);
						this.checkedstr=this.list
					}
				}
			},
			finishcreated(){ //点击完成创建 设置弹窗显示
				if(this.checkedstr.length>0){
					this.complite=true;
				}
			},
			closeSetNum(){ //关闭设置弹窗显示
				this.complite=false;
			}
		}
	}
</script>

<style scoped="scoped">
	.wrapper {
		position: relative;
		z-index: 5;
		width: 100%;
		height: 100%;
	}

	.strSingle {
		opacity: 0.5;
	}
	.piaoNum span{
		font-size: 20px;
		border:1px solid #ddd;
		color:#ccc;
		height: 30px;
		vertical-align: middle;
	}
	
	.piaoNum input{
		border: #ddd 1px solid;
		height: 28px;
		outline: none;
		text-align: center;
		width: 60px;
	}
	
	.piaoStyle{
		margin: 20px;
	}
	
	.piaoStyle span{
		    width: 50px;
		    height: 30px;
		    display: inline-block;
		    border-radius: 7px;
		    line-height: 30px;
		    text-align: center;
		    color: #fff;
			background: #ccc;
	}
	
	.piaoStyle span.xuanzhong{
		background: #4092f5;
	}
	
	.settitle{
		width: 100%;
		height: 40px;
		background: #4092f5;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	    text-align: center;
	    line-height: 40px;
	    color: #fff;
	}
	.closeicon{
		transform: rotate(45deg);
		display: inline-block;
		margin-right:20px;
	}
	.setNum{
		position: fixed;
		top:0;
		bottom:0;
		left:0;
		right:0;
		margin:auto;
	}
	.setNum .bghui{
		background: rgba(0,0,0,.5);
		width:100%;
		height:100%;
	}
	.setContent{
		width: 400px;
		    height: 500px;
		    border-radius: 10px;
		    z-index: 99;
		    /* position: absolute; */
		    margin: auto;
		    position: fixed;
		    top: 0;
		    bottom: 0;
		    left: 0;
		    right: 0;
		    margin: auto;
		    background: #fff;
		
	}

	.active {
		opacity: 1;
	}

	.finishcreated {
		width: 300px;
		height: 50px;
		background: #219cfa;
		display: block;
		margin: 0 auto;
		border: 0;
		border-radius: 30px;
		color: #fff;
		font-weight: bold;
		outline: none;
	}

	.foundGroup {
		width: 100%;
		height: 100%;
		background: #fff;
		font-size: 1.354rem;
		color: #333333;
	}

	.foundGroup .heads {
		width: 100%;
		height: 5.2rem;
		line-height: 5.2rem;
		border-bottom: .1rem solid #ececec;
		box-sizing: border-box;
		padding: 0 3rem;
	}

	.foundGroup .heads i {
		font-size: 1.6rem;
		cursor: pointer;
		color: #4092f4;
	}

	.foundGroup .heads em {
		font-size: 1.6rem;
		margin: 0 .5rem;
	}

	/* .foundGroup .heads span{display: inline-block; font-size: 1.4583rem;background: #4092f4;border-radius: .5rem;color: #fff;min-width: 6rem;height: 2rem;line-height: 2rem;padding: 0 1rem} */
	.foundGroup .heads small {
		color: #acacac;
		font-size: 1.354rem;
	}

	.foundGroup .mainBox {
		height: 93%;
	}

	.foundGroup .mainBox .mainL {
		width: 38%;
		height: 96%;
		border-right: .1rem solid #ececec;
		box-sizing: border-box;
		padding: 3rem 3rem 0;
		overflow-y: auto;
	}

	.foundGroup .mainBox .mainL .smallAdd {
		width: 7rem;
		height: 7rem;
		border-radius: 5px;
		background: #eeeeee;
		box-sizing: border-box;
		text-align: center;
		padding-top: 2.2rem;
		margin-top: 2rem;
		cursor: pointer;
	}

	.foundGroup .mainBox .mainL .smallAdd i {
		font-size: 4rem;
		color: #4092f4;
	}

	.foundGroup .mainBox .mainL .btn {
		width: 10rem;
		height: 3rem;
		line-height: 3rem;
		text-align: center;
		background: #4092f4;
		color: #fff;
		border-radius: 40px;
		margin: 2rem auto 0;
		cursor: pointer;
		font-size: 1.458rem;
	}

	.foundGroup .mainBox .mainL .newBuild {
		margin-bottom: 3rem;
	}

	.foundGroup .mainBox .mainL .newBuild .tit strong {
		font-size: 1.6rem;
		padding: 0 .5rem;
	}

	.foundGroup .mainBox .mainL .newBuild .tit span {
		color: #4092f4;
		font-size: 1.145rem;
		cursor: pointer;
	}

	.foundGroup .mainBox .mainL .newBuild .tit i {
		color: #4092f4;
		font-size: 1.6rem;
		cursor: pointer;
	}

	.foundGroup .mainBox .mainL .newBuild .groupLeader h3,
	.foundGroup .mainBox .mainL .newBuild .teamMember h3 {
		font-size: 1.354rem;
		margin: 2rem 0 0.8rem;
	}

	.foundGroup .mainBox .mainL .newBuild .groupLeader>div,
	.foundGroup .mainBox .mainL .newBuild .teamMember>div {
		width: 100%;
		min-height: 5rem;
		background: #eeeeee;
		box-sizing: border-box;
		padding: 1.5rem;
		border-radius: .5rem;
	}

	.foundGroup .mainBox .mainL .newBuild .teamMember>div {
		min-height: 10rem;
	}

	.leftDrag,
	.rightDrag {
		display: inline-block;
		width: 100%;
		min-height: 8rem;
		height: 100%;
	}

	.laberDrag {
		display: inline-block;
		width: 100%;
		min-height: 2rem;
	}

	.leftDrag em,
	.leftDrag em,
	.laberDrag em {
		display: inline-block;
		width: 8.3rem;
		height: 2.6rem;
		line-height: 2.6rem;
		text-align: center;
		background: #4092f4;
		color: #fff;
		border-radius: 0.5rem;
		font-size: 1.458rem;
		position: relative;
		margin-right: 1rem;
		margin-bottom: 1.5rem;
		cursor: pointer;
	}

	.leftDrag em:nth-child(3n) {
		margin-right: 0;
	}

	.leftDrag em img,
	.leftDrag em img {
		position: absolute;
		top: -0.7rem;
		right: -0.7rem;
		;
		cursor: pointer;
		width: 1.485rem;
		height: 1.485rem;
	}

	.laberDrag em {
		margin-bottom: 0;
	}

	.foundGroup .mainBox .mainR {
		width: 96%;
		height: 80%;
		overflow-y: auto;
		margin: 0 auto;
	}

	.foundGroup .mainBox .mainR li {
		margin-left: 2rem;
		margin-top: 1rem;
		cursor: pointer;
		list-style: none;
	}

	.foundGroup .mainBox .mainR li img {
		width: 4rem;
		height: 4rem;
		margin-bottom: 1rem;
	}

	.foundGroup .mainBox .mainR li p {
		text-align: center;
	}


	.flip-list-move {
		transition: transform 0.5s;
	}

	.ghost {
		opacity: 0.5;
		background: #c8ebfb;
	}
</style>
