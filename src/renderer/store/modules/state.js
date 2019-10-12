const state = {
  userId: '', // 用户id
  subjectId:"",//科目id
  classroomState: false, // 上课状态
  classId: '', // 班级id
  cityId: '', // 教师所在城市
  remember: [], // 全班学员
  pattern: true, // 教学模式,true为全班教学,false为分组教学
  resourceId: '', // 资源id
  recordId: '', // 下发资源id
  classRecord: '', // 课堂id
  testType:"",//试卷类型 1指word，3指img
  imgUrl:"",//拍照创题图片
  imgType:0,//拍照创题 题目类型
  imgAnswer:"",//拍照创题 答案
  model:null , //1是全班 2是组长 3是全组
  groupId:'',   //组的id
  imgArr:[],//拍照对比
//sendType:'', //1是全班 2是分組
  answerType:'', //1是全员 2是组长 3是全组
  eachRecordId:'' ,//每一条记录的id,
  lupingState:false,//是否录屏
  pptState:true,//ppt显示状态
  pptHave:false,
  wordId:"",
  wordState:true,
  wordHave:false,
  pdfId:"",
  pdfState:true,
  pdfHave:false,
  excelId:"",
  excelState:true,
  excelHave:false,
  excelId:"",
};
var copyState = deepClone(state); // 拷贝state对象
function deepClone(obj) {
	var newObj = obj instanceof Array ? [] : {}
	for (var i in obj) {
		newObj[i] = typeof obj[i] === 'object' ? deepClone(obj[i]) : obj[i]
	}
	return newObj
};
const mutations = {
  getUserId(state, data) {
    state.userId = data;
  },
//getSendType(state, data){
//	state.sendType = data;
//},
  getAnswerType(state, data){
  	state.answerType = data;
  },
  getEachRecordId(state, data){
  	state.eachRecordId = data;
  },

  getSubjectId(state, data) {
    state.subjectId = data;
  },
  getPattern(state, data) {
    state.pattern = data;
  },
  getRemember(state, data) {
    state.remember = data;
  },
  getClassId(state, data) {
    state.classId = data;
  },
  getCityId(state, data) {
    state.cityId = data;
  },
  getRecordId(state, data) {
    state.recordId = data;
  },
  changeClassroomState(state, data) {
    state.classroomState = data;
  },
  getResourceId(state, data) {
    state.resourceId = data;
  },
  getClassRecord(state, data) {
    state.classRecord = data;
  },
  getTestType(state, data) {
    state.testType = data;
  },
  getModel(state, data) {
    state.model = data;
  },
  getGroupId(state, data) {
    state.groupId = data;
  },
  getImgUrl(state, data) {
    state.imgUrl = data;
  },
  getImgType(state, data) {
    state.imgType = data;
  },
  getImgAnswer(state, data) {
    state.imgAnswer = data;
  },
  getImgArr(state, data) {
    state.imgArr = data;
  },
  getZhantai(state, data) {
    state.zhantai = data;
  },
  getLupingState(state, data) {
    state.lupingState = data;
  },
  getPptState(state, data) {
    state.pptState = data;
  },
  getPptId(state, data) {
    state.pptId = data;
  },
  getPptHave(state, data) {
    state.pptHave = data;
  },
  getWordState(state, data) {
    state.wordState = data;
  },
  getWordId(state, data) {
    state.wordId = data;
  },
  getWordHave(state, data) {
    state.wordHave = data;
  },
  getPdfState(state, data) {
    state.pdfState = data;
  },
  getPdfId(state, data) {
    state.pdfId = data;
  },
  getPdfHave(state, data) {
    state.pdfHave = data;
  },
  getExcelState(state, data) {
    state.excelState = data;
  },
  getExcelId(state, data) {
    state.excelId = data;
  },
  getExcelHave(state, data) {
    state.excelHave = data;
  },
  resetState(state) {
  	for (var i in copyState) {
  		state[i] = copyState[i] // 递归赋值
  	}
  }
};
const actions = {
  getUserId(context, data) {
    context.commit('getUserId', data);
  },
//getSendType(context, data) {
//  context.commit('getSendType', data);
//},
  getAnswerType(context, data) {
    context.commit('getAnswerType', data);
  },
  getEachRecordId(context, data) {
    context.commit('getEachRecordId', data);
  },
  getSubjectId(context, data) {
     context.commit('getSubjectId', data);
  },
  getPattern(context, data) {
    context.commit('getPattern', data);
  },
  getRemember(context, data) {
    context.commit('getRemember', data);
  },
  getClassId(context, data) {
    context.commit('getClassId', data);
  },
  getCityId(context, data) {
    context.commit('getCityId', data);
  },
  getRecordId(context, data) {
    context.commit('getRecordId', data);
  },
  changeClassroomState(context, data) {
    context.commit('changeClassroomState', data);
  },
  getResourceId(context, data) {
    context.commit('getResourceId', data);
  },
  getClassRecord(context, data) {
    context.commit('getClassRecord', data);
  },
  getTestType(context, data) {
    context.commit('getTestType', data);
  },
  getModel(context, data) {
    context.commit('getModel', data);
  },
  getGroupId(context, data) {
    context.commit('getGroupId', data);
  },
  getImgUrl(context, data) {
    context.commit('getImgUrl', data);
  },
  getImgType(context, data) {
    context.commit('getImgType', data);
  },
  getImgAnswer(context, data) {
    context.commit('getImgAnswer', data);
  },
  getImgArr(context, data) {
    context.commit('getImgArr', data);
  },
  getZhantai(context, data) {
    context.commit('getZhantai', data);
  },
  getLupingState(context, data) {
    context.commit('getLupingState', data);
  },
  getPptState(context, data) {
    context.commit('getPptState', data);
  },
  getPptId(context, data) {
    context.commit('getPptId', data);
  },
  getPptHave(context, data) {
    context.commit('getPptHave', data);
  },
  getExcelState(context, data) {
    context.commit('getExcelState', data);
  },
  getExcelId(context, data) {
    context.commit('getExcelId', data);
  },
  getExcelHave(context, data) {
    context.commit('getExcelHave', data);
  },
  getWordState(context, data) {
    context.commit('getWordState', data);
  },
  getWordId(context, data) {
    context.commit('getWordId', data);
  },
  getWordHave(context, data) {
    context.commit('getWordHave', data);
  },
  getPdfState(context, data) {
    context.commit('getPdfState', data);
  },
  getPdfId(context, data) {
    context.commit('getPdfId', data);
  },
  getPdfHave(context, data) {
    context.commit('getPdfHave', data);
  },
  resetState(context){
	context.commit('resetState'); 
  }
};
export default {
  state,
  mutations,
  actions,

};
