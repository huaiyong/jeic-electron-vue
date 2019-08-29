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
          keepAlive: false,
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
          isBack: false,
        },
        beforeEnter(to, from, next) {
          if (from.name == 'AnswerStatistics' || from.name == 'picShow' || to.params.state == true) {
            to.meta.isBack = true;
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
          isBack: false,
        },
        beforeEnter(to, from, next) {
          if (from.name == 'AnswerStatistics' || from.name == 'picShow' || to.params.state == true) {
            to.meta.isBack = true;
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
	    name: 'singleStatistics', //小红花页面
	    path: '/singleStatistics',
	    component: resolve => require([ '@/components/statistics/singleStatistics' ], resolve),
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
    ],
  },
  {
    name: 'foundGroup',
    path: '/foundGroup',
    component: resolve => require([ '@/components/teachModel/foundGroup' ], resolve),
  },
];
const router = new VueRouter({
  routes,
});
export default router;
