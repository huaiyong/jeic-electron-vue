<template>
	<div class="wrapper">
		<!--查看学生作答详情弹框 这种-->
		<div class="studentResultPopup">
			   <h4>学生答题正确率</h4>
				<div class="studentResultTable">
					 <table>
						<thead>
							 <tr>
								 <th>姓名</th>
								 <th>对的题数</th>
								 <th>错的题数</th>
								 <th>正确率</th>
								 <th>掌握程度</th>
							 </tr>
						</thead>
						<tbody>
							<tr v-for="name in names">
								<td>{{name.realname}}</td>
								<td>{{name.trueCount}}</td>
								<td>{{name.falseCount}}</td>
								<td>{{name.accuracy*100 | toFixed(2) }}</td>
								<td><img alt=""></td>
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
	import {
		mapState
	} from "vuex";
	
	export default({
		name:"rankingStatistics",
		data(){
			return {
				names:[]
			}
		},
		methods:{
			back(){
				this.$router.back();
			}
		},
		computed: {
			...mapState({
				recordId: state => state.state.recordId
			})
		},
		created() {
			var that=this
			this.$http.get("http://127.0.0.1:3000/api/getDataGroupByUser?recordId="+this.recordId+'&type=1').then(function(res) {
				console.log(res.data.data)
				that.names=res.data.data.answerResultList;
			});
		}
	})
</script>

<style  scoped>
	.wrapper{
		color:#fff;
		position: relative;
		z-index: 2;
		width: 100%;
		height: 100%;
	}
	.backLast{
		background: none;
		color:#fff;
		border:0;
		font-size:3rem;
		position: absolute;
		bottom:3rem;
		left:3rem;
	}
	
	.studentResultPopup{
		position: absolute;
		top: 0;
		bottom: 0;
		left:0;
		right: 0;
		background:#dde7eb;
		overflow-y: auto;
	}
	.studentResultPopup h4{
		height: 100px;
		line-height: 100px;
		text-align: center;
		font-size: 48px;
		font-weight: bold;
		background: #525659;
	}
	.studentResultTable{
		overflow-y: auto;
	}
	.studentResultPopup table{
		width: 100%;
		
	
	}
	.studentResultPopup table tr th{
		text-align: center;
		height: 76px;
		font-size: 30px;
		color: #000;
		background: #fff;
		border-left:8px solid #dde7eb;
		border-right:8px solid #dde7eb;
		border-bottom:6px solid #dde7eb;
	}
	
	.studentResultPopup table tr th:nth-child(1){
		border-top:6px solid #fa8686;
	}
	.studentResultPopup table tr th:nth-child(2){
		border-top:6px solid #ffd229;
	}
	.studentResultPopup table tr th:nth-child(3){
		border-top:6px solid #72cbec;
	}
	.studentResultPopup table tr th:nth-child(4){
		border-top:6px solid #9badf1;
	}
	.studentResultPopup table tr th:nth-child(5){
		border-top:6px solid #87db43;
	}
	
	.studentResultPopup table tr td{
		text-align: center;
		height: 70px;
		font-size: 26px;
		color:#878787;
		border-left:8px solid #dde7eb;
		border-right:8px solid #dde7eb;
		border-top:6px solid #dde7eb;
		border-bottom:6px solid #dde7eb;
	}
	
	.studentResultPopup table tbody tr:nth-child(even){
		background: #fff;
	}
	.studentResultPopup table tbody tr:nth-child(odd){
		background: #f7f8fa;
	}
	.studentResultPopup table tbody tr:nth-child(1) td:nth-child(1){
		background: url(../../assets/img/icon_xiaohonghua.png) no-repeat 20px center;
		background-size: 32px 28px;
	}
	.studentResultPopup table tbody tr:nth-child(2) td:nth-child(1){
		background: url(../../assets/img/icon_xiaohonghua.png) no-repeat 20px center;
		background-size: 32px 28px;
	}
	.studentResultPopup table tbody tr:nth-child(3) td:nth-child(1){
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
