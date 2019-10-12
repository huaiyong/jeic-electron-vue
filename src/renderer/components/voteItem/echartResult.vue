<template>
	<div class="result">
		<div class="header">
			 结果统计
			 <i class="iconfont icon-chuyidong fr" @click="back()"></i>
		</div>
		<div class="stamp clearfix">
			<ul class="clearfix">
				<li><span></span>有效票数：<i v-text="validVotesNumber"></i></li>
				<li><span></span>无效票数：<i v-text="invalidVoteCount"></i></li>
				<li><button v-text="typeText" @click="changeTypes()"></button></li>
			</ul>
		</div>
		<div class="echart" v-show="showType==0">
			<div id="myChart" style="width:100%;height:100%;"></div>
		</div>
		<div class="tableResult" v-show="showType==1">
			<div class="table toupiao" v-if="this.$route.query.type==1">
				<div><span>选项</span><span>票数</span></div>
				<ul class="vote">
					<li v-for="i in resultData" class="clearfix">
						<span v-text="i.name"></span>
						<span v-text="i.count"></span>
					</li>
				</ul>
			</div>
			<div class="table xuanju" v-if="this.$route.query.type==2">
				<div><span>选项</span><span>票数</span><span>选项</span><span>票数</span><span>选项</span><span>票数</span></div>
				<ul class="vote">
					<li v-for="i in resultData" class="clearfix">
						<span v-text="i.name"></span>
						<span v-text="i.count"></span>
					</li>
				</ul>
			</div>
		</div>
		<div class="info" v-if="infoState">
			<div class="header">
				 结果统计
			</div>
			<div class="optionInfo">
				<div class="votes" v-text="data.count">
					
				</div>
				<p v-text="data.name">意境</p>
			</div>
			<ul class="list clearfix">
				<li v-for="(i,index) in data.voteUserList" track-by="index" v-text="i.name"></li>
			</ul>
		</div>
	</div>
</template>

<script>
	export default{
		name:"echart",
		data(){
			return{
				invalidVoteCount:null,//有效票数
				validVotesNumber:null,//无效票数，
				showType:0,//显示类型
				typeText:"查看表格",
				infoState:false  ,//结果统计状态
				resultData:null,//总数据
				data:{}//数据
					
			}
		},
		sockets: {
			votingBack(){
				this.back();
			},
			endClickEChart(){
				this.infoState=false;
			},
			clickechart(data){
				this.infoState=true;
				this.data=this.resultData[data];
			},
			changeType(){
				this.changeTypes();
			}
		},
		
		methods:{
			back(){
				this.$router.push({
					name: "Index"
				});
			},
			changeTypes(){
				if(this.showType==0){
					this.showType=1;
					this.typeText="查看柱状图";
				}else{
					this.showType=0;
					this.typeText="查看表格";
				};
			},
			drawLine(x, y) {
				// 基于准备好的dom，初始化echarts实例
				let myChart = this.$echarts.init(document.getElementById('myChart'))
				var option = {
					title: {
						text: ''
					},
					tooltip: {},
					grid:{
						y2:200 //x轴的高度
					},
					xAxis: {
						data: x,
						name:"候选项",
						triggerEvent: true,
						axisTick: {
							alignWithLabel: true //坐标值是否在刻度中间
						},
						axisLabel: {
							show: true,
							interval:0,
							
							formatter:function(value){  
							    return value.split("").join("\n");  
							},
							textStyle: {
								color: '#000000',
								fontSize: 20
							}
						}
					},
					yAxis: {
						minInterval: 1, //y轴显示整数
						name:"票数",
						axisLabel: {
							show: true,
							formatter: '{value}票',
							textStyle: {
								color: '#000000',
								fontSize: 10
							}
						}
					},
					series: {
						name: '选项',
						type: 'bar',
						data: y,
						itemStyle: {
							normal: {
								color: function(params) {
									var colorList = ['#78b1e7'];
									//若返回的list长度不足，不足部分自动显示为最后一个颜色
									return colorList[params.dataIndex]
								},
								label: {
									show: false,
									position: 'top'
								},
								textStyle: { //数值样式
									color: '#fff',
									fontSize: 10
								}
							}
						}
					}
				};
			
				// 绘制图表
				myChart.setOption(option);
				myChart.on('click', (params)=>{
					
				});
				
			}
		},
		mounted(){
			this.$http.get("http://localhost:3000/jeic/api/votingElections/findVoteResult?voteId="+this.$route.query.voteId).then(res=>{
				if(res.data.ret==200){
					console.log(res)
					let data=res.data.data;
					let xArr=[];
					let yArr=[];
					this.resultData=data.candidateCountlist;
					data.candidateCountlist.forEach(function(i){
						xArr.push(i.name);
						yArr.push(i.count);
					});
					this.drawLine(xArr,yArr);
					this.invalidVoteCount=data.invalidVoteCount;
					this.validVotesNumber=data.validVotesNumber;
					
				};
			});
			
		}
	}
</script>

<style scoped="scoped">
	.result{
		width: 100%;
		height: 100%;
		background: #fff;
		font-size: 1.6rem;
	}
	.result .header{
		height: 5rem;
		line-height: 5rem;
		padding: 0 1.5rem;
		border-bottom: .2rem solid #ececec;
	}
	
	.result .header .iconfont{
		font-size: 1.6rem;
		margin-right:1.5rem;
		cursor: pointer;
	}
	.stamp ul{
		margin-right: 6rem;
		float: right;
	}
	.stamp ul li{
		margin:1rem;
		font-size: 1.4rem;
		line-height: 3rem;
		float: left;
	}
	.stamp ul span{
		width: 1.2rem;
		height: 1.2rem;
		background: #4092f4;
		vertical-align: middle;
		display: inline-block;
		margin-right: 1rem;
	}
	.stamp ul li:nth-child(2) span{
		background: #ccc;
	}
	.stamp ul li button{
		width:10rem;
		height: 3rem;
		background:#4092f4;
		border-radius:.6rem;
		font-size: 1.6rem;
		color: #fff;
		border:none;
		outline: none;
		cursor: pointer;
	}
	
	.echart,.tableResult{position:absolute;top:11rem;left: 0;right: 0;bottom: 0;overflow-y: auto;}
	.table div span{width:50%;height: 4.8rem;text-align: center;line-height: 4.8rem;color: #fff;border-left:.1rem solid #e4e4ee;background:#4092f4;box-sizing: border-box;display:inline-block;}
	 div.xuanju div span{width: 16.66%;}
	.vote li{background:#fff;border-bottom:.1rem solid #e4e4ee;}
	.toupiao .vote li:nth-child(2n){background:#f8f8ff;}
	.xuanju  .vote li{width: 33.33%;float: left;}
	.vote li span{
		width: 50%;
		height: 4.8rem;
		text-align: center;
		line-height: 4.8rem;
		border-right:.1rem solid #e4e4ee;
		box-sizing: border-box;
		display: inline-block;
		float: left;
	}
	.info{
		position: absolute;
		top:0;
		left:0;
		right:0;
		bottom:0;
		margin: auto;
		background: #fff;
		z-index: 2;
	}
	.optionInfo{
		margin:1rem 0;
		text-align: center;
	}
	.votes{
		width:10rem;
		height:10rem;
		text-align: center;
		line-height:10rem;
		font-size: 2rem;
		color: #5d5954;
		border:.8rem solid #fe9c02;
		border-radius:100%;
		margin:0 auto;
	}
	.option p{
		font-size:2.4rem;
		color:#333;
		margin-top: 1rem;
	}
	.list{
		border-top: 2px solid #acacac;
	}
	.list li{
		width:9rem;
		height: 2.5rem;
		text-align: center;
		line-height: 2.5rem;
		color: #fff;
		font-size: 1.4rem;
		background: #4092f4;
		border-radius: 10px;
		margin:1rem;
		float: left;
	}
</style>
