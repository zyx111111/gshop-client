<template>
  <div class="cartcontrol">
    <!--food.count是原本不存在food中的属性-->
    <transition name="move">
      <div class="iconfont icon-remove_circle_outline" v-if="food.count" @click.stop="updateFoodCount(false)"></div>
    </transition>
    <div class="cart-count" v-if="food.count">{{food.count}}</div>
    <div class="iconfont icon-add_circle" @click.stop="updateFoodCount(true)"></div>
  </div>
</template>

<script>
    // import Vue from 'vue'
    export default {
        name: "CartControl",
        props: {
          food: Object
        },
        methods: {
          updateFoodCount(isAdd) {
            //更改数据都交给actions和mutations
            // if(!this.food.count){
            //   Vue.set(this.food,'count',1)   //向响应式对象中添加一个属性，并确保这个新属性同样是响应式的，且触发视图更新。没有使用这个方法的话，count属性是新增属性没有数据绑定
            // }else{
            //   this.food.count++
            // }
            this.$store.dispatch('updateFoodCount',{isAdd, food: this.food})
          }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .cartcontrol
    font-size: 0
    .cart-decrease
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color: rgb(0, 160, 220)
    .icon-remove_circle_outline
      display: inline-block
      padding 6px
      line-height 24px
      font-size 24px
      color $green
      &.move-enter-active, &.move-leave-active
        transition all .3s
      &.move-enter, &.move-leave-to
        opacity 0
        transform translateX(15px) rotate(180deg)
    .cart-count
      display: inline-block
      vertical-align: top
      width: 12px
      padding-top: 6px
      line-height: 24px
      text-align: center
      font-size: 10px
      color: rgb(147, 153, 159)
    .icon-add_circle
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color $green
</style>
