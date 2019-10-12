<template>
	<div class="wrapper">
		<!--查看学生作答详情弹框 这种-->
		<div class="studentResultPopup">
			<h4>学生答题正确率</h4>
			<div class="studentResultTable">
				<table>
					<thead>
						<tr>
							<th>组名</th>
							<th>姓名</th>
							<th>对的题数</th>
							<th>错的题数</th>
							<th>正确率</th>
							<th>掌握程度</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="name in names">
							<td @click="getGroupStudentRange(name.userGroupId)">{{name.userGroupName}}</td>
							<td>{{name.userName}}</td>
							<td>{{name.trueCount}}</td>
							<td>{{name.falseCount}}</td>
							<td>
								{{name.accuracy*100 | toFixed(2) }}%
							</td>
							<td>
								<img v-if="name.star==0" src="../../assets/img/grade/star_0.png">
								<img v-if="name.star==1" src="../../assets/img/grade/star_1.png">
								<img v-if="name.star==2" src="../../assets/img/grade/star_2.png">
								<img v-if="name.star==3" src="../../assets/img/grade/star_3.png">
								<img v-if="name.star==4" src="../../assets/img/grade/star_4.png">
								<img v-if="name.star==5" src="../../assets/img/grade/star_5.png">
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<span class="closefullscreen fr" @click="back()">
			<em class="iconfont icon-guanbi1 exitResTc colorfff"></em>
		</span>
	</div>
</template>

<script>
	import $ from "jquery";
	import {
		mapState
	} from "vuex";

	export default ({
		name: "getGroupStudentRange",
		data() {
			return {
				names: [],
				stulist:false
			}
		},
		sockets: {
			closestrscroce(){
				this.back();
			},
			xiaoHongHuaScroll(data){
				var conheight = $(".studentResultTable").height();
				$(".studentResultTable").scrollTop(data * conheight * 1.8);
			},
			closeGroupStudentRange(){
				this.back();
			}
		},
		methods: {
			back() {
				this.$router.back();
			},
			getParams() {
				var routerParams = this.$route.params.id; // 取到路由带过来的参数 
			
				var that = this
				this.$http.get("http://127.0.0.1:3000/jeic/api/answerResult/getDataGroupByUser?recordId=" + this.recordId +
					'&type=' + this.model + "&teachinggroupId=" + this.groupId+'&usergroupId='+routerParams).then(function(res) {
					
					that.names = res.data.data.answerResultList[0].userList;
					that.names.forEach(function(i,v){
						var ratio = parseFloat(i.accuracy * 100).toFixed(2);
						
						if (0 <= ratio && ratio < 20) {
							i.star = 0;
						} else if (20 <= ratio && ratio < 40) {
							i.star = 1;
						} else if (40 <= ratio && ratio < 60) {
							i.star = 2;
						} else if (60 <= ratio && ratio < 80) {
							i.star = 3;
						} else if (80 <= ratio && ratio < 100) {
							i.star = 4;
						} else if (ratio == 100) {
							i.star = 5;
						};
					})
				});
			},
		},
		computed: {
			...mapState({
				recordId: state => state.state.recordId,
				model: state => state.state.model,
				groupId: state => state.state.groupId
			})
		},
		created() {
			this.getParams()
		},
		watch: {
			// 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
			'$route': 'getParams',
		}
	})
</script>

<style scoped>
	.wrapper {
		color: #fff;
		position: relative;
		z-index: 2;
		width: 100%;
		height: 100%;
	}

	.backLast {
		background: none;
		color: #fff;
		border: 0;
		font-size: 3rem;
		position: absolute;
		bottom: 3rem;
		left: 3rem;
	}

	/* jdt */
	.backround {
		width: 60%;
		height: 8px;
		background: #ddd;
		position: relative;
		border-radius: 8px;
		text-align: right;
		line-height: 1rem;
	}

	.jdt {
		position: absolute;
		/* width: 3.21%; */
		height: 100%;
		background: #4092f4;
		border-radius: 8px;
	}
	
	.baifenbi{
		position: absolute;
		/* right:-20px; */
	}

	.studentResultPopup {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: #dde7eb;
		overflow-y: auto;
	}

	.studentResultPopup h4 {
		height: 100px;
		line-height: 100px;
		text-align: center;
		font-size: 48px;
		font-weight: bold;
		background: #525659;
	}

	.studentResultTable {
		overflow-y: auto;
	}

	.studentResultPopup table {
		width: 100%;


	}

	.studentResultPopup table tr th {
		text-align: center;
		height: 76px;
		font-size: 30px;
		color: #000;
		background: #fff;
		border-left: 8px solid #dde7eb;
		border-right: 8px solid #dde7eb;
		border-bottom: 6px solid #dde7eb;
	}

	.studentResultPopup table tr th:nth-child(1) {
		border-top: 6px solid #fa8686;
	}

	.studentResultPopup table tr th:nth-child(2) {
		border-top: 6px solid #ffd229;
	}

	.studentResultPopup table tr th:nth-child(3) {
		border-top: 6px solid #72cbec;
	}

	.studentResultPopup table tr th:nth-child(4) {
		border-top: 6px solid #9badf1;
	}

	.studentResultPopup table tr th:nth-child(5) {
		border-top: 6px solid #87db43;
	}

	.studentResultPopup table tr td {
		text-align: center;
		height: 70px;
		font-size: 26px;
		color: #878787;
		border-left: 8px solid #dde7eb;
		border-right: 8px solid #dde7eb;
		border-top: 6px solid #dde7eb;
		border-bottom: 6px solid #dde7eb;
	}

	.studentResultPopup table tbody tr:nth-child(even) {
		background: #fff;
	}

	.studentResultPopup table tbody tr:nth-child(odd) {
		background: #f7f8fa;
	}

	.studentResultPopup table tbody tr:nth-child(1) td:nth-child(1) {
		background: url(../../assets/img/icon_xiaohonghua.png) no-repeat 20px center;
		background-size: 32px 28px;
	}

	.studentResultPopup table tbody tr:nth-child(2) td:nth-child(1) {
		background: url(../../assets/img/icon_xiaohonghua.png) no-repeat 20px center;
		background-size: 32px 28px;
	}

	.studentResultPopup table tbody tr:nth-child(3) td:nth-child(1) {
		background: url(../../assets/img/icon_xiaohonghua.png) no-repeat 20px center;
		background-size: 32px 28px;
	}

	.closefullscreen {
		position: absolute;
		top: -1px;
		right: 0;
		width: auto;
		height: auto;
		display: inline-block;
		background: transparent;
		box-shadow: none;
		border-radius: 0;
		border: 0;
		z-index: 999;
	}

	.exitResTc {
		font-size: 3rem !important;
		opacity: 1;
		cursor: pointer;
	}
</style>

