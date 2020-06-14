const app = getApp();
const config = require("../../config.js");
// pages/release/release.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
        hasUserInfo:app.globalData.hasUserInfo
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this. getloginstatus()
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
    
    this. getloginstatus()
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

  },

  onTabitemTap: function(){
    this. getloginstatus()
   
  },

  //获取用户是否登录函数
  getloginstatus()
  {
    this.setData({
      hasUserInfo:app.globalData.hasUserInfo
    })
  },
  

  clickButton1(e) {                   //判断用户是否登录
    var that=this
    var hasUserInfo=this.data.hasUserInfo
    console.log(hasUserInfo)
    console.log(e)
   
     if (hasUserInfo==false) {
           
             wx.showModal({
                       title: '温馨提示',
                       content: '登录之后方可使用，请点击登录',
                       success(res) {
                        console.log(res)
                             if (res.confirm) {
                                   wx.switchTab({
                                     url: '/pages/mine/mine',
                                                  });
                                    
                             }
                       }
                 })}
         
      else{    
     
        wx.navigateTo({
          url: '/pages/releaseitem/releaseitem',
        })
  
    
      
 }
},
})