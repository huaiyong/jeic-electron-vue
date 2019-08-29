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
};
const mutations = {
  getUserId(state, data) {
    state.userId = data;
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
};
const actions = {
  getUserId(context, data) {
    context.commit('getUserId', data);
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
  }
};
export default {
  state,
  mutations,
  actions,

};
