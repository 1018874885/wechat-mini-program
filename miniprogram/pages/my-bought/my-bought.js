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
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.getList()
  },


  getList() {
    wx.showLoading({
      title: '加载中',
    })
    let list = this.data.list
    let that = this
    console.log(123,app.globalData.openid)
    db.collection('order').where({
          _openid: app.globalData.openid
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
      url: '/pages/chatroom/room/room?id=' + chatroom_id + '&op_id=' + info.seller_id + '&good_pic='+ info.good_imgurl + '&op_name=' + info.seller_name +'&good_id='+info.good_id 
    })
  },


  refund(e){
   let item = e.currentTarget.dataset.item
   let that = this
   
   wx.showModal({
    title: '温馨提示',
    content: '申请退款前请与卖家联系',
    success(res) {
          if (res.confirm) {
               
            db.collection('refund_order').add({               //将云存储数据上传至数据库保存
              data:{
                   good_name:item.good_name,
                   good_id:item.good_id,
                   good_price:item.good_price,
                   classid:item.classid,
                   campusid:item.campusid,
                   notes:item.notes,
                   good_imgurl:item.good_imgurl,
                   creat: new Date().getTime(),
                   seller_id:item.seller_id,
                   seller_name:item.seller_name,
                   status:0              // 0：已申请退款  1：退款成功  2：拒绝退款
              },
              success:res=>{  
                console.log("已成功增加refund_order")             
                db.collection('order').doc(item._id).update({
                  data: {
                       status:1
                  },
                  success: function(res) {
                    console.log("已成功修改order")
                    
                    
                    that.getNewList()
                  },
                })



              }
            })
          }
    }
})
  

  },

  confirm(e){
    let item = e.currentTarget.dataset.item
    let that = this
    wx.showModal({
      title: '温馨提示',
      content: '是否确认收货',
      success(res) {
            if (res.confirm) {
              db.collection('order').doc(item._id).update({
                data: {
                     status:3
                },
                success: function(res) {
                  console.log("已成功修改order")
                  
                  
                  
                  that.getConList()
                },
              })
              wx.cloud.callFunction({                                       //修改数据库order的status的值
                name: 'confirmgood',
                data: {
                  good_id:item.good_id,
                 
                },
                complete: res => {
                  console.log('callFunction test result1: ', res)
                  
                }
              })
            
            
            }
          }
          })
  },


  detail(e){
    console.log(e)
    let good_id = e.currentTarget.dataset.detail.good_id
    wx.navigateTo({
      url: '/pages/goods_detail/goods_detail?goods_id=' + good_id,
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





  getNewList() {
    wx.showLoading({
      title: '加载中',
    })
    let list = this.data.list
    let that = this
    console.log(123,app.globalData.openid)
    db.collection('order').where({
          _openid: app.globalData.openid
    }).orderBy('creat','desc').limit(20).get({
          success: function(res) {
            console.log(res)
                wx.hideLoading()
                wx.showToast({
                  title: '申请成功',
                  icon: 'success'
                })
                that.setData({
                      list: res.data,
                      
                })
                console.log(that.data.list)
              }
            })
          },



          getConList() {
            wx.showLoading({
              title: '加载中',
            })
            let list = this.data.list
            let that = this
            console.log(123,app.globalData.openid)
            db.collection('order').where({
                  _openid: app.globalData.openid
            }).orderBy('creat','desc').limit(20).get({
                  success: function(res) {
                    console.log(res)
                        wx.hideLoading()
                        wx.showToast({
                          title: '已收货',
                          icon: 'success'
                        })
                        that.setData({
                              list: res.data,
                              
                        })
                        console.log(that.data.list)
                      }
                    })
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