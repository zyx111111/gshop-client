<template>
  <div id="app">
    <router-view></router-view>
    <!--//决定要不要显示路由链接组件-->
    <FooterGuide v-show="$route.meta.shoeFooter"></FooterGuide>
  </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import FooterGuide from './components/FooterGuide/FooterGuide'

    export default {
        name: "App",
        mounted () {
          //获取商家地址
          this.getAdress()
          //获取用户信息（从session中，实现自动登录）
          this.getUserInfo()
        },
        methods : {
          ...mapActions(['getAdress','getUserInfo'])
        },
        components: {
          FooterGuide
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #app
    width 100%
    height 100%
    background #f5f5f5
</style>
