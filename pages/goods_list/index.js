import {
    request
} from '../../request/index.js'
import {
    runtime
} from '../../lib/runtime/runtime'
// pages/goods_list/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs: [{
            id: 0,
            value: "综合",
            isActive: true
        }, {
            id: 1,
            value: "销量",
            isActive: false
        }, {
            id: 2,
            value: "价格",
            isActive: false
        }],
        goodsList: []
    },
    QueryParams: {
        query: "",
        cid: "",
        pageNum: 1,
        pagesize: 10
    },
    // 总页数 
    totalPages: 1,





    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // console.log(options);
        this.QueryParams.cid = options.cid || ''
        this.QueryParams.query = options.query || ''
        // console.log(this.QueryParams.cid);
        this.getGoodsList()
    },
    //获取商品数据
    async getGoodsList() {
        // const res = await request({
        //     url: "/goods/search"
        // })
        // this.QueryParams = res
        // console.log(res);
        // this.setData({
        //         QueryParams
        //     })
        const res = await request({
            url: "/goods/search",
            data: this.QueryParams
        })
        //获取条数
        const total = res.total;
        //计算总页数
        this.totalPages = Math.ceil(total / this.QueryParams.pagesize)
        // console.log(this.totalPages);
        this.setData({
            goodsList: [...this.data.goodsList, ...res.goods]
        })
        //关闭下拉刷新窗口
        wx.stopPullDownRefresh()
    },
    // 标题点击事件
    handleBindItemTap(e) {
        //获取索引
        const {
            index
        } = e.detail
        console.log(index);
        //修改原数组
        let {
            tabs
        } = this.data
        tabs.forEach((v, i) =>
            i === index ? v.isActive = true : v.isActive = false
        )
        this.setData({
            tabs
        })
    },
    //下拉触底事件
    onReachBottom: function () {
        // console.log("eee");
        if (this.QueryParams.pageNum >= this.totalPages) {
            // console.log("没有数据了");
            wx.showToast({
                title: '没有下一页数据了',
            });


        } else {
            // console.log("有数据");
            this.QueryParams.pageNum++;
            this.getGoodsList()
        }

    },
    //上拉刷新
    onPullDownRefresh: function () {
        //重置数组
        this.setData({
            goodsList: []
        })
        console.log("ee");
        //重置页码
        this.QueryParams.pageNum = 1;
        //获取数据
        this.getGoodsList()

    }

})