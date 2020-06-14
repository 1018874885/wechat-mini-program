const app = getApp();
const config = require("../../config.js");
const db = wx.cloud.database();
// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      userInfo: {},
      hasUserInfo: app.globalData.hasUserInfo,
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
      showShare:false,
      poster: JSON.parse(config.data).share_poster,
      userFlag:0
  },

  showShare() {
    this.setData({
          showShare: true
    });
 },
//关闭弹窗
 closePop() {
    this.setData({
          showShare: false,
    });
},

preview(e) {
  wx.previewImage({
        urls: e.currentTarget.dataset.link.split(",")
  });
},
onShareAppMessage() {
  return {
        title: JSON.parse(config.data).share_title,
        imageUrl: JSON.parse(config.data).share_img,
        path: '/pages/start/start'
  }

},

  onLoad: function () {
    setTimeout(()=>{
      this.getUserFlag()
    },2500)
      
      this.getinfo()
      this.sethasUserInfo()
      
    },

    //页面在不同状态时设置hasUserInfo的值
    sethasUserInfo(e)
    { var that=this
      var hasUserInfo=this.data.hasUserInfo
      app.globalData.hasUserInfo=hasUserInfo
     },


    //不同状态下获取用户授权
    getinfo(){
      if (app.globalData.userInfo) {
        this.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo:true
                  
        })
      } else if (this.data.canIUse) {
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        app.userInfoReadyCallback = res => {
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
            
          })
        }
      } else {
        // 在没有 open-type=getUserInfo 版本的兼容处理
        wx.getUserInfo({
            
          success: res => {
            app.globalData.userInfo = res.userInfo
            this.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
              
            })
          }
        })
      }
    },

    onShow: function () {
     
      this.sethasUserInfo()
    },

  clickButton(e) {
   var that=this
   var hasUserInfo=this.data.hasUserInfo
   console.log(hasUserInfo)
  
    if (hasUserInfo==false) {
          
            wx.showModal({
                      title: '温馨提示',
                      content: '登录之后方可使用，请点击登录',
                      success(res) {
                            if (res.confirm) {
                                  wx.navigateTo({
                                        url: '/pages/mine/mine',
                                  })
                            }
                      }
                })}
        
     else{    
    
    wx.navigateTo({
          url: e.currentTarget.dataset.go
    })
}
},
    onUnload:function (){
      this.sethasUserInfo()
    },

    onHide:function(){
      this.sethasUserInfo()
    },



getUserInfo: function (e) {
  console.log(e,123)
  
  app.globalData.userInfo = e.detail.userInfo
  //用户点击授权按钮
  if (e.detail.errMsg == 'getUserInfo:ok') {
  this.setData({
    userInfo: e.detail.userInfo,
    hasUserInfo: true
  })
   this.upLoadUserInfo();
}
  //用户拒绝授权
  else if (e.detail.errMsg =='getUserInfo:fail auth deny'){
    console.log(123)
    wx.showModal({
      title: '温馨提示',
      content: '请选择授权方可完整使用本小程序',
      success(res) {
        if (res.confirm) {
          this.upLoadUserInfo();
          wx.navigateTo({
            url: '/pages/mine/mine',
          })
        }
      }
    })
  }
},


upLoadUserInfo(){
  if(this.data.userFlag == 0){
  let that = this;
  db.collection('user').add({
    data: {
          
          stamp: new Date().getTime(),
          info: that.data.userInfo,
          useful: true,
          parse: 0,
    },
    success: function(res) {
          console.log(res)
         
          
    },
    fail() {
         
    }
})
  }
  else if(this.data.userFlag == 1){
    
  }
},

exit(){
  this.setData({
    hasUserInfo:false,
    userFlag:1
  })
  wx.navigateTo({
    url: '/pages/mine/mine',
  })
},

getUserFlag(){
   
    let that = this
   db.collection('user').where({
      _openid:app.globalData.openid
    }).get({
      success:function(res){
        console.log(res)
        if(res.data.length==1){
          
          that.setData({
            userFlag:1
          })
        }
        console.log("userFlag=",userFlag)
      },
      fail:function(res){
        console.log("fail",res)
      }
    })
}

})














