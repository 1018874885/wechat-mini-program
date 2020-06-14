// pages/help/help.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    des:'本应用为通过微信小程序原生MINA框架、结合小程序前端开发技术以及小程序的云开发技术实现的校园闲置物品交易小程序\n\n开发本应用是为了更好的帮助邮苑学子们解决由于各种不理想消费导致的经济压力或者是闲置物品引起的宿舍空间浪费等问题，希望能够真正实现物尽其用\n\n'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  copy(e) {
    wx.setClipboardData({
          data: e.currentTarget.dataset.copy,
          success: res => {
                wx.showToast({
                      title: '复制' + e.currentTarget.dataset.name + '成功',
                      icon: 'success',
                      duration: 1000,
                })
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