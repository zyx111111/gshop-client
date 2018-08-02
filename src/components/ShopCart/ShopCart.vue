<template>
  <div>
    <div class="shopcart">
      <div class="content">
        <!--底部左侧点击切换显示-->
        <div class="content-left" @click="toggleShow()">
          <div class="logo-wrapper">
            <!--highlight是有选中项时购物车的添加的类名-->
            <div class="logo" :class="{highlight: totalCount>0}">
              <i class="iconfont icon-shopping_cart" :class="{highlight: totalCount>0}"></i>
            </div>
            <div class="num" v-if="totalCount">{{totalCount}}</div>
          </div>
          <div class="price" :class="{highlight: totalCount>0}">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{info.deliveryPrice}} 元</div>
        </div>
        <div class="content-right">
          <!--enough和not-enough两个类名-->
          <div class="pay" :class="payClass">
            {{payText}}
          </div>
        </div>
      </div>
      <transition name="move">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="clearCart">清空</span>
          </div>
          <div class="list-content">
            <ul>
              <li class="food" v-for="(food,index) in cartFoods" :key="index">
                <span class="name">{{food.name}}</span>
                <div class="price"><span>￥{{food.price}}</span></div>
                <div class="cartcontrol-wrapper">
                  <CartControl :food="food"></CartControl>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <!--遮罩部分点击也要切换显示-->
    <div class="list-mask" v-show="listShow" @click="toggleShow"></div>
  </div>
</template>

<script>
    import {mapState,mapGetters} from 'vuex'
    import CartControl from '../CartControl/CartControl'
    import BScroll from 'better-scroll'
    import {MessageBox} from 'mint-ui'

    export default {
        name: "ShopCart",
        data() {
          return {
            isShow: false   //是否显示购物项
          }
        },
        computed: {
          ...mapState(['cartFoods','info']),
          ...mapGetters(['totalCount','totalPrice']),
          payClass() {
            const {totalPrice} = this
            const {minPrice} = this.info
            return totalPrice>=minPrice ? 'enough' : 'not-enugh'
          },
          payText() {
            const {totalPrice} = this
            const {minPrice} = this.info
            if(this.totalCount == 0){
              return `￥${minPrice}起送`
            }else if(totalPrice < minPrice){
              return `还差${minPrice - totalPrice}元起送`
            }else {
              return '结算'
            }
          },
          listShow() {
            if(this.totalCount == 0){     // 如果总数量为0, 直接不显示，而且还要把isShow变为false，不然的话再次点击某一项时会显示购物项出来
              this.isShow = false
              return false
            }
            if(this.isShow){    //要显示购物车时创建
              // 实现BScroll的实例是一个单例，不然每显示一次购物车就会创建一个scroll对象，然后点击购物车某项的加号数量会一下子加多个，因为派发了多次点击事件
              this.$nextTick(()=>{
                if(!this.scroll) {
                  this.scroll = new BScroll('.list-content',{
                    click: true
                  })
                }else{
                  this.scroll.refresh()   // 让滚动条刷新一下: 重新统计内容的高度
                }
              })
            }

            return this.isShow
          }
        },
        methods: {
          toggleShow() {
            // 只有当总数量大于0时切换,不然当没显示列表项点击购物车左侧时，会改变isShow，然后再次点击某一项加入购物车会显示购物项
            if(this.totalCount>0){
              this.isShow = !this.isShow
            }
          },
          clearCart() {
            MessageBox.confirm('确定清除购物车吗？').then(() => {
              this.$store.dispatch('clearCart')
            },()=>{})
          }
        },
        components: {
          CartControl
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixins.styl"
  .shopcart
    position fixed
    left 0
    bottom 0
    z-index 50
    width 100%
    height 48px
    .content
      display flex
      background #141d27
      font-size 0
      color rgba(255, 255, 255, 0.4)
      .content-left
        flex 1
        .logo-wrapper
          display inline-block
          vertical-align top
          position relative
          top -10px
          margin 0 12px
          padding 6px
          width 56px
          height 56px
          box-sizing border-box
          border-radius 50%
          background #141d27
          .logo
            width 100%
            height 100%
            border-radius 50%
            text-align center
            background #2b343c
            &.highlight
              background $green
            .icon-shopping_cart
              line-height 44px
              font-size 24px
              color #80858a
              &.highlight
                color #fff
          .num
            position absolute
            top 0
            right 0
            width 24px
            height 16px
            line-height 16px
            text-align center
            border-radius 16px
            font-size 9px
            font-weight 700
            color #ffffff
            background rgb(240, 20, 20)
            box-shadow 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price
          display inline-block
          vertical-align top
          margin-top 5px
          line-height 24px
          padding-right 12px
          box-sizing border-box
          font-size 16px
          font-weight 700
          color #fff
          &.highlight
            color #fff
        .desc
          display inline-block
          vertical-align bottom
          margin-bottom 15px
          margin-left -45px
          font-size 10px
      .content-right
        flex 0 0 105px
        width 105px
        .pay
          height 48px
          line-height 48px
          text-align center
          font-size 12px
          font-weight 700
          color #fff
          &.not-enough
            background #2b333b
          &.enough
            background #00b43c
            color #fff
    .ball-container
      .ball
        position fixed
        left 32px
        bottom 22px
        z-index 200
        transition all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width 16px
          height 16px
          border-radius 50%
          background $green
          transition all 0.4s linear
    .shopcart-list
      position absolute
      left 0
      top 0
      z-index -1
      width 100%
      transform translateY(-100%)
      &.move-enter-active, &.move-leave-active
        transition transform .3s
      &.move-enter, &.move-leave-to
        transform translateY(0)
      .list-header
        height 40px
        line-height 40px
        padding 0 18px
        background #f3f5f7
        border-bottom 1px solid rgba(7, 17, 27, 0.1)
        .title
          float left
          font-size 14px
          color rgb(7, 17, 27)
        .empty
          float right
          font-size 12px
          color rgb(0, 160, 220)

      .list-content
        padding 0 18px
        max-height 217px
        overflow hidden
        background #fff
        .food
          position relative
          padding 12px 0
          box-sizing border-box
          bottom-border-1px(rgba(7, 17, 27, 0.1))
          .name
            line-height 24px
            font-size 14px
            color rgb(7, 17, 27)
          .price
            position absolute
            right 90px
            bottom 12px
            line-height 24px
            font-size 14px
            font-weight 700
            color rgb(240, 20, 20)
          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 6px

  .list-mask
    position fixed
    top 0
    left 0
    width 100%
    height 100%
    z-index 40
    backdrop-filter blur(10px)
    opacity 1
    background rgba(7, 17, 27, 0.6)
    &.fade-enter-active, &.fade-leave-active
      transition all 0.5s
    &.fade-enter, &.fade-leave-to
      opacity 0
      background rgba(7, 17, 27, 0)
</style>
