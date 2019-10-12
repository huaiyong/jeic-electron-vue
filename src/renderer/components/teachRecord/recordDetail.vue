<template>
	<div class="zmj_answer">
		<!--试题内容部分 start-->
		<div class="zmj_answerTest">
			<h2 v-show="testType==1">请使用答题器完成以下<span v-text="textDataLength"></span>道题</h2>
			<ul ref="zmj_answerOption" v-show="testType==1">
				<li v-for="(item,index) in textData.data" :key="index" v-show="index==showIndex">
					<div class="zmj_answerBody">
						<div v-if="item.type=='1'" class="zmj_answerType">判断</div>
						<div v-if="item.type=='2'" class="zmj_answerType">单选</div>
						<div v-if="item.type=='4'" class="zmj_answerType">多选</div>
						<div v-html="item.body" class="zmj_answerTitle"></div>
					</div>
					<ol>
						<li v-for="(i,index) in item.option" :key="index">
							<div v-html="i.text"></div>
						</li>
					</ol>
					
					<div class="stuAnswer" v-if='studentScore[index]'>
					  <span v-text="studentName"></span>的答案：<span v-text="studentScore[index].answer"></span>
				    </div>
				</li>
			</ul>
			<div v-if="testType==3" class="subjectDetail imgType">
				<span class="zmj_answerType" v-if="imgType == 1">判断</span>
				<span class="zmj_answerType" v-if="imgType == 2">单选</span>
				<span class="zmj_answerType" v-if="imgType == 3">填空</span>
				<span class="zmj_answerType" v-if="imgType == 4">多选</span>
				<span class="zmj_answerType" v-if="imgType == 5">阅读理解</span>
				<span class="zmj_answerType" v-if="imgType == 6">解答</span>
				<span class="zmj_answerType" v-if="imgType == 7">完形</span>
				<span class="zmj_answerType" v-if="imgType == 8">材料</span>
				<img :src="imgUrl" alt="" class="photoTest">
				<div class="stuAnswer" v-for="(i,index) in studentScore" :key="index" v-if='studentScore[index].answer'>
					  <span v-text="studentName"></span>的答案：<span v-text="studentScore[index].answer"></span>
				    </div>
			</div>	
			<div class="zmj_answerItem clearfix" v-show="testType==1">
				<div class="change">
					<i class="iconfont icon-zuojiantou" @click="prevTest()" v-show="showIndex>0"></i>
					<span>第<i v-text="showIndex+1"></i>题</span>
					<i class="iconfont icon-youjiantou" @click="nextTest()" v-show="showIndex<textDataLength-1"></i>
				</div>
				<div class="fontSize">
					<span @click="smallSize()">小</span>
					<span @click="middleSize()">中</span>
					<span @click="bigSize()">大</span>
				</div>
			</div>
		</div>
		<!--试题内容部分 end-->
		<!--学生列表内容部分 start-->
		<div class="zmj_answerStudent">
			<div class="changeStudentList iconfont  icon-xianshi" @click="changeStudenLists()"></div>
			<div class="zmj_answerBtn">
				<span @click="lookSituation('yidati')">
					<i class="iconfont icon-tongji"></i>学生答题情况
				</span>
				<i class="iconfont icon-guanbi1 close" @click="back()"></i>
			</div>
			<div class="zmj_answerStudentList">
				<!--全班模式 start-->
				<ul class="zmj_answerWhole" v-if="!isGroup">
					<li v-for="(item,index) in remember" :key="index" :class="{'active':isStuActive.indexOf(item.id)!=-1,'stuActive':studentName==item.name}" @click="studentResult(item.id,item.name,$event)">
						<img v-if="item.sex=='男'" src="../../assets/img/boy.png" alt="">
						<img v-if="item.sex=='女'" src="../../assets/img/girl.png" alt="">
						<p v-text="item.name"></p>
					</li>
				</ul>
				<!--全班模式 end-->
				<!--分组模式 start-->
				<div v-if="isGroup" class="zmj_groupStudent">
					<div v-for="i in groupStudent" :key="i.id" >
						<p v-text="i.name"></p>
						<div class="clearfix"> 
							<ol class="fl clearfix">
								<li :class="{'active':isStuActive.indexOf(i.groupLeader.id)!=-1,'stuActive':studentName==i.groupLeader.name}" @click="studentResult(i.groupLeader.id,i.groupLeader.name,$event)">
									<img v-if="i.groupLeader.sex=='男'" src="../../assets/img/boy.png" alt="">
									<img v-if="i.groupLeader.sex=='女'" src="../../assets/img/girl.png" alt="">
									<p v-text="i.groupLeader.name"></p>
								</li>
							</ol>
							<ul class=" fl clearfix">
								<li v-for="item in i.studentList" :key="item.id" :class="{'active':isStuActive.indexOf(item.id)!=-1,'stuActive':studentName==item.name}"  @click="studentResult(item.id,item.name,$event)">
									<img v-if="item.sex=='男'" src="../../assets/img/boy.png" alt="">
									<img v-if="item.sex=='女'" src="../../assets/img/girl.png" alt="">
									<p v-text="item.name"></p>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<!--分组模式 end-->
			</div>
		</div>
		<!--学生列表部分 end-->
		
		<div class="commonTitle"></div>
 </div>
</template>

<script>
	import $ from "jquery"
	import {
		mapState
	} from "vuex";

	export default {
		name: "recordDetail",
		data() {
			return {
				textData: {}, //试题
				textDataLength: 1, //试题数量
				showIndex: 0, //默认显示试题下标
				signRemember: [], //已作答学生列表
				studentName: "", //学生名字
				groupStudent: [], //分组学生
				studentScore:[],//学生成绩
				resourceId: "", //下发记录ID
				eachRecordId: this.$route.params.eachRecordId, //资源ID
				isFirstEnter: false,
				isStuActive:[],//判断已答题学生
				type:this.$route.params.type, //类型 1:试题 3:图片
//				sendType:"", //1全班,2分組作答
				answerType:"", //1全班作答 2是组长作答 3是全组作答
				isGroup:false,//true 分組,false全班
				resourceUrl:this.$route.params.resourceUrl, //获取img路径
				teacherImg:'',//老师传的图片
				changeType:'', //中间变量
				yuntishiScroll:0 //滚动距离
			}
		},
		computed: {
			...mapState({
				userId: state => state.state.userId,
				remember: state => state.state.remember,
				pattern: state => state.state.pattern,
				classRecord: state => state.state.classRecord,
				testType: state => state.state.testType,
				groupId: state => state.state.groupId,
				imgUrl:state => state.state.imgUrl,
				imgType:state => state.state.imgType,
				imgAnswer:state => state.state.imgAnswer,
			})


		},
		sockets:{
			small(){
				this.smallSize();
			},
			middle(){
				this.middleSize();
			},
			big(){
				this.bigSize();
			},
			yunshitiziyuanScrollshang(data){
				this.shitiMove(data.name);
			},
			yunshitiziyuanScrollxia(data){
				this.shitiMove(data.name);
			},
			nextQuestion(){
				this.nextTest();
			},
			prevQuestion(){
				this.prevTest();
			},
			testImgLook(){
				this.lookImg();
			},
			ToggleHide(){
				this.hideStudentList();
			},
			ToggleShow(){
				this.showStudentList();
			},
			recordshiticlose(){
				this.back();
			},
			checkJiluClass(data){
				this.lookSituation(data[0])
			},
			checkStuDeail(data){
				this.resultDisplay(data[0],data[1])
			},
			
		},
		methods: {
			back() {
				this.$router.push({
					"name": "Records"
				});
				this.studentName ="";
				this.isStuActive =[];
				this.studentScore = []
			},
			getTypeData() {
				this.answerType = this.$route.params.answerType;
				this.$store.dispatch("getAnswerType", this.answerType );
			},
			getTextData() { //获取试题
				this.resourceId = this.$route.params.resourceId;
					const that = this;
					this.$http.get(this.configure.resourceIp + '/teacher/import/getQuestionInfo.do?hid=' + this.resourceId).then(
						function(res) {
							if (res.data.ret == 200) {
								that.textData = res.data.data;
								that.textDataLength = res.data.data.total;
							};
						});
			},
			nextTest() { //下一题
				this.showIndex++;
			},
			prevTest() { //上一题
				this.showIndex--;
			},
			smallSize() { //小号字体
				this.$refs.zmj_answerOption.style.fontSize = "3rem";
			},
			middleSize() { //中号字体
				this.$refs.zmj_answerOption.style.fontSize = "3.5rem";
			},
			bigSize() { //大号字体
				this.$refs.zmj_answerOption.style.fontSize = "4rem";
			},
			shitiMove(direction){
				if (direction == "yunshitiziyuanScrollshang") {
					this.yuntishiScroll += 20;
				} else if (direction == "yunshitiziyuanScrollxia" && this.yuntishiScroll > 0) {
					this.yuntishiScroll += -20;
				};
				$('.subjectDetail').scrollTop(this.yuntishiScroll);
			},
			hideStudentList() {
				$(".zmj_answerTest").animate({
					right: 0,
					height: "90%",
					"font-size": "4rem"
				});
				$(".zmj_answerStudent").animate({
					right: "-41.2rem",

				});

				$(".changeStudentList").removeClass("icon-xianshi").addClass("icon-yincang")
			},
			showStudentList() {
				$(".zmj_answerTest").animate({
					right: "41.2rem",
					height: "80%"
				});

				$(".zmj_answerStudent").animate({
					right: 0,

				});

				$(".changeStudentList").removeClass("icon-yincang").addClass("icon-xianshi");
			},
			changeStudenLists() {
				if ($(".changeStudentList").hasClass('icon-xianshi')) {
					this.hideStudentList();
				} else {
					this.showStudentList();
				};
			},

			error: function(data) {
				$(".commonTitle").html(data).show();
				setTimeout(function() {
					$(".commonTitle").hide();
				}, 1000);
			},
			lookSituation(text) { //查看学生情况
					this.$router.push({
						"name": "recordAnswerStatistics",
						params:{
							text:text,
							id:this.eachRecordId
						}
					});
				
			},
			getStuAnswerList(){
				this.eachRecordId = this.$route.params.eachRecordId;
				var that = this;
				if(this.testType=='3' || this.testType=='1'){
					this.changeType = 1;
				}else{
					this.changeType = 2;
				}
				this.$http.get(
"http://localhost:3000/jeic/api/sendRecord/getAnsweredUser?sendRecordId="+this.eachRecordId+"&type="+this.changeType).then(function(res) {
					if (res.data.ret == 200) {
						that.signRemember = res.data.data;//获取答题学生的名单
						that.signRemember.map(function(item){
							that.isStuActive.push(item);
							
						})
					};
				});
			},
			getStudentList() { //获取分组学生
				var that = this;
				this.$http.get("http://127.0.0.1:3000/jeic/api/teachingGroup/"+this.groupId).then(function(
					res) {
					if (res.data.ret == 200) {
						that.groupStudent = res.data.data.userGrouplist;
					};
				});


			},
			studentResult(id, name,event) { //查看某个学生答题结果/
				if(!$(event.target).hasClass('active')){
			  	this.error(name + "未答题");
			 }else{
			  	this.resultDisplay(id, name);
			  }	
			},
			resultDisplay(id,name){
				console.log(this.type,'type')
				this.eachRecordId = this.$route.params.eachRecordId;
				this.studentName = name;
				if(this.type==1 || this.type==3){
					var that=this;
					this.$http.get("http://localhost:3000/jeic/api/answerResult/getDataByUserId?recordId="+this.eachRecordId+"&userId="+id).then(function(res){
						if(res.data.ret==200){
							  	that.studentScore=res.data.data.list;		
						};
					});
				}
//else if(this.testType==3){
//					var that=this;
//					this.$http.get("http://localhost:3000/jeic/api/studentPad/getStudentBackPicture?stuId="+id+"&classRecordId="+this.classRecord+"&id="+this.eachRecordId).then(function(res){					
//						if(res.data.ret==200){
//							console.log(res,'图片')
//							if (res.data.data.length > 0) {
////								that.resourceUrl = res.data.data[0].resourceUrl;
//							} else {
////								that.resourceUrl = teacherImg;
//							};
//						};
//					});
//				}
			}
		},
		activated() {
			if (this.$route.meta.reload || this.isFirstEnter) {
				this.showIndex = 0;
				this.getTextData();
				this.getTypeData();
				if(this.answerType=='1'){
					this.isGroup = false;
					this.getStuAnswerList();
				}else{
					this.isGroup = true;
					this.getStuAnswerList();
					this.getStudentList();
				}
			};
			this.$route.meta.reload =true;
			this.isFirstEnter = false;

		},
		created() {
				this.isFirstEnter = true;
		},
		mounted() {
			this.getStudentList();
			var that = this;
			$(".zmj_answerTest").on("click", "img", function() {
				var imgSrc = $(this).attr("src");
				that.$router.push({
					name: 'picShow',
					params: {
						imgsrc: imgSrc
					}
				})
			})
		}

	}
</script>

<style>
	.zmj_answer {
		width: 100%;
		height: 100%;
		background: rgb(82, 86, 89);
		position: relative;
		z-index: 2;
		overflow: hidden;
	}

	.zmj_answerTest {
		height: 80%;
		background: #C7EDCC;
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		right: 41.2rem;
		margin: auto 0;
	}

	.zmj_answerTest h2 {
		color: #666;
		font-size: 3rem;
		height: 4rem;
		line-height: 4rem;
		padding: 0 2rem;
	}

	.zmj_answerTest ul {
		font-size: 3rem;
		position: absolute;
		top: 5rem;
		bottom: 5rem;
		left: 0;
		right: 0;
		padding: 0 2rem;
		overflow-y: auto;
	}

	.zmj_answerTest ul img {
		max-width: 89%;
		height: auto;
		cursor: pointer;
	}

	.zmj_answerType {
		padding: .4rem 1rem;
		border-radius: 6%;
		font-size: 2rem;
		background: #1296db;
		color: #fff;
		position: absolute;
		left: 2rem;

	}

	.zmj_answerTitle {

		text-indent: 8rem;

	}

	.zmj_answerTest ol li {

		list-style-type: upper-alpha;
		margin: 1.2rem 0 1.2rem 4rem;
	}

	.zmj_answerItem {
		height: 4rem;
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		overflow: hidden;
	}

	.zmj_answerItem .change {
		width: 20rem;
		height: 4rem;
		line-height: 4rem;
		vertical-align: middle;
		position: absolute;
		left: 0;
		right: 0;
		margin: 0 auto;
	}

	.zmj_answerItem .change .iconfont {
		font-size: 2.6rem;
		cursor: pointer;
		display: inline-block;
		vertical-align: middle;
	}

	.zmj_answerItem .change span {
		font-size: 2.6rem;
		margin: 0 1rem;
		display: inline-block;
		vertical-align: top;
	}

	.zmj_answerItem .fontSize {
		position: absolute;
		right: 0;
		bottom: .8rem;
	}

	.zmj_answerItem .fontSize span {
		display: inline-block;
		font-size: 1.6rem;
		width: 2rem;
		height: 2.5rem;
		text-align: center;
		line-height: 2.5rem;
		background: #eaeaea;
		margin-right: 1rem;
		cursor: pointer;
	}

	.changeStudentList {
		width: 2.2rem;
		height: 5rem;
		position: absolute;
		left: -2.1rem;
		background: #7c7f80;
		top: 50%;
		cursor: pointer;
		text-align: center;
		line-height: 5rem;
		font-size: 1.8rem !important;
		border-top-left-radius: .6rem;
		border-bottom-left-radius: .6rem;
		box-shadow: 0 0.2rem 0 0 #b1b1b1;
		background: bule;
	}

	.zmj_answerStudent {
		width: 41rem;
		height: 100%;
		border-left: .2rem solid #ccc;
		background: rgba(188, 188, 188, 0.4);
		position: absolute;
		top: 0;
		right: 0;
	}

	.zmj_answerBtn {
		height: 5rem;
		line-height: 5rem;
		border-bottom: .1rem solid #ccc;
	}

	.zmj_answerBtn span {
		font-size: 2.2rem;
		color: #fff;
		padding: 0 2rem;
		cursor: pointer;
	}

	.zmj_answerBtn span .iconfont {
		font-size: 2rem;
	}

	.zmj_answerBtn button {
		font-size: 1.4rem;
		color: #fff;
		padding: .5rem 1rem;
		border: none;
		border-radius: .6rem;
		background: #ef4300;
		outline: none;
		vertical-align: .2rem;
		margin-left: .6rem;
		cursor: pointer;
	}

	.zmj_answerBtn button.active {
		background: #ccc;
		color: #666;
		cursor: inherit;

	}

	.zmj_answerBtn .close {
		position: absolute;
		top: -1rem;
		right: 0;
		color: #fff;
		font-size: 2.6rem;
		cursor: pointer;

	}

	.zmj_answerStudentList {
		position: absolute;
		top: 5.1rem;
		bottom: 0;
		left: 0;
		right: 0;
		overflow-y: auto;
	}

	.zmj_answerWhole li {
		position: relative;
		width: 4.8rem;
		font-size: 1.6rem;
		color: #fff;
		text-align: center;
		margin: .8rem;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		display: inline-block;
		opacity: 0.3;
		cursor: pointer;
	}

	.zmj_answerWhole li.active {
		opacity: 1;
		cursor: pointer;
	}

	.zmj_answerWhole li img {
		width: 100%;
		pointer-events: none;
	}

	

	

	

	

     
	.zmj_groupStudent>div {
		font-size: 1.6rem;
		color: #fff;
		padding: 1.2rem;
		border-bottom: .3rem dashed #4092f4;
	}

	.zmj_groupStudent ol {
		width: 20%;
	}

	.zmj_groupStudent ul {
		width: 80%;
	}

	.zmj_groupStudent li {
		margin-right: 2.1rem;
		margin-top: 1.8rem;
		float: left;
		opacity: 0.3;
	}

	.zmj_groupStudent li.active {
		opacity: 1;
		cursor: pointer;
	}

	.zmj_groupStudent li img {
		width: 4.5rem;
		height: 4.5rem;
	}

	.zmj_groupStudent li p {
		font-size: 1.4rem;
		color: #fff;
		text-align: center;
		margin-top: .8rem;
	}
	.stuActive {
		background: #1296db;
		border: 1px solid #1296db;
		color: #fff;
	}
	

</style>
