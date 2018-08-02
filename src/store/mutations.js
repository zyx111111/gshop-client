import {RECIVE_ADDRESS,RECIVE_CATEGORYS,RECIVE_SHOPS,RECIVE_USERINFO,RESET_USERINFO,RECEIVE_GOODS,RECEIVE_INFO,RECEIVE_RATINGS,INCREMENT_FOOD_COUNT,DECREMENT_FOOD_COUNT,CLEAR_CART,RECIEVE_SEARCH_SHOP} from "./mutation-type";
import Vue from 'vue'
export default {
  [RECIVE_ADDRESS] (state,{address}) {
    state.address = address
  },
  [RECIVE_CATEGORYS] (state,{categorys}) {
    state.categorys = categorys
  },
  [RECIVE_SHOPS] (state,{shops}) {
    state.shops = shops
  },
  [RECIVE_USERINFO] (state,{userInfo}) {
    state.userInfo = userInfo
  },
  //这个是为了登出后清除用户信息，其他的RECIEVE_都是初始化数据
  [RESET_USERINFO] (state) {
    state.userInfo = {}
  },
  [RECEIVE_INFO](state, {info}) {
    state.info = info
  },
  [RECEIVE_RATINGS](state, {ratings}) {
    state.ratings = ratings
  },
  [RECEIVE_GOODS](state, {goods}) {
    state.goods = goods
  },
  [INCREMENT_FOOD_COUNT](state,{food}){
    //一开始没有定义food.count，所以要判断一下，不然没定义的属性++是NAN
    if(!food.count){
      Vue.set(food,'count',1)   //向响应式对象中添加一个属性，并确保这个新属性同样是响应式的，且触发视图更新。没有使用这个方法的话，count属性是新增属性没有数据绑定
      state.cartFoods.push(food)   //往购物车添加食品，只需在第一次添加食品时调用这个方法就可以了
    }else{
      food.count++
    }
  },
  [DECREMENT_FOOD_COUNT](state,{food}){   //state参数一定要写，因为这个回调函数会把state属性传给第一个参数
    if(food.count){    //如果food.count有值
      food.count--
      if(food.count == 0){    //这里要这样做的原因是当数量为0时从购物车里删除，因为购物车列表项的显示是根据cartFoods里面的food来循环的，如果不去掉的话，添加进购物车但数量减为0的也会显示出来
        state.cartFoods.splice(state.cartFoods.indexOf(food),1)
      }
    }
  },
  [CLEAR_CART](state) {
    //一定要这一步，不然只是state.cartFoods = []的话每个food的count还在
    state.cartFoods.forEach(food => food.count = 0)
    state.cartFoods = []
  },
  [RECIEVE_SEARCH_SHOP](state,{searchShop}) {
    state.searchShop = searchShop
  }
}
