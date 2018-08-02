import {RECIVE_ADDRESS,RECIVE_CATEGORYS,RECIVE_SHOPS,RECIVE_USERINFO,RESET_USERINFO,RECEIVE_RATINGS,RECEIVE_INFO,RECEIVE_GOODS,INCREMENT_FOOD_COUNT,DECREMENT_FOOD_COUNT,CLEAR_CART,RECIEVE_SEARCH_SHOP} from "./mutation-type";
import {reqAddress,reqFoodCategorys,reqShops,reqUserInfo,reqLogout,reqShopGoods,reqShopInfo,reqShopRatings,reqSearchShop } from "../api";

export default {
  // getAdress({commit,state}) {
  //   const geohash = state.latitude + "," + state.longitude
  //   reqAddress(geohash).then((result) => {
  //     const address = result.data
  //     if(result.code === 0){   //说明返回数据成功
  //       commit(RECIVE_ADDRESS,{address})
  //     }
  //   })
  // }
  //根据经纬度获得地址
  async getAdress({commit, state}) {
    const geohash = state.latitude + "," + state.longitude
    const result = await reqAddress(geohash)   //得到返回数据
    const address = result.data
    if (result.code === 0) {   //说明返回数据成功
      commit(RECIVE_ADDRESS, {address})
    }
  },
  //获取食品分类列表
  async getCategorys({commit}) {
    const result = await reqFoodCategorys()   //得到返回数据
    const categorys = result.data
    if (result.code === 0) {   //说明返回数据成功
      commit(RECIVE_CATEGORYS, {categorys})
    }
  },
  //根据经纬度获取商铺列表
  async getShops({commit, state}) {
    const {latitude, longitude} = state
    const result = await reqShops(latitude, longitude)   //得到返回数据
    const shops = result.data
    if (result.code === 0) {   //说明返回数据成功
      commit(RECIVE_SHOPS, {shops})
    }
  },
  //记录用户信息
  recordUserInfo({commit}, userInfo) {
    commit(RECIVE_USERINFO, {userInfo})
  },
  //从session获取用户信息
  async getUserInfo({commit}) {
    const result = await reqUserInfo()
    if (result.code == 0) {
      const userInfo = result.data
      commit(RECIVE_USERINFO, {userInfo})
    }
  },
  //登出
  async logout({commit}) {
    const result = await reqLogout()
    if (result.code == 0) {
      commit(RESET_USERINFO)
    }
  },
  // 异步获取商家信息
  async getShopInfo({commit}) {
    const result = await reqShopInfo()
    if (result.code === 0) {
      const info = result.data
      commit(RECEIVE_INFO, {info})
    }
  },
  // 异步获取商家评价列表
  async getShopRatings({commit},callback) {
    const result = await reqShopRatings()
    if (result.code === 0) {
      const ratings = result.data
      commit(RECEIVE_RATINGS, {ratings})
      //这种方法和watch的效果一样，都是数据更新后调用函数创建相应的对象，但是这个函数要在界面更新后调用，使用this.$nextick
      callback && callback()
    }
  },
  // 异步获取商家商品列表
  async getShopGoods({commit},callback) {
    const result = await reqShopGoods()
    if (result.code === 0) {
      const goods = result.data
      commit(RECEIVE_GOODS, {goods})
      //这种方法和watch的效果一样，都是数据更新后调用函数创建相应的对象，但是这个函数要在界面更新后调用，使用this.$nextick
      callback && callback()
    }
  },

  updateFoodCount({commit},{isAdd, food}){
    if(isAdd){
      commit(INCREMENT_FOOD_COUNT,{food})
    }else{
      commit(DECREMENT_FOOD_COUNT,{food})
    }
  },
  //清空购物车
  clearCart({commit}){
    commit(CLEAR_CART)
  },

  //搜索店铺
  async getSearchShop({commit,state},keyWord) {
    const geohash = state.latitude + "," + state.longitude
    const result = await reqSearchShop(geohash,keyWord)
    if (result.code == 0) {
      const searchShop = result.data
      commit(RECIEVE_SEARCH_SHOP, {searchShop})
    }
  }
}
