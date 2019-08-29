<template>
	<div class="wrapper">
		<div class="classroom">
			<div class="classroom_begin" v-if="!classroomState">
				<div class="box_title">
					<span class="close_box fr" @click="close()">
						<img src="../assets/img/close.svg" alt />
					</span>
					<span class="title_box_tc">教学</span>
				</div>
				<div class="banjinianji clearfix">
					<div>
						班级:
						<select id="banjiid" v-model="checkdedClassroom" @change="selectClass(checkdedClassroom)">
							<option value="请选择班级">请选择班级</option>
							<option v-for="item in classroomList" :value="item.classId" :key="item.classId">{{item.gradeName}}</option>
						</select>
					</div>
					<div>
						科目:
						<select id="xuekeid" v-model="checkdedSubject">
							<option value="请选择科目">请选择科目</option>
							<option v-for="item in subjectList" :value="item" :key="item.subjectId">{{item.subjectName}}</option>
						</select>
					</div>
					<button class="sure_btn" @click="beginClass(checkdedClassroom,checkdedSubject.subjectId,checkdedSubject.subjectName)">开始上课</button>
				</div>
			</div>
			<div class="classroom_begin" v-if="classroomState">
				<div class="box_title">
					<span class="close_box fr" @click="close()">
						<img src="../assets/img/close.svg" alt />
					</span>
					<span class="title_box_tc">提示</span>
				</div>
				<div class="text_shadow">确认下课？</div>
				<div>
					<span class="btn surecolor" @click="endClass()">确认</span>
					<span class="btn cancelcolor" @click="close()">取消</span>
				</div>
			</div>
		</div>
		<div class="commonTitle" ref="commonTitle"></div>
	</div>
</template>

<script>
	import {
		mapState
	} from "vuex";
	export default {
		name: "Classroom",
		data() {
			return {
				classroomList: "", //班级列表
				subjectList: "", //科目列表
				checkdedClassroom: "请选择班级",
				checkdedSubject: "请选择科目"
			};
		},
		computed: {
			...mapState({
				classroomState: state => state.state.classroomState,
				userId: state => state.state.userId
			})
		},
		sockets: {
			sureBeginClass(data) {
				this.beginClass(data[0], data[1], data[2])
			},
			sureStopClass(){
				this.endClass();
			},
			closeClassroom(){
				this.close();
			}

		},
		methods: {
			selectClass(classId) {
				const that = this;
				if (classId != "请选择班级") {
					//选择班级
					this.$http
						.get(
							this.configure.jeucIp +
							"/ea/eaUserCourse/subject?uid=" +
							this.userId +
							"&cid=" +
							classId
						)
						.then(function(jdata) {
							if (jdata.data.ret == 200) {
								that.subjectList = jdata.data.data;
							}
						});
				}
			},
			beginClass(classId, subjectId, subjectName) {
				const that = this;
				if (classId == "请选择班级") {
					this.$refs.commonTitle.innerHTML = "请选择班级";
					this.$refs.commonTitle.style.display = "block";
					setTimeout(function() {
						that.$refs.commonTitle.style.display = "none";
					}, 1000);
				} else if (subjectId == "请选择科目" || subjectId == undefined) {
					this.$refs.commonTitle.innerHTML = "请选择科目";
					this.$refs.commonTitle.style.display = "block";
					setTimeout(function() {
						that.$refs.commonTitle.style.display = "none";
					}, 1000);
				} else {
					this.$http
						.get(
							this.configure.jeucIp +
							"/uc/user?classId=" +
							classId +
							"&userType=2&state=1&delFlag=0&orderBy=2"
						)
						.then(function(res) {
							if (res.data.ret == 200) {
								var remember = res.data.data.list;
								var userList = [];
								for (var i = 0; i < remember.length; i++) {
									var studentobj = {};
									studentobj.userId = remember[i].id;
									studentobj.deviceName = remember[i].deviceName;
									studentobj.realname = remember[i].realname;
									studentobj.sex = remember[i].sex;
									userList.push(studentobj);
								}
								that.$http
									.get(that.configure.jeucIp + "/ea/class/" + classId)
									.then(function(res) {
										if (res.data.ret == 200) {
											var gradeId = res.data.data.gradeId;
											var gradeName = res.data.data.gradeName;
											var classXName = res.data.data.name;
											that.$http
												.get(that.configure.jeucIp + "/uc/user/" + that.userId)
												.then(function(res) {
													if (res.data.ret == 200) {
														var jdata = res.data;
														var stuinfodata = {
															officeId: jdata.data.provinceId +
																"," +
																jdata.data.cityId +
																"," +
																jdata.data.countyId +
																"," +
																jdata.data.officeId,
															teacherId: that.userId,
															teacherName: jdata.data.realname,
															officeName: jdata.data.provinceName +
																"," +
																jdata.data.cityName +
																"," +
																jdata.data.countyName +
																"," +
																jdata.data.officeName,
															gradeId: gradeId,
															gradeName: gradeName,
															classId: classId,
															className: classXName,
															subjectId: subjectId,
															subjectName: subjectName,
															userList: userList
														};

														var stringstuinfodata = JSON.stringify(stuinfodata);

														that.$http
															.post(
																"http://127.0.0.1:3000/jeic/api/startClass/startClass", {
																	jsonData: stuinfodata
																}
															)
															.then(function(res) {
																if (res.data.ret == 200) {
																	var classRecord = res.data.data;
																	console.log(classRecord)
																	that.$http.get("http://localhost:3000/jeic/api/student?classId=" + classId).then(function(res) {
																		if (res.data.ret == 200) {
																			that.$store.dispatch("getRemember", res.data.data);
																		};
																	});
																	sessionStorage.setItem("subjectName",subjectName);
																	that.$store.dispatch("getSubjectId", subjectId);
																	that.$store.dispatch("getClassRecord", classRecord);
																	that.$socket.emit("joinRoom", {
																		"classId": classId,
																		"userId": that.userId
																	});
																	that.$socket.emit("jeic", {
																		"name": "classRecord",
																		"data": classRecord
																	});
																};
															})
															.catch(function(err) {

															});
													}
												});
										};
									});
							}
						});

					this.$store.dispatch("changeClassroomState", true);
					this.$store.dispatch("getClassId", classId);
					this.$router.push({
						name: "Index"
					});
				}
			},
			endClass() {
				this.$store.dispatch("changeClassroomState", false);
				sessionStorage.clear();
				this.$router.push({
					path: "/"
				});
			},
			close() {
				this.$router.push({
					name: "Index"
				});
			}
		},
		created() {
			const that = this;
			this.$http
				.get(this.configure.jeucIp + "/ea/eaUserCourse/class?uid=" + this.userId)
				.then(function(jdata) {
					if (jdata.data.ret == 200) {
						that.classroomList = jdata.data.data;
					}
				});
		}
	};
</script>

<style scoped="scoped">
	.classroom {
		position: absolute;
		left: 0;
		top: 2rem;
		right: 0;
		bottom: 0;
		margin: 0 auto;
		width: 40rem;
		height: 29rem;
		border: 1px solid rgba(18, 18, 18, 0.3);
		border-radius: 0.6rem;
		background: rgb(137, 137, 137);
		box-shadow: 0.1rem 0.1rem 1rem #0003;
		text-align: center;
	}

	.box_title {
		width: 100%;
		height: 5.6rem;
		line-height: 5.6rem;
		text-align: left;
		border-top-left-radius: 0.6rem;
		border-top-right-radius: 0.6rem;
		border-bottom: 0.1px solid rgba(1, 1, 1, 0.3);
		background: gradient(linear,
			0% 0%,
			0% 100%,
			from(#e8e6e7),
			to(#d2d0d3),
			color-stop(0.5, #dbd9dc));
		background: -webkit-gradient(linear,
			0% 0%,
			0% 100%,
			from(#e8e6e7),
			to(#d2d0d3),
			color-stop(0.5, #dbd9dc));
		background: -moz-linear-gradient(linear,
			0% 0%,
			0% 100%,
			from(#e8e6e7),
			to(#d2d0d3),
			color-stop(0.5, #dbd9dc));
		background: -moz-linear-gradient(55% 0% 270deg,
			#e8e6e7,
			#d2d0d3,
			#dbd9dc 98%);
	}

	.title_box_tc {
		padding: 0.8rem 1rem;
		border: 0.1rem solid #a3a1a4;
		border-radius: 0.8rem;
		color: #666;
		background: #fff;
		-moz-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
		-khtml-user-select: none;
		user-select: none;
		margin-left: 2rem;
		font-size: 1.6rem;
	}

	.close_box {
		width: 2.4rem;
		height: 2.4rem;
		display: inline-block;
		background: #fff;
		border-radius: 50%;
		line-height: 2.4rem;
		text-align: center;
		cursor: pointer;
		-moz-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
		-khtml-user-select: none;
		user-select: none;
		margin-right: 2rem;
		margin-top: 1.8rem;
		font-size: 3rem;
		box-shadow: 0.1rem 0 0.2rem rgba(0, 0, 0, 0.4);
	}

	.close_box img {
		width: 2.4rem;
		height: 2.4rem;
	}

	.banjinianji>div {
		font-size: 2rem;
		color: #fff;
	}

	.banjinianji>div select {
		width: 27rem;
		height: 4.2rem;
		margin-top: 2rem;
		padding: 0 1.5rem;
		background: #2d2d2d;
		background: rgba(45, 45, 45, 0.15);
		-moz-border-radius: 0.6rem;
		-webkit-border-radius: 0.6rem;
		border-radius: 0.6rem;
		border: 0.1rem solid #3d3d3d;
		border: 0.1rem solid rgba(255, 255, 255, 0.15);
		-moz-box-shadow: 0 0.2rem 0.3rem 0 rgba(0, 0, 0, 0.1) inset;
		-webkit-box-shadow: 0 0.2rem 0.3rem 0 rgba(0, 0, 0, 0.1) inset;
		box-shadow: 0 0.2rem 0.3rem 0 rgba(0, 0, 0, 0.1) inset;
		font-family: "PT Sans", Helvetica, Arial, sans-serif;
		font-size: 1.4rem;
		color: #fff;
		text-shadow: 0 0.1rem 0.2rem rgba(0, 0, 0, 0.1);
		-o-transition: all 0.2s;
		-moz-transition: all 0.2s;
		-webkit-transition: all 0.2s;
		outline: none;
		appearance: none;
		-moz-appearance: none;
		-webkit-appearance: none;
		cursor: pointer;
	}

	.banjinianji>div select>option {
		background: rgba(0, 0, 0, 0.3);
	}

	.screen {
		margin-top: 2rem;
	}

	.screen>div {
		width: 27rem;
		display: inline-block;
		text-align: justify;
	}

	button.sure_btn {
		cursor: pointer;
		width: 30rem;
		height: 4.4rem;
		margin-top: 2rem;
		padding: 0.5rem 1rem;
		border-radius: 8px;
		background: #ff5722;
		outline: none;
		color: #fff;
		border: 0.1rem solid #ff730e;
		-moz-box-shadow: 0 1.5rem 3rem 0 rgba(255, 255, 255, 0.25) inset,
			0 2px 7px 0 rgba(0, 0, 0, 0.2);
		-webkit-box-shadow: 0 1.5rem 3rem 0 rgba(255, 255, 255, 0.25) inset,
			0 2px 7px 0 rgba(0, 0, 0, 0.2);
		box-shadow: 0 1.5rem 3rem 0 rgba(255, 255, 255, 0.25) inset,
			0 2px 7px 0 rgba(0, 0, 0, 0.2);
		font-family: "PT Sans", Helvetica, Arial, sans-serif;
		font-size: 1.4rem;
		font-weight: 700;
		text-shadow: 0 0.1rem 0.2rem rgba(0, 0, 0, 0.1);
		-o-transition: all 0.2s;
		-moz-transition: all 0.2s;
		-webkit-transition: all 0.2s;
		-ms-transition: all 0.2s;
	}

	button:hover {
		-moz-box-shadow: 0 1.5rem 3rem 0 rgba(255, 255, 255, 0.15) inset,
			0 2px 7px 0 rgba(0, 0, 0, 0.2);
		-webkit-box-shadow: 0 1.5rem 3rem 0 rgba(255, 255, 255, 0.15) inset,
			0 2px 7px 0 rgba(0, 0, 0, 0.2);
		box-shadow: 0 1.5rem 3rem 0 rgba(255, 255, 255, 0.15) inset,
			0 2px 7px 0 rgba(0, 0, 0, 0.2);
	}

	button:active {
		-moz-box-shadow: 0 1.5rem 3rem 0 rgba(255, 255, 255, 0.15) inset,
			0 2px 7px 0 rgba(0, 0, 0, 0.2);
		-webkit-box-shadow: 0 1.5em 3rem 0 rgba(255, 255, 255, 0.15) inset,
			0 2px 7px 0 rgba(0, 0, 0, 0.2);
		box-shadow: 0 0.5rem 0.8rem 0 rgba(0, 0, 0, 0.1) inset,
			0 1px 4px 0 rgba(0, 0, 0, 0.1);
		border: 0px solid #ef4300;
	}

	.classroom input[type="radio"] {
		vertical-align: middle;
		width: 2.5rem;
		height: 2.5rem;
		margin-top: 0rem;
		background: transparent;
		border: none;
		-moz-box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.1) inset;
		-webkit-box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.1) inset;
		box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.1) inset;
		border-radius: 50%;
	}

	.text_shadow {
		text-shadow: 0.1rem.2rem.1rem #666, 0.1rem.2px 0.1rem #999;
		height: 12.4rem;
		line-height: 12.4rem;
		font-size: 2.4rem;
		color: #fff;
	}

	span.btn {
		padding: 0.8rem 2rem;
		border-radius: 0.6rem;
		margin: 2rem;
		cursor: pointer;
		box-shadow: 0.1rem 0.1rem 1rem rgba(12, 12, 12, 0.3);
		font-size: 1.6rem;
	}

	span.surecolor {
		color: #fff;
		background: #fe615c;
	}

	span.cancelcolor {
		color: #666;
		background: #ccc;
	}

	.commonTitle {
		min-width: 36.5rem;
		max-width: 54rem;
		height: 5.8rem;
		text-align: center;
		line-height: 5.8rem;
		color: #fff;
		font-size: 2rem;
		padding: 0 1.5rem;
		background: rgba(45, 45, 45, 0.8);
		border-radius: 0.6rem;
		border: 0.1rem solid rgba(255, 255, 255, 0.15);
		-webkit-box-shadow: 0 0.2rem 0.3rem 0 rgba(0, 0, 0, 0.1) inset;
		text-shadow: 0 0.1rem 0.2rem rgba(0, 0, 0, 0.1);
		-webkit-transition: all 0.2s;
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		margin: auto;
		display: none;
	}
</style>
