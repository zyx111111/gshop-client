<template>
  <section class="msite">
    <!--首页头部-->
    <HeaderTop :title="address.name">
      <!--原本是span，但是要跳转，改成router-link-->
      <router-link class="header_search" slot="hLeft"  to="/search">
        <i class="iconfont icon-sousuo"></i>
      </router-link>
      <router-link class="header_login" slot="hRight"  :to="userInfo._id ? '/userinfo' : 'login'">
        <span class="header_login_text" v-if="!userInfo._id">登录|注册</span>
        <span class="header_login_text" v-else><i class="iconfont icon-person"></i></span>
      </router-link>
    </HeaderTop>
    <!--首页导航-->
    <nav class="msite_nav">
      <!--categorys.length,数据还未从后台获取到显示svg-->
      <div class="swiper-container" v-if="categorys.length">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(categorys,index) in categorysArr" :key="index">
            <a href="javascript:" class="link_to_food" v-for="(category,index) in categorys" :key="index">
              <div class="food_container">
                <img :src="imgBaseUrl+category.image_url">
              </div>
              <span>{{category.title}}</span>
            </a>
          </div>
        </div>
        <!-- Add Pagination -->
        <div class="swiper-pagination"></div>
      </div>
      <img src="./images/msite_back.svg" alt="" v-else>
    </nav>
    <!--首页附近商家-->
    <div class="msite_shop_list">
      <div class="shop_header">
        <i class="iconfont icon-xuanxiang"></i>
        <span class="shop_header_title">附近商家</span>
      </div>
      <ShopList></ShopList>
    </div>
  </section>
</template>

<script>
    import {mapState} from 'vuex'
    import HeaderTop from '../../components/HeaderTop/HeaderVue'
    import ShopList from '../../components/ShopList/ShopList'
    import Swiper from 'swiper'     //查看文档即可
    import 'swiper/dist/css/swiper.min.css'

    export default {
      name: "MSite",
      data() {
        return {
          imgBaseUrl: 'https://fuss10.elemecdn.com'  //图片地址域名
        }
      },
      mounted (){
        this.$store.dispatch('getCategorys')
        this.$store.dispatch('getShops')
        //创建一个Swiper实例对象来实现轮播，但是现在不能再这里创建这个实例对象，因为数据是异步获取的，这里可能在还没获取到数据之前就执行了
        //需要监视categorys，等到数据拿到之后要更新界面再调用
        // new Swiper ('.swiper-container',{
        //   loop: true, //可循环播放，
        //   // 如果需要分页器
        //   pagination: {
        //     el: '.swiper-pagination',
        //   }
        // })
      },
      computed:{
        ...mapState(['address','categorys','userInfo']),
        //categorysArr是根据categorys(一维数组)构造出来的二维数组，因为页面需要两次遍历，一次是轮播页数，一个是每一页的子项
        categorysArr() {
          const {categorys} = this;
          let douArr = [];
          let oneArr = [];
          categorys.forEach((cur,index,cate) => {
            oneArr.push(cur);
            if(index == (cate.length-1)){  //如果是最后一项,就算oneArr未满八个也直接加进douArr
              douArr.push(oneArr);
            }
            else {
              if(oneArr.length == 8){
                douArr.push(oneArr);
                oneArr = []
              }
            }
          })

          return douArr
        }
      },
      watch: {
        categorys () {      //categorys数组中已经有数据，在异步更新界面之前执行（理解成更新DOM之前）
          this.$nextTick(() => {     //一旦界面更新完成就立即执行这个方法
            //创建一个Swiper实例对象来实现轮播
            new Swiper ('.swiper-container',{
              loop: true, //可循环播放，
              // 如果需要分页器
              pagination: {
                el: '.swiper-pagination',
              }
            })
          })
        }
      },
      components: {
          HeaderTop,ShopList
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .msite  //首页
    width 100%
    .msite_nav
      bottom-border-1px(#e4e4e4)
      margin-top 45px
      height 200px
      background #fff
      .swiper-container
        width 100%
        height 100%
        .swiper-wrapper
          width 100%
          height 100%
          .swiper-slide
            display flex
            justify-content center
            align-items flex-start
            flex-wrap wrap
            .link_to_food
              width 25%
              .food_container
                display block
                width 100%
                text-align center
                padding-bottom 10px
                font-size 0
                img
                  display inline-block
                  width 50px
                  height 50px
              span
                display block
                width 100%
                text-align center
                font-size 13px
                color #666
        .swiper-pagination
          >span.swiper-pagination-bullet-active
            background #02a774
    .msite_shop_list
      top-border-1px(#e4e4e4)
      margin-top 10px
      background #fff
      .shop_header
        padding 10px 10px 0
        .shop_icon
          margin-left 5px
          color #999
        .shop_header_title
          color #999
          font-size 14px
          line-height 20px
</style>
