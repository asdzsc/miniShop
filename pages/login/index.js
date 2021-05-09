// pages/login/index.js
Page({
  handleGetUserInfo(e) {
    const {
      userInfo
    } = e.detail

    wx.setStorageSync("key", userInfo);
    wx.navigateBack({
      delta: 1
    });
  }

})