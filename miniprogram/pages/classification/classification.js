const app = getApp()
const db = wx.cloud.database();
const config = require("../../config.js");
const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeKey: 0,
    campus: JSON.parse(config.data).campus,
    category:JSON.parse(config.data).category,
    list:[],
    currentIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let currentIndex = this.data.currentIndex
    wx.showLoading({
      title: '加载中',
    })
    this.getList()
  },

  onChange(e) {
   const {index} = e.currentTarget.dataset;
   this.setData({
     currentIndex:index
   })
   wx.showLoading({
    title: '加载中',
  })
   this.getList()
  },


  getList(){
    let currentIndex = this.data.currentIndex
    let list = this.data.list
    let that = this
    console.log(currentIndex)
    db.collection('goods').where({
      status:0,
      classid:currentIndex,
}).get({
      success: function(res) {
        wx.hideLoading();        
       console.log(res)
            that.setData({
                  list: res.data,                    
                                 
            })
            
            console.log(888,that.data.list)
            
            
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