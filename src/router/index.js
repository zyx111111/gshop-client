import Vue from 'vue'
import VueRouter from 'vue-router'
import MSite from '../pages/MSite/MSite'
import Search from '../pages/Search/Search'
import Order from '../pages/Order/Order'
import Profile from '../pages/Profile/Profile'
import Login from '../pages/Login/Login'


//声明使用插件
Vue.use(VueRouter)

export default new VueRouter({
  routes:[
    {
      path:'/mSite',
      component: MSite,
      meta: {
        shoeFooter: true   //决定要不要显示路由链接组件
      }
    },
    {
      path:'/search',
      component: Search,
      meta: {
        shoeFooter: true
      }
    },
    {
      path:'/profile',
      component: Profile,
      meta: {
        shoeFooter: true
      }
    },
    {
      path:'/order',
      component: Order,
      meta: {
        shoeFooter: true
      }
    },
    {
      path: '/',
      redirect: '/mSite'
    },
    {
      path:'/login',
      component: Login,
      meta: {    //也可以不要写meta
        shoeFooter: false
      }
    }
  ]
})
