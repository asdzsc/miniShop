// pages/category/index.js
import {
  request
} from '../../request/index.js'
import {
  runtime
} from '../../lib/runtime/runtime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //列表菜单
    leftMenuList: [],
    //列表内容
    rightContent: [],
    //当前下标
    currentIndex: 0,
    //列表内容右边数据的scrollTop值
    scrollTop: 0
  },
  //接口返回数据
  Cates: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取本地缓存
    const Cates = wx.getStorageSync("cates");

    if (!Cates) {
      //没有缓存 调取数据
      this.getCate()
    } else {
      //有缓存 不调取数据
      if (Date.now() - Cates.time > 1000 * 60 * 6 * 5) {
        //缓存过期 调取数据
        this.getCate()
      } else {
        //缓存未过期
        this.Cates = Cates.data
        let leftMenuList = this.Cates.map(v =>
          v.cat_name
        )
        let rightContent = this.Cates[0].children
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }

  },
  //获取数据
  async getCate() {
    // request({
    //   url: "/categories",
    // }).then(result => {
    //   console.log(result);
    //   this.Cates = result.data.message
    //   //获取数据并缓存到本地当中
    //   wx.setStorageSync("cates", {
    //     time: Date.now(),
    //     data: this.Cates
    //   });

    //   //构造左边菜单
    //   let leftMenuList = this.Cates.map(v =>
    //     v.cat_name
    //   )
    //   //构造右边商品
    //   let rightContent = this.Cates[0].children
    //   this.setData({
    //     leftMenuList,
    //     rightContent

    //   })

    // })
    const res = await request({
      url: "/categories"
    })
    // this.Cates = result.data.message
    this.Cates = res;
    //获取数据并缓存到本地当中
    wx.setStorageSync("cates", {
      time: Date.now(),
      data: this.Cates
    });

    //构造左边菜单
    let leftMenuList = this.Cates.map(v =>
      v.cat_name
    )
    //构造右边商品
    let rightContent = this.Cates[0].children
    this.setData({
      leftMenuList,
      rightContent

    })

  },
  // 左侧菜单切换标题内容
  handleTap(e) {
    const {
      index
    } = e.currentTarget.dataset
    //构造右边商品
    let rightContent = this.Cates[index].children
    this.setData({
      currentIndex: index,
      rightContent,
      //重置列表内容右边数据的scrollTop值
      scrollTop: 0
    })
  }
})