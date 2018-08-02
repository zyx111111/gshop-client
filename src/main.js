// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import {Button} from 'mint-ui'
//执行mockserver.js
import './mock/mockserver'
import './filters'
import VueLazyload from 'vue-lazyload'
import loading from './common/imgs/loading.gif'

Vue.config.productionTip = false

//全局注册组件
Vue.component(Button.name,Button)
Vue.use(VueLazyload,{        //内部自定义一个指令lazy
  loading
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router,   //使用路由
  store   //使用vuex
})
