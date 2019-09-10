import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
const routes = [
  {
    path: '/',
    component: resolve => require([ '@/components/Login' ], resolve),
  },
  {
    name: 'Index',
    path: '/Index',
    component: resolve => require([ '@/components/Index' ], resolve),
    children: [
      {
        name: 'UserInfo',
        path: '/UserInfo',
        component: resolve => require([ '@/components/UserInfo' ], resolve),
      },
      {
        name: 'StudentList',
        path: '/StudentList',
        component: resolve => require([ '@/components/StudentList' ], resolve),
        meta: {
          keepAlive: true,
        },
      },
      {
        name: 'Classroom',
        path: '/Classroom',
        component: resolve => require([ '@/components/Classroom' ], resolve),

      },
      {
        name: 'Records',
        path: '/Records',
        component: resolve => require([ '@/components/teachRecord/Records' ], resolve),
        meta: {
          keepAlive: false,
        },
      },
      {
        name: 'Resourceslist',
        path: '/Resourceslist',
        component: resolve => require([ '@/components/resources/resourceslist' ], resolve),
        meta: {
          keepAlive: true,
        },
      },
      {
        name: 'videoPlayer',
        path: '/videoPlayer',
        component: resolve => require([ '@/components/resourceDetail/videoPlayer' ], resolve),
        meta: {
          keepAlive: false,
        },
      },
      {
        name: 'imgShow',
        path: '/imgShow',
        component: resolve => require([ '@/components/resourceDetail/imgShow' ], resolve),
        meta: {
          keepAlive: true,
        },
      },
      {
        name: 'picShow',
        path: '/picShow',
        component: resolve => require([ '@/components/resourceDetail/picShow' ], resolve),
        meta: {
          keepAlive: false,
        },
      },
      {
        name: 'ppt',
        path: '/ppt',
        component: resolve => require([ '@/components/pptShow' ], resolve),
        meta: {
          keepAlive: true,
        },
      },
      {
        name: 'pdf',
        path: '/pdf',
        component: resolve => require([ '@/components/resourceDetail/pdf' ], resolve),
        meta: {
          keepAlive: true,
        },
      },
	  {
	    name: 'draw',//画板
	    path: '/draw',
	    component: resolve => require([ '@/components/Draw' ], resolve),
	    meta: {
	      keepAlive: false,
	    },
	  },
      {
        name: 'word',
        path: '/word',
        component: resolve => require([ '@/components/wordShow' ], resolve),
        meta: {
          keepAlive: true,
        },
      },
      {
        name: 'excel',
        path: '/excel',
        component: resolve => require([ '@/components/excelShow' ], resolve),
        meta: {
          keepAlive: true,
        },
      },
      {
        name: 'StudentAnswers',
        path: '/StudentAnswers',
        component: resolve => require([ '@/components/resources/studentAnswers' ], resolve),
        meta: {
          keepAlive: true,
          reload:true,
        },
        beforeEnter(to, from, next) {
          if (from.name == 'AnswerStatistics' || from.name == 'picShow' || to.params.state == true) {
            to.meta.reload = false;
          };
          next();
        },
      },
      {
        name: 'recordDetail',
        path: '/recordDetail',
        component: resolve => require([ '@/components/teachRecord/recordDetail' ], resolve),
        meta: {
          keepAlive: true,
          reload:true,
        },
        beforeEnter(to, from, next) {
          if (from.name == 'recordAnswerStatistics' || from.name == 'picShow' || to.params.state == true) {
            to.meta.reload = false;
          };
          next();
        }
      },
      {
        name: 'AnswerStatistics', //查看班级答题统计页面
        path: '/AnswerStatistics',
        component: resolve => require([ '@/components/statistics/allStatistics' ], resolve),
        meta: {
          keepAlive: false,
        },
      },
	  {
	    name: 'rankingStatistics', //小红花页面
	    path: '/rankingStatistics',
	    component: resolve => require([ '@/components/statistics/rankingStatistics' ], resolve),
	    meta: {
	      keepAlive: false,
	    },
	  },{
	    name: 'singleStatistics', //小红花页面  getGroupStudentRange
	    path: '/singleStatistics',
	    component: resolve => require([ '@/components/statistics/singleStatistics' ], resolve),
	    meta: {
	      keepAlive: false,
	    },
	  },{
	    name: 'getGroupStudentRange', //小红花小组成员页面  
	    path: '/getGroupStudentRange',
	    component: resolve => require([ '@/components/statistics/getGroupStudentRange' ], resolve),
	    meta: {
	      keepAlive: false,
	    },
	  },
	  {
        name: 'recordAnswerStatistics', //查看课堂记录班级答题统计页面
        path: '/recordAnswerStatistics',
        component: resolve => require([ '@/components/teachRecord/allStatistics' ], resolve),
        meta: {
          keepAlive: false,
        },
      },
	  {
	    name: 'recordRankingStatistics', //课堂记录小红花页面
	    path: '/recordRankingStatistics',
	    component: resolve => require([ '@/components/teachRecord/rankingStatistics' ], resolve),
	    meta: {
	      keepAlive: false,
	    },
	  },{
	    name: 'recordSingleStatistics', //课堂记录小红花页面  getGroupStudentRange
	    path: '/recordSingleStatistics',
	    component: resolve => require([ '@/components/teachRecord/singleStatistics' ], resolve),
	    meta: {
	      keepAlive: false,
	    },
	  },{
	    name: 'recordGetGroupStudentRange', //课堂记录小红花小组成员页面  
	    path: '/recordGetGroupStudentRange',
	    component: resolve => require([ '@/components/teachRecord/getGroupStudentRange' ], resolve),
	    meta: {
	      keepAlive: false,
	    },
	  },
      {
        name: 'teachModel',
        path: '/teachModel',
        component: resolve => require([ '@/components/teachModel/teachModel' ], resolve),
      },
	  {
	    name: 'showcase', //实物展台
	    path: '/showcase',
	    component: resolve => require([ '@/components/showcase' ], resolve),
	  },
	  {
	    name: 'imgCompare', //拍照对比
	    path: '/imgCompare',
	    component: resolve => require([ '@/components/imgCompare' ], resolve),
	  },
	  {
	    name: 'imgShowduibi', //拍照对比图片展示
	    path: '/imgShowduibi',
	    component: resolve => require([ '@/components/resourceDetail/imgShowduibi' ], resolve),
	  },
    ],
  },
  {
    name: 'foundGroup',
    path: '/foundGroup',
    component: resolve => require([ '@/components/teachModel/foundGroup' ], resolve),
  },
  {
    name: 'chooseMode',
    path: '/chooseMode',
    component: resolve => require([ '@/components/voteItem/chooseMode' ], resolve),
  },
  {
    name: 'customVote',
    path: '/customVote',
    component: resolve => require([ '@/components/voteItem/customVote' ], resolve),
  }
];
const router = new VueRouter({
  routes,
});
export default router;
