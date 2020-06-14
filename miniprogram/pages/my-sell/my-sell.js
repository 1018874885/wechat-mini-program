const app = getApp()
const db = wx.cloud.database();
const config = require("../../config.js");
const _ = db.command;
import Dialog from '/../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    campus: JSON.parse(config.data).campus,
    category:JSON.parse(config.data).category,
    status:JSON.parse(config.data).status,
    refund_good_id:'',
    show: false,
    actions: [
      {
        name: '同意退款',
        id:0
      },
      {
        name: '拒绝退款',
        id:1
      }
    ]
   },


   onClose() {
    this.setData({ show: false });
  },

  onSelect(event) {                                              //选择同意退款或拒绝退款
    wx.showLoading({
      title: '加载中',
    })
    console.log(event,this.data.refund_good_id);
    let refund_flag = event.detail.id
    let that = this
    wx.cloud.callFunction({                                       //修改数据库order的status的值
      name: 'refundmanage',
      data: {
        refund_good_id:that.data.refund_good_id,
        flag:event.detail.id
      },
      complete: res => {
        console.log('callFunction test result1: ', res)
        
      }
    })

    wx.cloud.callFunction({                                       //修改数据库中goods的status的值
      name: 'goodrefundmanage',
      data: {
        refund_good_id:that.data.refund_good_id,
        flag:event.detail.id
      },
      complete: res => {
        console.log('callFunction test result2: ', res)
        
      }
    })
    
    wx.cloud.callFunction({                                       //修改数据库中refund_order的status的值
      name: 'refundordermanage',
      data: {
        refund_good_id:that.data.refund_good_id,
        flag:event.detail.id
      },
      complete: res => {
        console.log('callFunction test result3: ', res)
        that.getList()
      }
    })

    
  


    if(refund_flag==0){
    wx.showToast({
      title: '退款成功',
      icon: 'success'
    })
   }

   if(refund_flag==1){
    wx.showToast({
      title: '已拒绝退款',
      icon: 'success'
    })
   }


    
  },

  manageRefund(e){
   
    console.log(e)
    this.setData({ 
      show: true,
      refund_good_id:e.currentTarget.dataset.item.good_id

    });
  },



  delivery(e){
    console.log(e)
    wx.navigateTo({
      url:'/pages/delivery/delivery?good_id=' + e.currentTarget.dataset.item.good_id
    })
  },
 
   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
     wx.showLoading({
       title: '加载中',
     })
     this.getList()
   },
 
 
   getList() {
     let list = this.data.list
     let that = this
    console.log(app.globalData.openid)
     db.collection('order').where({
           seller_id: app.globalData.openid
     }).orderBy('creat','desc').limit(20).get({
           success: function(res) {
             console.log(res)
                 wx.hideLoading()
                 
                 that.setData({
                       list: res.data,
                       
                 })
                 console.log(that.data.list)
               }
             })
    },


   



    go(e){
      let info = e.currentTarget.dataset.item
      let chatroom_id = info._openid + info.seller_id + info.good_id
      wx.navigateTo({                                                                       //进入聊天室
        url: '/pages/chatroom/room/room?id=' + chatroom_id + '&op_id=' + info._openid + '&good_pic='+ info.good_imgurl + '&op_name=' + info.own_name +'&good_id='+info.good_id 
      })
    },
  

    wuliu(e){                                 //显示物流信息
    
      Dialog.alert({
        title: '物流信息',
        message: '快递公司：' + e.currentTarget.dataset.item.delivery_company + '\n' + '物流单号：' + e.currentTarget.dataset.item.delivery_number
      }).then(() => {
        // on close
      });
    },


           
 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})