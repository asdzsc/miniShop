// pages/cart/index.js
//获取用户地址
/**
 *  1. 绑定点击事件
      2. 调用小程序 api 获取地址 wx.chooseAddress
    2 获取 用户 对小程序 所授予 获取地址的 权限 状态 scope
      1 假设 用户 点击获取收货地址的提示框 确定 authSetting scope.address
    scope 值 true 直接调用 获取收货地址
      2 假设 用户 从来没有调用过 收货地址的api
    scope undefined 直接调用 获取收货地址
    3 假设 用户 点击获取收货地址的提示框 取消
    scope 值 false
      1 诱导用户 自己 打开 授权设置页面(wx.openSetting) 当用户重新给与 获取地址权限的时候
      2 获取收货地址
    4 把获取到的收货地址 存入到 本地存储中

    2 页面加载完毕
      0 onLoad onShow
      1 获取本地存储中的地址数据
      2 把数据 设置给data中的一个变量
    3 onShow
      0 回到商品详情页面 第一次添加商品手动添加属性
        num=1
        checked=true
      1.获取缓存中的数据
      2.把购物车中的数据 填充data中  
    4 全选的实现 数据的展示
      1 onShow 获取缓存中的购物车数组
      2 根据购物车中的商品数据 所有的商品都被选中 checked=true  全选就被选中
    5 总价格和总数量
      1 都需要商品被选中 我们才拿它来计算
      2 获取购物车数组
      3 遍历
      4 判断商品是否被选中
      5 总价格 += 商品的单价 * 商品的数量
      5 总数量 +=商品的数量
      6 把计算后的价格和数量 设置回data中即可
	6 商品的选中
		1 绑定change事件
		2 获取到被修改的商品对象
		3 商品对象的选中状态 取反
		4 重新填充回data中和缓存中
		5 重新计算全选。 总价格 总数量。。。
	7 全选和反选
		1 全选复选框绑定事件 change
		2 获取 data中的全选变量 allChecked
		3 直接取反 allChecked = !allChecked
		4 遍历购物车数组 让里面 商品 选中状态跟随 allChecked 改变而改变
    5 把购物车数组 和 allChecked 重新设置回data 把购物车重新设置回 缓存中
  8 商品数量的编辑
    1 "+"
      "-"
      按钮 绑定同一个点击事件 区分的关键 自定义属性
      1“ + ”"+1"
      2 "-"
      "-1"
    2 传递被点击的商品id goods_id
    3 获取data中的购物车数组 来获取需要被修改的商品对象
    4 当 购物车的数量 = 1 同时 用户 点击 "-"
  弹窗提示(showModal) 询问用户 是否要删除
    1 确定 直接执行删除
    2 取消 什么都不做
    4 直接修改商品对象的数量 num
    5 把cart数组 重新设置回 缓存中 和data中 this.setCart
  9 点击结算
    1 判断有没有收货地址信息
    2 判断用户有没有选购商品
    3 经过以上的验证 跳转到 支付页面！
 */
import {
    getSetting,
    chooseAddress,
    openSetting,
    showModal,
    showToast,
} from "../../utils/async-wx.js";
import { runtime } from "../../lib/runtime/runtime";
Page({
    /**
                 *
                 * //1.获取权限状态
                 wx.getSetting({
                   success: (result) => {
                     //获取权限状态  属性值怪异的时候 以[] 获取值
                     const scopeAddress = result.authSetting["scope.address"]
                     // console.log(scopeAddress);
                     //判断权限状态
                     if (scopeAddress === true || scopeAddress === undefined) {
                     //调用收货地址api
                       wx.chooseAddress({
                         success: (result1) => {
                           console.log(result1);
                         }
                       });
                     } else {
                     //诱导用户打开授权页面
                       wx.openSetting({
                         success: (result2) => {
                         //调用收货地址api
                           wx.chooseAddress({
                             success: (result3) => {
                               console.log(result3);
                             }
                           });
                         }
                       });
                     }
                   }
                 })
                 */
    data: {
        address: {},
        cart: [],
        allChecked: false,
        totalPrice: 0,
        totalNum: 0,
    },
    //收货地址
    async handleAddCart() {
        try {
            const res1 = await getSetting();
            //获取权限状态
            const scopeAddress = res1.authSetting["scope.address"];
            if (scopeAddress === false) {
                //诱导用户打开授权页面
                await openSetting();
            }
            //调用收货地址api
            let address = await chooseAddress();
            // console.log(res2);
            address.all =
                address.provinceName +
                address.cityName +
                address.countyName +
                address.detailInfo;
            //将收货地址放到缓存当中
            wx.setStorageSync("address", address);
        } catch (error) {
            console.log(error);
        }
    }, // 商品的选中
    handleItemChange(e) {
        //获取商品id
        const goods_id = e.currentTarget.dataset.id;
        //获取购物车数组
        let { cart } = this.data;
        //找到要修改的对象
        let index = cart.findIndex((v) => v.goods_id === goods_id);
        //选中状态取反
        cart[index].checked = !cart[index].checked;
        console.log(cart[index].checked);

        //填充数据到data中缓存中
        this.setCart(cart);
    },
    onShow() {
        //获取收货地址
        const address = wx.getStorageSync("address");
        // address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
        //获取缓存中的购物车数据
        const cart = wx.getStorageSync("cart") || [];
        this.setData({
            address,
        });
        this.setCart(cart);
        //判断全选 数组every方法 接收回调函数 每一个回调为true
        //返回true 一个为false 就返回false 空数组返回为true
        // const allChecked = cart.length ? cart.every(v => v.checked) : false
    },
    // 设置购物车状态同时 重新计算 底部工具栏的数据 全选 总价格 购买的数量
    setCart(cart) {
        let allChecked = true;
        // 1 总价格 总数量
        let totalPrice = 0;
        let totalNum = 0;
        cart.forEach((v) => {
            if (v.checked) {
                totalPrice += v.num * v.goods_price;
                totalNum += v.num;
            } else {
                allChecked = false;
            }
        });
        // 判断数组是否为空
        allChecked = cart.length != 0 ? allChecked : true;
        this.setData({
            cart,
            totalPrice,
            totalNum,
            allChecked,
        });
        wx.setStorageSync("cart", cart);
    },

    //设置商品增减
    async handleItemNumEdit(e) {
        //获取传过来的参数
        const { operation, id } = e.currentTarget.dataset;
        // console.log(operation, id);
        //获取购物车数据
        let { cart } = this.data;
        //找到需要修改的商品id
        const index = cart.findIndex((v) => v.goods_id === id);
        //判断数量为1是否删除
        if (cart[index].num === 1 && operation === -1) {
            //弹窗提示
            const res = await showModal({
                content: "您是否要删除此商品",
            });
            if (res.confirm) {
                cart.splice(index, 1);
                this.setCart(cart);
            }
        } else {
            //修改当前商品的数量
            // console.log(cart[index].num)
            cart[index].num += operation;
            //设置到缓存以及data中
            this.setCart(cart);
        }
    },
    //设置全选
    handleItemAllCheck() {
        // 获取data中的数据
        let { cart, allChecked } = this.data;
        // 修改值
        allChecked = !allChecked;
        //循环修改cart数组 中的商品选中状态
        cart.forEach((v) => (v.checked = allChecked));
        //把修改后的值 填充回data或者缓存中
        this.setCart(cart);
    },
    //设置结算
    async handlePay() {
        const { address, totalNum } = this.data;
        if (!address.userName) {
            await showToast({
                title: "您还没有添加收货地址",
            });
            return;
        }
        console.log(totalNum);

        if (totalNum === 0) {
            await showToast({
                title: "您还没有添加商品",
            });
            return;
        }
        wx.navigateTo({
            url: "/pages/pay/index",
        });
    },
});