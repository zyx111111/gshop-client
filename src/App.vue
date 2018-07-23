<template>
  <div id="app">
    <router-view></router-view>
    <!--//决定要不要显示路由链接组件-->
    <FooterGuide v-show="$route.meta.shoeFooter"></FooterGuide>
  </div>
</template>

<script>
    import FooterGuide from './components/FooterGuide/FooterGuide'
    export default {
        name: "App",
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
