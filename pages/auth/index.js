// pages/auth/index.js
import {
  request
} from '../../request/index.js'
import {
  runtime
} from '../../lib/runtime/runtime'
import {
  login
} from '../../utils/async-wx.js'
Page({
  //获取用户信息
  async handleGetUserInfo(e) {
    try { //获取用户信息
      const {
        encryptedData,
        errMsg,
        iv,
        rawData
      } = e.detail
      //获取小程序登录成功后的code
      const {
        code
      } = await login()
      // console.log(code);
      const loginParams = {
        encryptedData,
        errMsg,
        iv,
        rawData,
        code
      }
      //发送请求
      const {
        token
      } = await request({
        url: "/users/wxlogin",
        data: loginParams,
        methods: "POST"
      })
      //将token值设置缓存中。并返回上一页
      wx.setStorage('key', token);
      wx.navigateBack({
        data: 1
      });
    } catch (error) {
      console.log(error);
    }
  }
})