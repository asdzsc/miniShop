// pages/pay/index.js
/* 
1 页面加载的时候
  1 从缓存中获取购物车数据 渲染到页面中
    这些数据  checked=true 
2 微信支付
  1 哪些人 哪些帐号 可以实现微信支付
    1 企业帐号 
    2 企业帐号的小程序后台中 必须 给开发者 添加上白名单 
      1 一个 appid 可以同时绑定多个开发者
      2 这些开发者就可以公用这个appid 和 它的开发权限  
3 支付按钮
  1 先判断缓存中有没有token
  2 没有 跳转到授权页面 进行获取token 
  3 有token 。。。
  4 创建订单 获取订单编号
  5 已经完成了微信支付
  6 手动删除缓存中 已经被选中了的商品 
  7 删除后的购物车数据 填充回缓存
  8 再跳转页面 
 */
import {
	runtime
} from '../../lib/runtime/runtime'
Page({
	data: {
		address: {},
		cart: [],
		totalPrice: 0,
		totalNum: 0
	},
	onShow() {
		//获取收货地址
		let address = wx.getStorageSync("address");
		// address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
		//获取缓存中的购物车数据
		let cart = wx.getStorageSync('cart') || []
		//过滤选中的商品支付
		cart = cart.filter(v => v.checked)
		this.setData({
			address
		})
		let totalPrice = 0;
		let totalNum = 0;
		cart.forEach(v => {
			totalPrice += v.num * v.goods_price;
			totalNum += v.num;
		})
		this.setData({
			address,
			cart,
			totalPrice,
			totalNum
		})
	},
	//点击支付
	handleOrderPay(e) {
		// 判断是否有token
		const token = wx.getStorageSync("token");
		if (!token) {
			wx.navigateTo({
				url: '/pages/auth/index',

			});
			return
		}
	}
})