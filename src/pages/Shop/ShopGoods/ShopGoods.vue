<template>
    <div>
        <div class="goods">
            <div class="menu-wrapper" ref="menuWrapper">
                <ul>
                  <!--current样式：选中的分类字体颜色变绿色-->
                    <li class="menu-item" v-for="(good, index) in goods" :key="index" :class="{current: index==currentIndex}" @click="clickMenuItem(index)">
                        <span class="text bottom-border-1px">
                            <!--有可能有分类没有icon属性-->
                            <img class="icon" :src="good.icon" v-if="good.icon">
                            {{good.name}}
                        </span>
                    </li>
                </ul>
            </div>
            <div class="foods-wrapper" ref="foodsWrapper">
                <ul ref="foodsUL">
                    <li class="food-list-hook" v-for="(good, index) in goods" :key="index">
                        <h1 class="title">{{good.name}}</h1>
                        <ul>
                            <li class="food-item bottom-border-1px" v-for="(food, index) in good.foods" :key="index" @click="showBigFood(food)">
                                <div class="icon">
                                    <img width="57" height="57" :src="food.icon">
                                </div>
                                <div class="content">
                                    <h2 class="name">{{food.name}}</h2>
                                    <p class="desc">{{food.description}}</p>
                                    <div class="extra">
                                        <span class="count">月售{{food.sellCount}} 份</span>
                                        <span>好评率{{food.rating}}%</span>
                                    </div>
                                    <div class="price">
                                        <span class="now">￥{{food.price}}</span>
                                        <span class="old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>
                                    </div>
                                    <div class="cartcontrol-wrapper">
                                      <CartControl :food="food"></CartControl>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <ShopCart></ShopCart>
        </div>
        <BigFood :food="food" ref="bigfood"></BigFood>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import BScroll from 'better-scroll'
    import CartControl from '../../../components/CartControl/CartControl.vue'
    import BigFood from '../../../components/BigFood/BigFood'
    import ShopCart from '../../../components/ShopCart/ShopCart'

    export default {
        name: "ShopGoods",
        data() {
          return {
            scrollY: 0,   //右侧滑动的Y轴坐标 (滑动过程时实时变化)
            tops: [],      //所有右侧分类li的top(每个分类开始的位置)组成的数组  (列表第一次显示后就不再变化)
            food: {}     //传递给BigFood组件的food
          }
        },
        components: {
          CartControl,BigFood,ShopCart
        },
        mounted() {
          this.$store.dispatch('getShopGoods',()=> {
            this.$nextTick(()=>{
              //实现滚动并绑定滚动监听，得到scroolY的值
              this._initScroll()
              //初始化tops
              this._initTops()
            })
          })
        },
        computed: {
          ...mapState(['goods']),
          //计算得到滑动结束之后当前分类的下标
          currentIndex() {
            //得到条件数据
            const {scrollY, tops} = this
            //根据条件计算产生滑动结束之后当前分类的下标
            const index = tops.findIndex((top,index) => {
              return scrollY>=top && scrollY<tops[index+1]
            })
            //返回结果
            return index
          }
        },
        methods: {
          //实现滚动并绑定滚动监听，得到scroolY的值
          _initScroll() {
            //这种方法和watch的效果一样，都是数据更新后调用函数创建相应的对象，但是这个函数要在界面更新后调用，使用this.$nextick
            new BScroll('.menu-wrapper',{
              click: true    //better-scroll 默认会阻止浏览器的原生 click 事件。当设置为 true，better-scroll 会派发一个 click 事件，也就是可以给里面的li绑定监听，不然不可以
            })
            //为了在左侧分类的点击监听可以拿到这个对象，所以加给this
            this.foodsWrapper = new BScroll('.foods-wrapper',{
              probeType: 2,    //2代表惯性滑动不会触发(1,2,3代表不同的触发方式，乐意自己测试, 3是不管怎么样只要滑动就触发，这里本来可以用3)
              click: true
            })
            this.foodsWrapper.on('scroll',(event) => {   //触发时机：滚动过程中，具体时机取决于选项中的 probeType.(event是回调传入的参数)
              // console.log(event.x+ ','+ event.y);
              this.scrollY = Math.abs(event.y)
            })
            this.foodsWrapper.on('scrollEnd',(event) => {    //probeType为2，说明惯性滑动的剁成不会触发，不会更改scrollY的值，所以要在滑动结束后修改scroolY的值确认当前分类下标
              this.scrollY = Math.abs(event.y)
            })
          },
          //初始化tops，要找到lis也要在this.$nextTick里面调用
          _initTops() {
            const tops = []
            let top = 0
            tops.push(top);
            //找到所有li
            let lis = this.$refs.foodsUL.getElementsByClassName('food-list-hook')
            Array.prototype.slice.call(lis).forEach(li => {
              top += li.clientHeight     //高度累加，得到对应标签的开始位置
              tops.push(top)
            })
            this.tops = tops
            // console.log(this.tops)
          },
          //左侧分类点击的监听
          clickMenuItem(index) {
            // 使用右侧列表滑动到对应的位置

            // 得到目标位置的scrollY
            const scrollY = this.tops[index]
            // 立即更新scrollY(让点击的分类项成为当前分类),这里不这样的话等到scrollTo结束也会触发scrollEnd,然后改变scrollY，只是这样要等到滑动结束标签的字体才改变
            this.scrollY = scrollY
            // 平滑滑动右侧列表
            this.foodsWrapper.scrollTo(0, -scrollY, 300)
          },
          //点击食物显示大图
          showBigFood(food){
            //得到当前food
            this.food = food
            //调用子组件的方法，这里只能这么做
            this.$refs.bigfood.toggleShow()
          }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/mixins.styl"
  .goods
    display: flex
    position: absolute
    top: 195px
    bottom: 46px
    width: 100%
    background: #fff;
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          color: $green
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          bottom-border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        bottom-border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px
</style>
