import Vue from 'vue'
import VueRouter from 'vue-router'

// import MSite from '../pages/MSite/MSite'
// import Search from '../pages/Search/Search'
// import Order from '../pages/Order/Order'
// import Profile from '../pages/Profile/Profile'

const MSite = () => import('../pages/MSite/MSite.vue')
const Search = () => import('../pages/Search/Search.vue')
const Order = () => import('../pages/Order/Order.vue')
const Profile = () => import('../pages/Profile/Profile.vue')

import Login from '../pages/Login/Login'
import Shop from '../pages/Shop/Shop'
import ShopGoods from  '../pages/Shop/ShopGoods/ShopGoods'
import ShopInfo from  '../pages/Shop/ShopInfo/ShopInfo'
import ShopRatings from  '../pages/Shop/ShopRatings/ShopRatings'



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
    },
    {
      path: '/shop',
      component: Shop,
      children: [
        {
          path: '/shop/goods',
          component: ShopGoods
        },
        {
          path: '/shop/info',
          component: ShopInfo
        },
        {
          path: '/shop/Ratings',
          component: ShopRatings
        },
        {
          path: '',
          redirect: '/shop/goods'
        }
      ]
    }
  ]
})
