<template>
	<div class="zmj_answer">
		<div class="zmj_answerTest">
			<h2>请使用答题器完成以下<span v-text="textDataLength"></span>道题</h2>
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
				</li>
			</ul>
			<div v-if="testType==3" class="imgType">
				<span class="zmj_answerType" v-if="imgType == 1">判断</span>
				<span class="zmj_answerType" v-if="imgType == 2">单选</span>
				<span class="zmj_answerType" v-if="imgType == 3">填空</span>
				<span class="zmj_answerType" v-if="imgType == 4">多选</span>
				<span class="zmj_answerType" v-if="imgType == 5">阅读理解</span>
				<span class="zmj_answerType" v-if="imgType == 6">解答</span>
				<span class="zmj_answerType" v-if="imgType == 7">完形</span>
				<span class="zmj_answerType" v-if="imgType == 8">材料</span>
				<img :src="imgUrl" alt="" class="photoTest">
			</div>
			<div class="zmj_answerItem clearfix">
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
		<div class="zmj_answerStudent">
			<div class="changeStudentList iconfont  icon-xianshi" @click="changeStudenLists()"></div>
			<div class="zmj_answerBtn"><span @click="lookSituation()"><i class="iconfont icon-tongji"></i>学生答题情况</span>
				<button :disabled="checkedState" :class="{'active':checkedState}" @click="lowerHair(testType)">下发</button>
				<button :disabled="!checkedState" :class="{'active':!checkedState}" @click="endAnswer()">结束答题</button><i class="iconfont icon-guanbi1 close"
				 @click="back()"></i>
			</div>
			<div class="zmj_answerStudentList">
				<ul class="zmj_answerWhole" v-if="pattern">
					<li v-for="(item,index) in remember" :key="index" :class="{'active':signRemember.indexOf(item.device)!=-1 || signRemember.indexOf(item.id)!=-1 }" :id="item.id"
					 @click="studentResult($event,item.id,item.name,'')">
						<img v-if="item.sex=='男'" src="../../assets/img/boy.png" alt="">
						<img v-if="item.sex=='女'" src="../../assets/img/girl.png" alt="">
						<p v-text="item.name"></p>
					</li>
				</ul>
				<div v-if="!pattern" class="zmj_groupStudent">
					<div v-for="i in groupStudent" :key="i.id">
						<p v-text="i.name"></p>
						<div class="clearfix">
							<ol class="fl clearfix">
								<li :class="{'active':signRemember.indexOf(i.groupLeader.device)!=-1 || signRemember.indexOf(i.groupLeader.id)!=-1}" @click="studentResult($event,i.groupLeader.id,i.groupLeader.name,i.name)">
									<img v-if="i.groupLeader.sex=='男'" src="../../assets/img/boy.png" alt="">
									<img v-if="i.groupLeader.sex=='女'" src="../../assets/img/girl.png" alt="">
									<p v-text="i.groupLeader.name"></p>
								</li>
							</ol>
							<ul class=" fl clearfix">
								<li v-for="item in i.studentList" :key="item.id" :class="{'active':signRemember.indexOf(item.device)!=-1 || signRemember.indexOf(item.id)!=-1 }"
								 @click="studentResult($event,item.id,item.name,i.name)">
									<img v-if="item.sex=='男'" src="../../assets/img/boy.png" alt="">
									<img v-if="item.sex=='女'" src="../../assets/img/girl.png" alt="">
									<p v-text="item.name"></p>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="zmj_xaifaBox" v-if="studentResultState">
			<div class="zmj_studentResult">
				<div class="resultTitle clearfix"><span><i v-text="groupName" v-if="groupName.length>0"></i> <i v-text="studentName"
						 v-if="xiaFaMode==1 || pattern==true"></i>答题成绩</span><span @click="closeResult()"><img src="../../assets/img/close.svg"
						 alt=""></span></div>
				<div class="zmj_resultTable">
					<table class="resultTable" border="0" cellspacing="0" cellpadding="0">
						<thead>
							<tr>
								<td>题号</td>
								<td>分数</td>
								<td>得分数</td>
								<td>正确答案</td>
								<td>答案</td>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(i,index) in studentScore" :key="index">
								<td v-text="i.datamark" :class="{'true':i.result==1,'error':i.result==0 || i.result==null}"></td>
								<td v-text="i.score"></td>
								<td v-text="i.result==0 || i.result==null ?0:i.score"></td>
								<td v-text="i.true_answer"></td>
								<td v-text="i.answer"></td>
							</tr>
						</tbody>
					</table>
				</div>

			</div>
		</div>
		<div class="zmj_xaifaBox" v-show="xaifaFrame">
			<div class="zmj_xaifa">
				<div class="zmj_resourceTitle clearfix"><span>下发</span><span @click="closeChooseStudent()"><img src="../../assets/img/close.svg"
						 alt=""></span></div>
				<div class="zmj_xaifaList">
					<div class="choose clearfix">
						<label for="allGroupLeaderChecked" @click="allGroupLeaderChecked()" v-show="xiaFaMode==0"><input type="checkbox"
							 id="allGroupLeaderChecked"><i class="iconfont icon-fuxuankuang_weixuanzhong"></i>全选</label>
						<label for="allGroupChecked" @click="allGroupChecked()" v-show="xiaFaMode==1"><input type="checkbox" id="allGroupChecked"><i
							 class="iconfont icon-fuxuankuang_weixuanzhong"></i>全选</label>
						<div class="select" @mouseover="showSelect()" @mouseout="hideSelect()">
							<p><i class="iconfont icon-zuchangzuoda_moren"></i>组长作答</p>
							<ul>
								<li @click="chooseMode(0)"><i class="iconfont icon-zuchangzuoda_moren"></i>组长作答</li>
								<li @click="chooseMode(1)"><i class="iconfont icon-quanzujiaoxue_moren"></i>全组作答</li>
							</ul>
						</div>
					</div>
					<div>
						<ul class="groupLeader group clearfix" v-show="xiaFaMode==0">
							<li v-for="(i,index) in groupStudent" :key="i.id" class="clearfix">
								<div class="fl groupName"><label><input type="checkbox" @click="checkedGroupLeader(index)"><i class="iconfont icon-fuxuankuang_weixuanzhong"></i><span
										 v-text="i.name"></span></label></div>
								<div class="fr studentInfo">
									<img v-if="i.groupLeader.sex=='女'" src="../../assets/img/girl.png" alt="">
									<img v-if="i.groupLeader.sex=='男'" src="../../assets/img/boy.png" alt="">
									<p v-text="i.groupLeader.name"></p>
								</div>
							</li>
						</ul>
						<div class="zmj_teamMember group" v-show="xiaFaMode==1">
							<div v-for="(i,d) in groupStudent" :key="i.id" class="zmj_allGroup">
								<p><label :for="'teamMember'+i.id" @click="checkedGroup(d)"><input type="checkbox" :id="'teamMember'+i.id"><i
										 class="iconfont icon-fuxuankuang_weixuanzhong"></i><span v-text="i.name"></span></label></p>
								<div class="clearfix">
									<ol class=" fl clearfix">
										<li>
											<img v-if="i.groupLeader.sex=='男'" src="../../assets/img/boy.png" alt="">
											<img v-if="i.groupLeader.sex=='女'" src="../../assets/img/girl.png" alt="">
											<p v-text="i.groupLeader.name"></p>
											<span><label :for="'teamMember'+i.groupLeader.id" @click="checkedStudent(d,-1)"><input type="checkbox" :id="'teamMember'+i.groupLeader.id"><i
													 class="iconfont icon-chengyuan_weixuanzhong"></i></label></span>
										</li>
									</ol>
									<ul class="fl clearfix">
										<li v-for="(item,index) in i.studentList" :key="item.id">
											<img v-if="item.sex=='男'" src="../../assets/img/boy.png" alt="">
											<img v-if="item.sex=='女'" src="../../assets/img/girl.png" alt="">
											<p v-text="item.name"></p>
											<span><label :for="'teamMember'+item.id" @click="checkedStudent(d,index)"><input type="checkbox" :id="'teamMember'+item.id"><i
													 class="iconfont icon-chengyuan_weixuanzhong"></i></label></span>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="zmj_xaifaBtn">
					<button v-if="xiaFaMode==0" @click="groupLeaderBtn()">下发</button>
					<button v-if="xiaFaMode==1" @click="allGroupBtn()">下发</button>
				</div>
			</div>
		</div>
		<div class="commonTitle"></div>
		<div class="zmj_xaifaBox" v-if="sucessTitleState">
			<div class="sucessTitle">
				<i class="iconfont icon-chenggong"></i>
				<span>下发成功</span>
			</div>
		</div>
		<div class="minimizeResources" @click="min()">
			<i class="iconfont icon-zuixiaohua"></i>
		</div>
	</div>
</template>

<script>
	import $ from "jquery"
	import {
		mapState
	} from "vuex";

	export default {
		name: "StudentAnswers",
		data() {
			return {
				textData: {}, //试题
				textDataLength: 1, //试题数量
				showIndex: 0, //默认显示试题下标
				yuntishiScroll:0,//控制云试题滑动
				signRemember: [], //已作答学生列表
				checkedState: false, //按钮选中状态
				lowerHairState: false, //结束答题后才能查看详情
				recordId: "", //下发记录id
				timer: "", //查看谁作答定时器,
				isFirstEnter: false,
				studentResultState: false, //查看某个学生成绩弹框
				studentName: "", //学生名字
				groupName: "", //组名
				groupStudent: [], //分组学生
				xiaFaMode: 0, //默认组长模式
				xaifaFrame: false, //下发弹框
				sucessTitleState: false, //下发成功提示框
				groupLeader: [], //选中的组长
				allStudent: [], //选中的学生
				studentScore: [], //学生成绩,
				resourceName:"" //资源名字
			}
		},
		computed: {
			...mapState({
				userId: state => state.state.userId,
				resourceId: state => state.state.resourceId,
				remember: state => state.state.remember,
				pattern: state => state.state.pattern,
				classRecord: state => state.state.classRecord,
				testType: state => state.state.testType,
				groupId: state => state.state.groupId,
				imgUrl:state => state.state.imgUrl,
				imgType:state => state.state.imgType,
				imgAnswer:state => state.state.imgAnswer,
			}),
			

		},
		sockets: {
			small() {
				this.smallSize();
			},
			middle() {
				this.middleSize();
			},
			big() {
				this.bigSize();
			},
			nextQuestion() {
				this.nextTest();
			},
			prevQuestion() {
				this.prevTest();
			},
			testImgLook(data) {
				this.lookImg(data);
			},
			ToggleHide() {
				this.hideStudentList();
			},
			ToggleShow() {
				this.showStudentList();
			},
			closeStudentAnswers() {
				this.back();
			},
			xiafahomework() {
				this.lowerHair();
			},
			stopAnswer() {
				this.endAnswer();
			},
			datiInfo() {
				this.lookSituation();
			},
			watchStudetail(data) {
				this.resultTable(data[0], data[1], data[2]);
			},
			closestrscorewindow() {
				this.closeResult();
			},
			minimizeTest() {
				this.min();
			},
			groupMode(data) {
				this.chooseMode(data);
			},
			allGroupLeaderChecked(data) {
				this.allGroupLeaderCheckedFun(data);
			},
			checkedGroupLeader(data) {
				this.checkedGroupLeaderFun(data[0],data[1]);
			},
			groupLeaderBtn() {
				this.groupLeaderBtn();
			},
			allGroupChecked(data) {
				this.allGroupCheckedFun(data);
			},
			checkedGroup(data) {
				this.checkedGroupFun(data[0],data[1]);
			},
			checkedStudent(data) {
				this.checkedStudentFun(data[0], data[1],data[2]);
			},
			allGroupBtn() {
				this.allGroupBtn();
			},
			closeChooseStudent(){
				this.closeChooseStudent();
			},
			groupMode(data){
				this.chooseMode(data);
			},
			yunshitiziyuanScrollxia(){
				this.yunshitiMove("bottom");
			},
			yunshitiziyuanScrollshang(){
				this.yunshitiMove("top");
			},
			xueshengliebiaoScroll(data){
				var conheight = $(".zmj_answerStudentList").height();
				$(".zmj_answerStudentList").scrollTop(data* conheight);
			},
			gerenchengjiScroll(data){
				var conheight = $(".zmj_resultTable").height();
				$(".zmj_resultTable").scrollTop(data* conheight);
			},
			testDetailListScroll(data){
				var conheight = $(".zmj_groupStudent").height();
				$(".zmj_answerStudentList").scrollTop(data* conheight);
			}
			
		},
		methods: {
			back() {
				if(!this.checkedState){
				    this.$router.back();
				}else{
					this.error("请先结束答题");
				};
			},
			min() {
				if(this.testType==1){
					sessionStorage.setItem("resourceId", this.resourceId);
				}else{
					 sessionStorage.setItem("paizhaoUrl", this.imgUrl);
				};
	
				$(this.$parent.$refs.indexItem).append(
					"<li id='testMax'><div><i class='iconfont icon-quanping'></i><p>试题</p></div></li>");
				this.$router.push({
					"name": "Resourceslist"
				});

			},
			closeResult() { //关闭查看学生答题情况弹框
				this.studentResultState = false;
			},
			closeChooseStudent() { //关闭选择小组弹框
				this.xaifaFrame = false;
			},
		    yunshitiMove(direction){  //云试题左侧滚动条
				if (direction == "top") {
					this.yuntishiScroll += 20;
				} else if (direction == "bottom" && this.yuntishiScroll > 0) {
					this.yuntishiScroll += -20;
				};
				$('.zmj_answerTest ul').scrollTop(this.yuntishiScroll);
			},
			showSelect() { //切换模式
				$(".zmj_xaifaList .select ul").show();
			},
			hideSelect() {
				$(".zmj_xaifaList .select ul").hide();
			},
			chooseMode(index) { //选择模式
				this.xiaFaMode = index;
				$(".zmj_xaifaList .select ul").hide();
				$(".zmj_xaifaList .select p").html($(".zmj_xaifaList .select ul li").eq(index).html());
			},
			groupLeaderBtn() { //组长模式下发
				var that = this;
				that.groupLeader = [];
				$(".groupLeader li").each(function(index) {
					if ($(".groupLeader li").eq(index).find("input").prop("checked")) {
						that.groupLeader.push(that.groupStudent[index].groupLeader);
					};
				});
				if (that.groupLeader.length == 0) {
					this.error("请先选择小组");
				} else {
					this.xaifaFrame = false;
					this.xiafaCommon(this.groupLeader);
				};
			},
			allGroupBtn() {
				var that = this;
				that.allStudent = [];
				$(".zmj_allGroup").each(function(index) {
					$(".zmj_allGroup").eq(index).find("li input").each(function(i) {
						if ($(".zmj_allGroup").eq(index).find("li").eq(i).find("input").prop("checked")) {
							if (i == 0) {
								that.allStudent.push(that.groupStudent[index].groupLeader);
							} else {
								that.allStudent.push(that.groupStudent[index].studentList[i - 1]);
							};

						};
					});
				});
				if (that.allStudent.length == 0) {
					this.error("请先选择小组");
				} else {
					this.xaifaFrame = false;
					this.xiafaCommon(this.allStudent);
				};
			},
			checkedGroupLeader(index) { //组长作答
				var check = $(".groupLeader li").eq(index).find("input").prop("checked");
				this.checkedGroupLeaderFun(index, check);
			},
			checkedGroupLeaderFun(index, check) {
				if (check) {
					$(".groupLeader li").eq(index).addClass("active");
				} else {
					$(".groupLeader li").eq(index).removeClass("active");
				};
				if ($(".groupLeader li input:checked").length == $(".groupLeader li").length) {
					$("#allGroupLeaderChecked").prop("checked", true);
				} else {
					$("#allGroupLeaderChecked").prop("checked", false);
				};

			},

			allGroupLeaderChecked() { //全选组长
				var check = $("#allGroupLeaderChecked").prop("checked");
				this.allGroupLeaderCheckedFun(check);
			},
			allGroupLeaderCheckedFun(check) {
				$("#allGroupLeaderChecked").prop("checked",check);
				$(".groupLeader li").each(function(index, item) {
					$(".groupLeader li").eq(index).find("input").prop("checked", check);
					if (check) {
						$(".groupLeader li").eq(index).addClass("active");
					} else {
						$(".groupLeader li").eq(index).removeClass("active");
					};
				});
			},


			allGroupChecked() { //全选组员
				var check = $("#allGroupChecked").prop("checked");
				this.allGroupCheckedFun(check);
			},
			allGroupCheckedFun(check) {
				$("#allGroupChecked").prop("checked",check);
				$(".zmj_teamMember p").each(function(index) {
					$(".zmj_teamMember p").eq(index).find("input").prop("checked", check);
				});
				$(".zmj_teamMember li").each(function(index, item) {
					$(".zmj_teamMember li").eq(index).find("input").prop("checked", check);
					if (check) {
						$(".zmj_teamMember li").eq(index).addClass("active");
					} else {
						$(".zmj_teamMember li").eq(index).removeClass("active");
					};
				});
			},

			checkedStudent(i, index) { //选择组员
				var check = $(".zmj_allGroup").eq(i).find("li").eq(index + 1).find("input").prop("checked");
                this.checkedStudentFun(i, index, check);
			},
			checkedStudentFun(i, index, check) {
				if (check) {
					$(".zmj_allGroup").eq(i).find("li").eq(index + 1).addClass("active");
				} else {
					$(".zmj_allGroup").eq(i).find("li").eq(index + 1).removeClass("active");
				};

				if ($(".zmj_allGroup").eq(i).find("li input:checked").length == $(".zmj_allGroup").eq(i).find("li").length) {
					$(".zmj_allGroup").eq(i).find("p input").prop("checked", true);
				} else {
					$(".zmj_allGroup").eq(i).find("p input").prop("checked", false);
				};
				if ($(".zmj_teamMember li input:checked").length == $(".zmj_teamMember li").length) {
					$("#allGroupChecked").prop("checked", true);
				} else {
					$("#allGroupChecked").prop("checked", false);
				};
			},

			checkedGroup(index) { //选择小组（包括组员）
				var check = $(".zmj_allGroup").eq(index).find("p input").prop("checked");
				this.checkedGroupFun(index,check);
			},
			checkedGroupFun(index,check){
				$(".zmj_allGroup").eq(index).find("p input").prop("checked",check);
				$(".zmj_allGroup").eq(index).find("li input").each(function(item) {
					$(".zmj_allGroup").eq(index).find("li input").eq(item).prop("checked", check);
					if (check) {
						$(".zmj_allGroup").eq(index).find("li").eq(item).addClass("active");
					} else {
						$(".zmj_allGroup").eq(index).find("li").eq(item).removeClass("active");
					};
				});
				if ($(".zmj_teamMember li input:checked").length == $(".zmj_teamMember li").length) {
					$("#allGroupChecked").prop("checked", true);
				} else {
					$("#allGroupChecked").prop("checked", false);
				};
				
			},
			
			getTextData() { //获取试题
				this.$http.get(this.configure.resourceIp + '/teacher/import/getQuestionInfo.do?hid=' + this.resourceId).then(
					(res)=>{
						if (res.data.ret == 200) {
							this.textData = res.data.data;
							this.textDataLength = res.data.data.total;
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
			lowerHair() { //下发
				if (this.pattern) {
					const that = this;
					let userList = [];
					let jsondata = {};
					for (var i = 0; i < this.remember.length; i++) {
						let studentobj = {};
						studentobj.userId = this.remember[i].id;
						studentobj.deviceName = this.remember[i].device;
						studentobj.realname = this.remember[i].name;
						userList.push(studentobj);
					};
					if (this.testType == 1) { //type=1表示是试卷类型
						jsondata = {
							'resourceId': this.resourceId,
							'resourceUrl': "",
							'teacherId': this.userId + "",
							'userList': userList,
							"answer": this.textData.data,
							"type": "1",
							"classRecordId": this.classRecord,
							"resourceName": this.resourceName,
							"ticount": this.textData.count,
							"titotal": this.textData.total,
							"answerType": 1
						};
					} else {
						jsondata = {
							'resourceId': "",
							'resourceUrl':this.imgUrl,
							'teacherId': this.userId + "",
							'userList': userList,
							"answer": this.imgAnswer,
							"type": "3",
							"classRecordId": this.classRecord,
							"resourceName": "自主创题",
							"titotal":1,
							"answerType":1
						};
					};

					this.$http.post("http://127.0.0.1:3000/jeic/api/sendRecord", {
						jsonData: jsondata
					}).then(function(res) {
						if (res.data.ret == 200) {
							that.recordId = res.data.data;
							that.$socket.emit('jeic', {
								'name': "recordId",
								'data': res.data.data
							});
							that.checkedState = true;
							that.$store.dispatch("getRecordId", res.data.data);
							that.$store.dispatch("getModel", 1);
						};
					});
					this.timer = setInterval(function() { //查询有谁作答
						that.$http.get("http://127.0.0.1:3000/jeic/api/sendRecord/getAnsweredList").then(function(res) {
							if (res.data.ret == 200) {
								that.signRemember = res.data.data;
								that.$socket.emit('jeic', {
									'name': "dati",
									'data': res.data.data
								});
							};
						});
					}, 1000);

				} else {
					this.xiaFaMode = 0;
					this.xaifaFrame = true;
					$("#allGroupLeaderChecked").prop("checked", true);
					$(".groupLeader li").each(function(index) {
						$(".groupLeader li").eq(index).find("input").prop("checked", true);
						$(".groupLeader li").eq(index).addClass("active");
					});
					$("#allGroupChecked").prop("checked", true);
					$(".zmj_teamMember p").each(function(index) {
						$(".zmj_teamMember p").eq(index).find("input").prop("checked", true);
					});
					$(".zmj_teamMember li").each(function(index, item) {
						$(".zmj_teamMember li").eq(index).find("input").prop("checked", true);
						$(".zmj_teamMember li").eq(index).addClass("active");
					});
				};



			},
			xiafaCommon(student) { //下发公用函数
				const that = this;
				let deviceArr=[];
				let idArr=[];
				let userList = [];
				let jsondata = {};
				for (var i = 0; i < student.length; i++) {
					let studentobj = {};
					studentobj.userId = student[i].id;
					studentobj.deviceName = student[i].device;
					deviceArr.push(student[i].device);
					idArr.push(student[i].id);
					studentobj.realname = student[i].name;
					userList.push(studentobj);
				};

				var answerType;
				var model;
				if (this.xiaFaMode) {
					answerType = 3;
					model = 3;
				} else {
					answerType = 2;
					model = 2;
				};
				if (this.testType == 1) { //type=1表示是试卷类型
					jsondata = {
						'resourceId': this.resourceId,
						'resourceUrl': "",
						'teacherId': this.userId + "",
						'userList': userList,
						"answer": this.textData.data,
						"type": "1",
						"classRecordId": this.classRecord,
						"resourceName": this.resourceName,
						"ticount": this.textData.count,
						"titotal": this.textData.total,
						"answerType": answerType,
						"teachingGroupId":this.groupId
					};
				} else {
					jsondata = {
						'resourceId': "",
						'resourceUrl':this.imgUrl,
						'teacherId': this.userId + "",
						'userList': userList,
						"answer": this.imgAnswer,
						"type": "3",
						"classRecordId": this.classRecord,
						"resourceName": "自主创题",
						"titotal":1,
						"answerType": answerType,
						"teachingGroupId":this.groupId
					};
				};
           
				this.$http.post("http://127.0.0.1:3000/jeic/api/sendRecord", {
					jsonData: jsondata
				}).then(function(res) { //下发
					if (res.data.ret == 200) {
						that.recordId = res.data.data;
						that.$socket.emit('jeic', {
							'name': "recordId",
							'data': res.data.data
						});
						that.checkedState = true;
						that.$store.dispatch("getRecordId", res.data.data);
						that.$store.dispatch("getModel", model);
						that.sucessTitleState = true;
						setTimeout(function() {
							that.sucessTitleState = false;
						}, 1500);
					};
				});
				var device=[];
				this.timer = setInterval(function() { //查询有谁作答
					that.$http.get("http://127.0.0.1:3000/jeic/api/sendRecord/getAnsweredList").then(function(res) {
						if (res.data.ret == 200) {
							var signRemember = res.data.data;
								for (var i=0;i<signRemember.length;i++){
									if(deviceArr.indexOf(signRemember[i])!=-1 || idArr.indexOf(signRemember[i])!=-1 ){
									     if(device.indexOf(signRemember[i])==-1){
									     	   device.push(signRemember[i]);
									     };
									    	
									};
								}
							that.signRemember= device;
							that.$socket.emit('jeic', {
								'name': "dati",
								'data': that.signRemember
							});
						};
					});
				}, 1000);
			},


			endAnswer() { //结束答题
				const that = this;
				this.checkedState = false;
				this.lowerHairState = true;
				clearInterval(that.timer);
				this.$http.get("http://127.0.0.1:3000/jeic/api/sendRecord/stopAnswer?recordId=" + this.recordId).then(function(
					res) {
				});
			},
			lookSituation() { //查看学生情况
				if (!this.lowerHairState) {
					this.error("请先答题");
				} else {
					this.$router.push({
						"name": "AnswerStatistics"
					});
				};
			},
			getStudentList() { //获取分组学生
				var that = this;
				this.$http.get("http://127.0.0.1:3000/jeic/api/teachingGroup/" + this.groupId).then(function(
					res) {
					if (res.data.ret == 200) {
						that.groupStudent = res.data.data.userGrouplist;
						
					};
				});

			},
			studentResult(event, id, name, groupName) { //查看某个学生答题结果
				if (this.checkedState) {
					this.error("请先结束答题再查看");
				} else if (!$(event.target).hasClass('active')) {
					this.error(name + "未答题");
				} else {
					this.resultTable(id, name, groupName);
				};
			},
			resultTable(id, name, groupName) { //个人结果数据
				this.studentName = name;
				if (groupName) {
					this.groupName = groupName;
				};
				var that = this;
				this.$http.get("http://localhost:3000/jeic/api/answerResult/getDataByUserId?recordId=" + this.recordId + "&userId=" +
					id).then(function(res) {
					if (res.data.ret == 200) {
						that.studentScore = res.data.data.list;
                        if(that.studentScore){
							that.studentResultState = true;
						};
					};
				});
			},
			lookImg(imgSrc) { //点击图片放大
				this.$router.push({
					name: 'picShow',
					params: {
						imgsrc: imgSrc
					}
				});
			}
		},

		activated() {
			if (this.$route.meta.reload || this.isFirstEnter) {
				this.resourceName=this.$route.params.resourceName;
				this.showIndex = 0;
				this.lowerHairState = false;
				this.checkedState = false;
				this.signRemember = [];
				if(this.testType==1){
					this.getTextData();
				}else{
					this.textDataLength=1;
				};
				if(!this.pattern){
					this.getStudentList();
				};
			};
			this.$route.meta.reload =true;
			this.isFirstEnter = false;

		},
		created() {
			this.isFirstEnter = true;
		},
		mounted() {
			var that = this;
			$(".zmj_answerTest").on("click", "img", function() {
				var imgSrc = $(this).attr("src");
				that.lookImg(imgSrc);
			});
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

	.zmj_answerTest ul,.imgType {
		font-size: 3rem;
		position: absolute;
		top: 5rem;
		bottom: 5rem;
		left: 0;
		right: 0;
		padding: 0 2rem;
		overflow-y: auto;
	}
    .imgType img{
    	width: 90%;
    	text-align: center;
    	margin: 0 auto;
    	
    }
	.zmj_answerTest img {
		max-width: 80%;
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
	}

	.zmj_answerWhole li.active {
		opacity: 1;
		cursor: pointer;
	}

	.zmj_answerWhole li img {
		width: 100%;
		pointer-events: none;
	}
    .zmj_answerWhole li p {
    	pointer-events: none;
    }
	.minimizeResources {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 3rem;
		height: 2.6rem;
		padding-top: .4rem;
		display: inline-block;
		background: #fff;
		border-radius: .3rem;
		box-shadow: -1px 1px 20px 4px #1296db;
		border: 0;
		z-index: 1;
		cursor: pointer;
	}

	.minimizeResources i {
		font-size: 3rem;
		color: #1296db;
	}

	.zmj_studentResult {
		width: 80rem;
		height: 40rem;
		background: #fff;
		border-radius: .5rem;
		position: absolute;
		top: 4rem;
		left: 0;
		right: 0;
		margin: 0 auto;
		overflow: hidden;
	}

	.resultTitle {
		height: 5.6rem;
		line-height: 5.6rem;
		padding: 0 2rem;
		border-bottom: .1rem solid rgba(1, 1, 1, 0.3);
		background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#E8E6E7), to(#D2D0D3), color-stop(0.5, #dbd9dc));
	}

	.resultTitle span:first-child {
		color: #666;
		font-size: 1.6rem;
		padding: .8rem 1rem;
		border: .1rem solid #a3a1a4;
		border-radius: .8rem;
		background: #fff;

	}

	.resultTitle span:last-child {
		width: 2.4rem;
		height: 2.4rem;
		text-align: center;
		line-height: 2.4rem;
		background: #fff;
		border-radius: 50%;
		margin-top: 1.6rem;
		overflow: hidden;
		display: inline-block;
		float: right;
		cursor: pointer;

	}

	.resultTitle span:last-child img {
		width: 100%;
		height: 100%;
	}

	.zmj_resultTable {

		height: 34.3rem;
		overflow-y: auto;
	}

	.resultTable {
		width: 100%;
		font-size: 2rem;
		color: #333;
	}

	.resultTable thead td {
		height: 5rem;
		line-height: 5rem;
	}

	.resultTable tbody {
		height: 29rem;

	}

	.resultTable tbody td {
		height: 4rem;
		line-height: 4rem;
	}

	.resultTable tr td {
		text-align: center;
		border-bottom: .1rem solid #ddd;
	}

	.resultTable tr td.error {
		border-left: .5rem solid red
	}

	.resultTable tr td.true {
		border-left: .5rem solid green
	}

	.zmj_groupStudent>div {
		font-size: 1.6rem;
		color: #fff;
		padding: 1.2rem;
		border-bottom: .3rem dashed #4092f4;
	}

	.zmj_groupStudent ol {
		width: 22%;
	}

	.zmj_groupStudent ul {
		width: 78%;
	}

	.zmj_groupStudent li {
		text-align: center;
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
		pointer-events: none;
	}

	.zmj_groupStudent li p {
		font-size: 1.4rem;
		color: #fff;
		text-align: center;
		margin-top: .8rem;
		pointer-events: none;
	}



	.zmj_xaifaBtn {
		height: 5.5rem;
		line-height: 5.5rem;
		text-align: center;
		border-top: .1rem solid #ddd;
	}

	.zmj_xaifaList {
		height: 23.6rem;
		padding: 0 1.6rem;
		overflow-y: auto;
	}

	.zmj_xaifaList .choose {
		margin-top: .8rem;
	}

	.zmj_xaifaList label {
		font-size: 1.6rem;
		cursor: pointer;
	}

	.zmj_xaifaList label input[type=checkbox] {
		visibility: hidden;
	}

	.zmj_xaifaList label .iconfont {
		color: #ccc;
		font-size: 1.6rem;
		margin-right: .5rem;
	}

	.zmj_xaifaList label input[type=checkbox]:checked+.iconfont {
		color: #4092f4;
	}

	.zmj_xaifaList .choose .select {
		width: 12rem;
		height: 2.8rem;
		font-size: 1.4rem;
		text-align: center;
		line-height: 2.8rem;
		background: #fafafa;
		border: .1rem solid #ccc;
		border-radius: 1.4rem;
		background: url("../../assets/img/down-trangle.png") no-repeat center right .5rem;
		float: right;
		position: relative;
		cursor: pointer;
	}


	.zmj_xaifaList .choose .select p {
		width: 100%;
		height: 100%;
	}

	.zmj_xaifaList .choose .select p .iconfont {
		font-size: 1.4rem;
		color: #4092f4;
		margin-right: .6rem;
	}

	.zmj_xaifaList .choose .select ul {
		width: 12rem;
		height: 7rem;
		background: #fff;
		box-shadow: 0 .1rem 1.6rem 0 rgba(0, 0, 0, 0.29);
		border-radius: 1rem;
		position: absolute;
		top: 2.9rem;
		z-index: 2;
		display: none;
		overflow: hidden;
	}

	.zmj_xaifaList .choose .select ul li {
		font-size: 1.4rem;
		height: 3.5rem;
		line-height: 3.5rem;
		cursor: pointer;
	}

	.zmj_xaifaList .choose .select ul li .iconfont {
		font-size: 1.4rem;
		color: #acacac;
		margin-right: .6rem;
	}

	.zmj_xaifaList .choose .select ul li:hover {
		background: #4092f4;
	}

	.group li {
		text-align: center;
		margin-top: 2rem;
		float: left;
		opacity: 0.3;
	}

	.group li.active {
		opacity: 1;
	}

	.group li .groupName {
		margin-top: 1.6rem;
	}

	.group li img {
		width: 4.5rem;
		height: 4.5rem;
	}

	.group li p {
		width: 6.5rem;
		height: 2.1rem;
		text-align: center;
		line-height: 2.1rem;
		font-size: 1.4rem;
		color: #fff;
		text-align: center;
		background: #4092f4;
		border-radius: 1rem 0 1rem 0;
	}

	.zmj_teamMember .zmj_allGroup>div {
		margin-left: 2rem;
		margin-bottom: 1rem;
	}

	.zmj_teamMember ol {
		width: 15%;
	}

	.zmj_teamMember ul {
		width: 85%;
	}

	.zmj_teamMember ul li {
		margin-right: 2rem;
	}

	.zmj_teamMember li {
		position: relative;
	}

	.zmj_teamMember li span {
		position: absolute;
		top: 0rem;
		right: -0.2rem;

	}

	.zmj_xaifaBox {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		background: rgba(0, 0, 0, 0.4);
		z-index: 2;
	}

	.zmj_xaifa {
		width: 76rem;
		height: 35rem;
		background: #fff;
		border-radius: 1.4rem;
		position: absolute;
		top: 6rem;
		left: 0;
		right: 0;
		margin: 0 auto;
		z-index: 3;
		overflow: hidden;
	}

	.zmj_resourceTitle {
		height: 5.6rem;
		line-height: 5.6rem;
		padding: 0 2rem;
		border-bottom: .1rem solid rgba(1, 1, 1, 0.3);
		background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#E8E6E7), to(#D2D0D3), color-stop(0.5, #dbd9dc));
	}

	.zmj_resourceTitle span:first-child {
		color: #666;
		font-size: 1.6rem;
		padding: .8rem 1rem;
		border: .1rem solid #a3a1a4;
		border-radius: .8rem;
		background: #fff;

	}

	.zmj_resourceTitle span:last-child {
		width: 2.4rem;
		height: 2.4rem;
		text-align: center;
		line-height: 2.4rem;
		background: #fff;
		border-radius: 50%;
		margin-top: 1.6rem;
		overflow: hidden;
		display: inline-block;
		float: right;
		cursor: pointer;

	}

	.zmj_resourceTitle span:last-child img {
		width: 100%;
		height: 100%;
	}

	.zmj_xaifaBtn {
		height: 5.5rem;
		line-height: 5.5rem;
		text-align: center;
		border-top: .1rem solid #ddd;
	}

	.zmj_xaifaList {
		height: 23.6rem;
		overflow-y: auto;
	}

	.zmj_xaifaBtn button {
		width: 15rem;
		height: 3.5rem;
		color: #fff;
		font-size: 1.6rem;
		border-radius: 2rem;
		border: none;
		outline: none;
		background: #4092f4;
		cursor: pointer;
	}

	.sucessTitle {
		width: 25rem;
		height: 14rem;
		text-align: center;
		border-radius: .4rem;
		background: #fff;
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		z-index: 4;
	}

	.sucessTitle .iconfont {
		font-size: 4.8rem;
		color: #4092f4;
		margin-top: 3rem;
		display: block;
	}

	.sucessTitle span {
		font-size: 1.6rem;
		margin-top: 1rem;
	}
	
</style>
