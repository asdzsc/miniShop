import {
    request
} from '../../request/index.js'
import {
    runtime
} from '../../lib/runtime/runtime'
/*
1 发送请求获取数据
2 点击轮播图 预览大图
  1 给轮播图绑定点击事件
  2 调用小程序的api previewImage
3 点击 加入购物车
  1 先绑定点击事件
  2 获取缓存中的购物车数据 数组格式
  3 先判断 当前的商品是否已经存在于 购物车
  4 已经存在 修改商品数据 执行购物车数量++重新把购物车数组 填充回缓存中
  5 不存在于购物车的数组中 直接给购物车数组添加一个新元素 新元素 带上 购买数量属性 num 重新把购物车数组 填充回缓存中
  6 弹出提示
4 商品收藏
  1 页面onShow的时候 加载缓存中的商品收藏的数据
  2 判断当前商品是不是被收藏
    1 是 改变页面的图标
    2 不是。。
  3 点击商品收藏按钮
    1 判断该商品是否存在于缓存数组中
    2 已经存在 把该商品删除
    3 没有存在 把商品添加到收藏数组中 存入到缓存中即可
*/
// pages/goods_detail/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsObj: {},
        isCollect: false
    },
    //商品数据
    GoodsInfo: {},
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        let pages = getCurrentPages();
        let currentPage = pages[pages.length - 1];
        let options = currentPage.options;
        const {
            goods_id
        } = options;
        this.getGoodsDetail(goods_id);
    },
    //获取商品详情
    async getGoodsDetail(goods_id) {
        const goodsObj = await request({
            url: "/goods/detail",
            data: {
                goods_id

            }

        })
        this.GoodsInfo = goodsObj
        // 1 获取缓存中的商品收藏的数组
        let collect = wx.getStorageSync("collect") || [];
        // 2 判断当前商品是否被收藏
        let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);
        this.setData({
            goodsObj: {
                goods_name: goodsObj.goods_name,
                goods_price: goodsObj.goods_price,
                //iPhone部分手机不支持 webp格式图片  需要转换 最好找后天修改，临时改的话要确保后台也存在相应的格式  .webp =>.jpg
                goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
                pics: goodsObj.pics
            },
            isCollect
        })
    },
    //大图预览
    handlePreviewImage(e) {
        // console.log("ee");
        //构造需要预览的图片数组
        const urls = this.GoodsInfo.pics.map(v => v.pics_mid)
        //接受图片地址url
        const current = e.currentTarget.dataset.url
        wx.previewImage({
            current,
            urls
        });


    },
    //添加购物车
    handleCartAdd() {
        let cart = wx.getStorageSync("cart") || [];
        // console.log(cart);
        let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id)
        // console.log(index);
        if (index == -1) {
            //第一次添加数据
            this.GoodsInfo.num = 1;
            // 添加后设置选中状态
            this.GoodsInfo.checked = true;
            cart.push(this.GoodsInfo)
        } else {
            cart[index].num++
        }
        wx.setStorageSync("cart", cart);
        wx.showToast({
            title: '加入购物车成功',
            icon: 'success',
            mask: true
        });



    },
    //商品收藏
    handleCollect() {
        let isCollect = false;
        // 1 获取缓存中的商品收藏数组
        let collect = wx.getStorageSync("collect") || [];
        // 2 判断该商品是否被收藏过
        let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
        // 3 当index！=-1表示 已经收藏过 
        if (index !== -1) {
            // 能找到 已经收藏过了  在数组中删除该商品
            collect.splice(index, 1)
            isCollect = false
            wx.showToast({
                title: '取消成功',
                icon: 'success',
                mask: true
            });
        } else {
            // 没有收藏过
            collect.push(this.GoodsInfo)
            wx.showToast({
                title: '收藏成功',
                icon: 'success',
                mask: true
            });
            isCollect = true
        }
        // 4 把数组存入到缓存中
        wx.setStorageSync("collect", collect);
        // 5 修改data中的属性  isCollect
        this.setData({
            isCollect
        })
    }
})