import Vue from 'vue';
import Axios from 'axios';
import router from './route';
import store from './store';
import echarts from 'echarts';
import filters from './utils/util';
import db from './utils/db';
import logger from './utils/logger';
import App from './App.vue';
import VueSocketIO from 'vue-socket.io';
import './assets/css/reset.css';
import './assets/css/common.css';
import './assets/css/zyx.css';
import './assets/css/wx.css';
import './assets/css/mlh.css';
import './assets/css/zmj.css';
import './assets/css/animate.min.css';
import './assets/font/iconfont.css';
import './assets/js/rem.js';
import './assets/js/rtcClient.js';
import filters from "./assets/js/filter.js"//用于处理浮点数小数位数
//全局方法Vue.filter()统一注册自定义过滤器
Object.keys(filters).forEach(key => {//返回filters对象中属性名组成的数组
  Vue.filter(key, filters[key])
})
// 升级脚本
import './utils/upgrade';
Vue.prototype.$http = Axios;
Vue.prototype.$echarts = echarts;
// Vue.prototype.configure = {
//   jeucIp: 'http://edu.jetsen.cn:9001/jeuc/api',
//   // jeucIp:"http://111.207.13.88:8881/jeuc/api",
//   resourceIp: 'http://edu.jetsen.cn:9004/Teacher', // http://localhost:8081/photoBack/getsendPhotos?
//   recordIp: 'http://edu.jetsen.cn:9004/photoBack/getsendPhotos',
//   showResourceIp: 'http://edu.jetsen.cn:9020/edu-resource/a/resource/mrs_rmi/getById?token=29B5DF07F7FC514807CE5FBC12EA1506&id=', // 显示资源详情接口
//   videoPlay: 'http://edu.jetsen.cn:9020/resource/Preview/', // 视频播放固定地址
// };

Vue.prototype.configure = {
  jeucIp:"http://111.207.13.88:8881/jeuc/api", //用户中心接口 获取用户数据
  resourceIp:"http://111.207.13.88:8882/Teacher", //教师端获取资源列表接口
  recordIp: 'http://localhost:8081/photoBack/getsendPhotos?',
  showResourceIp: 'http://111.207.13.88:9061/edu-resource/a/resource/mrs_rmi/getById?token=29B5DF07F7FC514807CE5FBC12EA1506&id=', // 显示资源详情接口
  videoPlay: 'http://111.207.13.88:9061/resource/Preview/', // 视频播放固定地址
};

/**
 * 获取本机的ip地址
 */
const os = require('os');
let ip;
const stringIp = JSON.stringify(os.networkInterfaces());
const subIPindex = stringIp.indexOf(':') - 1;
const netName = stringIp.substring(2, subIPindex);

for (let i = 0; i < os.networkInterfaces()[netName].length; i++) {
  if (os.networkInterfaces()[netName][i].family == 'IPv4') {
    ip = os.networkInterfaces()[netName][i].address;
  }
}

Vue.use(new VueSocketIO({
  //debug: true,
  connection: 'http://' + ip + ':3000',
}));

Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));


Vue.prototype.$db = db;

Vue.prototype.$logger = logger;

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
});
