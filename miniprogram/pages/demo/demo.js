
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
  onChange(event) {
    this.setData({
      activeKey:event.detail
    })
    this.getList()
   },
 
 
   getList(){
     let activeKey = this.data.activeKey
     let list = this.data.list
     let that = this
     console.log(activeKey)  
     db.collection('goods').where({
       status:0,
       classid:activeKey,
 }).get({
       success: function(res) {
        console.log(res)
             that.setData({
                   list: res.data,                    
                                  
             })
             
             console.log(888,that.data.list)
             
             
       }
      
 })
     
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
 