//app.js
const app=getApp();
App({
  globalData: {
    hasUserInfo:false,
    userInfo: null,
    judgelogin: false,
    openid:'',
    new_message_info:[],
    is_new:0
  },
  data:{
    newText:'',
    newText_roomId:'',
    newText_opid:'',
    list:[],
    real_list:[],
    flag:0
  },

 
  
  onLaunch: function () {

   
  // 展示本地存储能力
  var logs = wx.getStorageSync('logs') || []
  logs.unshift(Date.now())
  wx.setStorageSync('logs', logs)
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'yhcloud-lh29m',
        traceUser: true,
      })
      let openid = this.globalData.openid
      let that = this
      wx.cloud.callFunction({
        name: 'getOpenid',
        complete: res => {
         console.log(res)
         this.globalData.openid = res.result.openId;
         //console.log("OPenid123123",this.globalData.openid)
         this.getWatcher()
        }
        
       })
    }
     
    
    
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
    })
    // 获取用户信息
    wx.getSetting({



         
      success: res => {
        
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log("11",this.globalData.userInfo)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      },
      fail: res =>{
        
      }
    })
   
    






    
  },
 

  getWatcher(){
    let openid = this.globalData.openid
    let new_message_info = this.globalData.new_message_info
    let is_new = this.globalData.is_new
    
    let newText = this.data.newText
    let newText_roomId = this.data.newText_roomId
    
    let that = this
    const db = wx.cloud.database();
    const watcher = db.collection('chatroom').where({
      
      "$or":[
        {opId:openid},{_openid:openid}
        ]
        
    }) 
    .watch({
      onChange: function(snapshot) {
        console.log('docs\'s changed events', snapshot.docChanges)
        if(snapshot.docChanges.length==1){
        
        that.globalData.new_message_info.newText = snapshot.docChanges[0].doc.textContent,
        that.globalData.new_message_info.newText_roomId = snapshot.docChanges[0].doc.groupId,
        that.globalData.new_message_info.newText_opid = snapshot.docChanges[0].doc.opId
        that.globalData.new_message_info.flag = 1
        that.globalData.is_new = 1
        console.log("666",that.globalData.new_message_info)
        wx.showTabBarRedDot({
          index:3
        })
      }
      },
      onError: function(err) {
        console.error('the watch closed because of error', err)
      }
    })
    
  },


 
})
