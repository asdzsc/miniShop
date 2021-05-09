/* 
1 输入框绑定 值改变事件 input事件
  1 获取到输入框的值
  2 合法性判断 
  3 检验通过 把输入框的值 发送到后台
  4 返回的数据打印到页面上
2 防抖 （防止抖动） 定时器  节流 
  0 防抖 一般 输入框中 防止重复输入 重复发送请求
  1 节流 一般是用在页面下拉和上拉 
  1 定义全局的定时器id
 */
// pages/search/index.js
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
		goods: [],
		isShow: false,
		isValue: ''
	},
	timer: 0,
	handleInput(e) {
		//获取输入框的值
		const {
			value
		} = e.detail
		// 2 检测合法性
		if (!value.trim()) {
			this.setData({
				goods: [],
				isShow: false
			})
			// 值不合法
			return;
		}
		clearTimeout(this.timer)
		//准备发送请求获取数据
		this.setData({
			isShow: true
		})
		this.timer = setTimeout(() => {
			this.querySearch(value)
		}, 1000);


	},
	async querySearch(query) {
		const res = await request({
			url: "/goods/qsearch",
			data: {
				query
			}
		})
		this.setData({
			goods: res
		})

	},
	handleCancel() {
		this.setData({
			goods: [],
			isShow: false,
			isValue: ''
		})
	}
})