<template>
  <div class="star" :class="'star-'+size">
    <span class="star-item" v-for="(style,index) in styleArr" :class="style"></span>
  </div>
</template>

<script>
    const STYLE_ON = 'on'
    const STYLE_HALF = 'half'
    const STYLE_OFF = 'off'
    export default {
        name: "star",
        props: {
          size: Number,  //图片大小
          score: Number  //评分(根据这个来确定星星的样式)
        },
        computed: {
          styleArr () {
            const {score} = this;
            let result = []
            //on的个数，score向下取整
            let on_num = Math.floor(score)
            for (let i = 0; i < on_num; i++) {
              result.push(STYLE_ON)
            }
            //half的个数，小数点后大于0.5取一个,小数加减不准确，使用整数
            if(score*10 - Math.floor(score)*10 >= 5){
              result.push(STYLE_HALF)
            }
            //off的个数为5-其他两个
            while (result.length < 5){
              result.push(STYLE_OFF)
            }
            return result
          }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixins.styl'
  .star //2x图 3x图
    float left
    font-size 0
    .star-item
      display inline-block
      background-repeat no-repeat
    &.star-48
      .star-item
        width 20px
        height 20px
        margin-right 22px
        background-size 20px 20px
        &:last-child
          margin-right: 0
        &.on
          bg-image('./images/star48_on')
        &.half
          bg-image('./images/star48_half')
        &.off
          bg-image('./images/star48_off')
    &.star-36
      .star-item
        width 15px
        height 15px
        margin-right 6px
        background-size 15px 15px
        &:last-child
          margin-right 0
        &.on
          bg-image('./images/star36_on')
        &.half
          bg-image('./images/star36_half')
        &.off
          bg-image('./images/star36_off')
    &.star-24
      .star-item
        width 10px
        height 10px
        margin-right 3px
        background-size 10px 10px
        &:last-child
          margin-right 0
        &.on
          bg-image('./images/star24_on')
        &.half
          bg-image('./images/star24_half')
        &.off
          bg-image('./images/star24_off')
</style>
