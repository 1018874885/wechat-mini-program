const app = getApp()
const db = wx.cloud.database();
const config = require("../../config.js");
const _ = db.command;

Page({

  /**
   * 页面的初始数据
   */
  data: {
     good_id:'',
     delivery_number:'',
     delivery_company:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
      this.setData({
        good_id:options.good_id
      })
     this.getInfo()
  },



  getInfo(){
    wx.showLoading({
      title: '加载中',
    })
    let good_id = this.data.good_id
    let that = this
    db.collection('order').where({
      good_id: that.data.good_id
}).get({
      success: function(res) {
        console.log(res)
            wx.hideLoading()
            
            that.setData({
                  item: res.data[0],
                  
            })
            console.log(that.data.item)
          }
        })
  },


  input1(e){
    this.setData({
      delivery_company:e.detail
    })
  },

  input2(e){
    this.setData({
      delivery_number:e.detail
    })
  },


  check(){
    
    if(!this.data.delivery_company){
      wx.showToast({
        title:'请输入快递公司名称',
        icon:'none',
      })
    }

    else if(!this.data.delivery_number){
      wx.showToast({
        title:'请输入物流单号',
        icon:'none',
      })
    }
    else
      this.confirm_delivery()

  },




  confirm_delivery(){
    wx.showLoading({
      title: '加载中',
    })
  

        console.log(this.data.good_id,this.data.delivery_company,this.data.delivery_number)
        wx.cloud.callFunction({                                       //修改数据库中该商品的status的值
          name: 'deliveryorder',
          data: {
            goods_id:this.data.good_id,
            delivery_company:this.data.delivery_company,
            delivery_number:this.data.delivery_number
           
          },
          complete: res => {
            console.log('callFunction test result: ', res)
          }
        })
        wx.hideLoading();
        wx.navigateTo({
          url: '/pages/delivery_ok/delivery_ok',
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