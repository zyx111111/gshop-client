<template>
    <!--<div>-->
      <section class="loginContainer">
        <div class="loginInner">
          <div class="login_header">
            <h2 class="login_logo">硅谷外卖</h2>
            <div class="login_header_title">
              <!--on属性的样式为选中，字体颜色绿色-->
              <a href="javascript:;" :class="{on: loginWay}" @click="loginWay=true">短信登录</a>
              <a href="javascript:;" :class="{on: !loginWay}" @click="loginWay=false">密码登录</a>
            </div>
          </div>
          <div class="login_content">
            <form @submit.prevent="login">
              <!--on属性的样式为选中，display不为none-->
              <div :class="{on: loginWay}">
                <section class="login_message">
                  <input type="tel" maxlength="11" placeholder="手机号" v-model="phone">
                  <!--righ_phone为手机号码正确时的按钮样式，字体变黑-->
                  <button :disabled="!isPhoneRight" class="get_verification" :class="{right_phone:isPhoneRight}" @click.prevent="getCode">
                    <!--如果倒计时时间小于0，说明正在倒计时，显示倒计时，不然显示获取验证码-->
                    {{leftSecond>0 ? `已发送(${leftSecond}s)`:'获取验证码'}}
                  </button>
                </section>
                <section class="login_verification">
                  <input type="tel" maxlength="8" placeholder="验证码" v-model="code">
                </section>
                <section class="login_hint">
                  温馨提示：未注册硅谷外卖帐号的手机号，登录时将自动注册，且代表已同意
                  <a href="javascript:;">《用户服务协议》</a>
                </section>
              </div>
              <!--on属性的样式为选中，display不为none-->
              <div :class="{on: !loginWay}">
                <section>
                  <section class="login_message">
                    <input type="tel" maxlength="11" placeholder="手机/邮箱/用户名" v-model="name">
                  </section>
                  <section class="login_verification">
                    <!--type属性根据showPwd的状态来决定-->
                    <input :type="showPwd ? 'text' : 'password'" maxlength="8" placeholder="密码" v-model="pwd">
                    <!--on ,off属性根据showPwd的状态来决定,椭圆框变绿色样式-->
                    <div class="switch_button" @click="showPwd=!showPwd" :class="showPwd ? 'on' : 'off'">
                      <!--right属性控制向右滑动（transform: translateX()）-->
                      <div class="switch_circle" :class="{right: showPwd}"></div>
                      <span class="switch_text">{{showPwd ? 'abc' : '...'}}</span>
                    </div>
                  </section>
                  <section class="login_message">
                    <input type="text" maxlength="11" placeholder="验证码" v-model="captcha">
                    <!--http://localhost:4000/captcha是一张svg图片-->
                    <img class="get_verification" src="http://localhost:4000/captcha" alt="captcha" @click="getCaptcha" ref="captcha">
                  </section>
                </section>
              </div>
              <button class="login_submit">登录</button>
            </form>
            <a href="javascript:;" class="about_us">关于我们</a>
          </div>
          <!--回到主界面-->
          <a href="javascript:" class="go_back" @click="$router.back()">
            <i class="iconfont icon-jiantou2"></i>
          </a>
        </div>
        <AlertTip v-show="showAlert" :alertText="alertText" @closeTip="closeTip"></AlertTip>
      </section>

    <!--</div>-->
</template>

<script>
    import AlertTip from '../../components/AlertTip/AlertTip'
    import  {reqPwdLogin,reqSmsLogin,reqSendCode} from '../../api/index'
    export default {
      name: "Login",
      data () {
        return {
          loginWay: true,  //true表示短信登录
          phone: '',    //手机号码
          code: '',     //手机验证码
          leftSecond: 0,   //倒计时时间
          name: '', //用户名
          pwd:'',   //密码
          captcha:'',  //一次性验证码
          showPwd: false , //是否显示密码
          showAlert: false,  //是否显示警告框
          alertText: ''  //传递给AlertTip组件的参数
        }
      },
      computed: {
        isPhoneRight () {   //手机号是否合法,简单判断一下
          return /^1\d{10}$/.test(this.phone)
        }
      },
      methods: {
        //获取短信验证码
        async getCode () {
          if(!this.leftSecond){    //leftSecond不为0时不能再次启动定时器和发送请求，不然连续点击按钮会启动多个定时器
            //1.启动倒计时
            this.leftSecond = 30
            this.intervalId = setInterval(() => {
              this.leftSecond--;
              if(this.leftSecond == 0) {
                clearInterval(this.intervalId)
                // console.log(intervalId)
              }
            },1000)
            //2.发送获取验证码请求
            const result = await reqSendCode(this.phone)
            if(result.code == 1){
              //显示提示
              this.Alertshow(result.msg)
              //停止计时
              if(this.intervalId){   //如果还在计时
                this.leftSecond = 0;
                clearInterval(this.intervalId)
                this.intervalId = undefined
              }
            }else {

            }
            // reqSendCode(this.phone).then(result => {   //这种方式也可以
            //   if(result.code == 1){
            //     //显示提示
            //     this.Alertshow(result.msg)
            //     //停止计时
            //     if(this.intervalId){   //如果还在计时
            //       this.leftSecond = 0;
            //       clearInterval(this.intervalId)
            //       this.intervalId = undefined
            //     }
            //   }else {
            //
            //   }
            // })
          }
        },
        //登录
        async login() {
          let result
          const {name,pwd,captcha,code,phone} = this
          //1.前台表单验证,验证不通过直接返回，通过就发送相应的登录请求
          if(this.loginWay){    //短信登录
            //手机号是否正确
            if(!this.isPhoneRight){
              //提示：手机号码格式不正确
              this.Alertshow('手机号码格式不正确')
              return
            }
            //手机验证码是否正确
            if(!code){
              //提示：手机验证码不正确
              this.Alertshow('手机验证码不正确')
              return
            }
            //前台验证都正确的话就可以发送短信登录验证请求然后把结果赋值给reslut
            result = await reqSmsLogin(phone,code)
          }else{     //账号密码登录
            if(!name){
              //提示：用户名不正确
              this.Alertshow('用户名不正确')
              return
            }
            if(!pwd){
              //提示： 密码不正确
              this.Alertshow('密码不正确')
              return
            }
            if(!captcha){
              //提示：验证码不正确
              this.Alertshow('验证码不正确!')
              return
            }
            //前台验证都正确的话就可以发送密码登录验证请求然后把结果赋值给reslut
            result = await reqPwdLogin({name, pwd, captcha})
          }
          if(this.intervalId){   //不管登录成功与否，如果还在计时就清除计时器
            this.leftSecond = 0;
            clearInterval(this.intervalId)
            this.intervalId = undefined
          }
          //2.处理请求结果
          if(result.code == 0){    //登录成功
            //保存user信息到state
            const user = result.data
            this.$store.dispatch('recordUserInfo',user)
            //返回首页
            this.$router.replace('/profile')
          }else{     //登录不成功
            //换个验证码(不太懂为什么，可能是后台要求的)
            this.getCaptcha();
            //弹出警告框
            this.Alertshow(result.msg)
          }
        },
        closeTip() {    //关闭警告框
          this.showAlert = false
          this.alertText = ''
        },
        //弹出警告框
        Alertshow(message){
          this.showAlert = true
          this.alertText = message
        },
        //得到新的一次性验证码,但是这样设计不，因为别的地方要用到这个方法
        // getCaptcha(event) {
        //   //每次指定的src要不一样
        //   event.target.src = 'http://localhost:4000/captcha?time='+Date.now()
        // }
        getCaptcha() {
          //每次指定的src要不一样
          this.$refs.captcha.src = 'http://localhost:4000/captcha?time='+Date.now()
        }
      },
      components: {
        AlertTip
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .loginContainer
    width 100%
    height 100%
    background #fff
    .loginInner
      padding-top 60px
      width 80%
      margin 0 auto
      .login_header
        .login_logo
          font-size 40px
          font-weight bold
          color #02a774
          text-align center
        .login_header_title
          padding-top 40px
          text-align center
          >a
            color #333
            font-size 14px
            padding-bottom 4px
            &:first-child
              margin-right 40px
            &.on
              color #02a774
              font-weight 700
              border-bottom 2px solid #02a774
      .login_content
        >form
          >div
            display none
            &.on
              display block
            input
              width 100%
              height 100%
              padding-left 10px
              box-sizing border-box
              border 1px solid #ddd
              border-radius 4px
              outline 0
              font 400 14px Arial
              &:focus
                border 1px solid #02a774
            .login_message
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .get_verification
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                border 0
                color #ccc
                font-size 14px
                background transparent
                &.right_phone
                  color black
            .login_verification
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .switch_button
                font-size 12px
                border 1px solid #ddd
                border-radius 8px
                transition background-color .3s,border-color .3s
                padding 0 6px
                width 30px
                height 16px
                line-height 16px
                color #fff
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                &.off
                  background #fff
                  .switch_text
                    float right
                    color #ddd
                &.on
                  background #02a774
                >.switch_circle
                  //transform translateX(27px)
                  position absolute
                  top -1px
                  left -1px
                  width 16px
                  height 16px
                  border 1px solid #ddd
                  border-radius 50%
                  background #fff
                  box-shadow 0 2px 4px 0 rgba(0,0,0,.1)
                  transition transform .3s
                  &.right
                    transform translateX(30px)
            .login_hint
              margin-top 12px
              color #999
              font-size 14px
              line-height 20px
              >a
                color #02a774
          .login_submit
            display block
            width 100%
            height 42px
            margin-top 30px
            border-radius 4px
            background #4cd96f
            color #fff
            text-align center
            font-size 16px
            line-height 42px
            border 0
        .about_us
          display block
          font-size 12px
          margin-top 20px
          text-align center
          color #999
      .go_back
        position absolute
        top 5px
        left 5px
        width 30px
        height 30px
        >.iconfont
          font-size 20px
          color #999
</style>
