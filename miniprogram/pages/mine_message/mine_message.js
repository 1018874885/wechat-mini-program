const db = wx.cloud.database();
const app = getApp();
const config = require("../../config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
     openid:app.globalData.openid,
     list:[],
     opposit_list:[],
     real_list:[],
     isShowNew:1,
     new_message_info:app.globalData.new_message_info,
     is_app_new_message:0,
     is_new:app.globalData.is_new,
     unloadFlag:0,
     showFlag:0,    //判断show函数是否需要再显示一遍
     newText:'',                //新消息
     newText_roomId:''          //新消息来源ID

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    if (app.globalData.hasUserInfo==false) {
      
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
          })
          setTimeout(()=>{
            this.setData({
             showFlag:1
            })
          },2500)
        
        
        }
    else{
    console.log("111")
    if(app.globalData.new_message_info.flag==1){
      this.data.is_app_new_message = 1
    }
    this.setData({
      unloadFlag:1,
      showFlag:1
    })
    this.getList();
    this.getWatcher()
  }
  },





  

  getList(){
    let list = this.data.list
    let real_list = this.data.real_list
    let is_app_new_message =this.data.is_app_new_message
    let i = 0
    let j = 0
    let n = 0
    let that = this
    db.collection('chatroom_index').where({                                         //查询与自己相关的信息列表
      "$or":[
      {seller_id:app.globalData.openid},{_openid:app.globalData.openid}
      ]
    }).get({
      success:function(res){
        console.log(res)
        that.setData({
        list : res.data
        })
        
       
        
        console.log("列表为",that.data.list,app.globalData.openid)
       


        for(i=0;i<that.data.list.length;i++){
         
          if(that.data.list[i].seller_id==app.globalData.openid){                  //对面用户id为买家
            that.data.list[i].isFlag = 1
            that.data.list[i].chatroom_id =  that.data.list[i]._openid + app.globalData.openid + that.data.list[i].current_good_id
                                                   
            
          }
          else if(that.data.list[i]._openid==app.globalData.openid){              //对面用户id为卖家
           that.data.list[i].isFlag = 0
           that.data.list[i].chatroom_id = app.globalData.openid + that.data.list[i].seller_id + that.data.list[i].current_good_id
           
          }
        }
        console.log("list",list,that.data.list)


        for(j=0;j<that.data.list.length;j++){
           real_list[j] = that.data.list[j]
        }


        console.log("新信息",real_list,app.globalData.new_message_info,that.data.is_app_new_message,is_app_new_message)
        if(is_app_new_message==1){
        for(n=0;n<that.data.list.length;n++){
          if(real_list[n].chatroom_id==app.globalData.new_message_info.newText_roomId){
            if(app.globalData.openid==app.globalData.new_message_info.newText_opid){               //在新消息发送方不显示新消息提醒
             real_list[n].newFlag = 1
             console.log(111)
            }
            if(app.globalData.openid!=app.globalData.new_message_info.newText_opid)
            real_list[n].newFlag = 0
            console.log(222)
          }
         
        }
      }
         
        is_app_new_message = 0
        that.setData({
          real_list:real_list,
          is_app_new_message:is_app_new_message
          
        })
        console.log("最后",real_list)
       
      }
    })

  },


  getWatcher(){
    let newText = this.data.newText
    let newText_roomId = this.data.newText_roomId
    let that = this
    const db = wx.cloud.database();
    const watcher = db.collection('chatroom').where({
      
      "$or":[
        {opId:app.globalData.openid},{_openid:app.globalData.openid}
        ]
        
    }) 
    .watch({
      onChange: function(snapshot) {
        console.log('docs\'s changed events', snapshot.docChanges)
        if(snapshot.docChanges.length==1){
        that.setData({
        newText : snapshot.docChanges[0].doc.textContent,
        newText_roomId : snapshot.docChanges[0].doc.groupId,
        newText_opid : snapshot.docChanges[0].doc.opId
        })
        console.log("666",that.data.newText,that.data.newText_roomId)
        that.getNewList()
      }
      },
      onError: function(err) {
        console.error('the watch closed because of error', err)
      }
    })
  },




  getNewList(){
    let list = this.data.list
    let real_list = this.data.real_list
    let newText = this.data.newText
    let newText_roomId = this.data.newText_roomId
    let newText_opid = this.data.newText_opid
    let i = 0
    let j = 0
    let n = 0
    let that = this
    console.log("9988",real_list,that.data.real_list,"123",newText_opid)
    db.collection('chatroom_index').where({                                         //查询与自己相关的信息列表
      "$or":[
      {seller_id:app.globalData.openid},{_openid:app.globalData.openid}
      ]
    }).get({
      success:function(res){
        console.log(res)
        that.setData({
        list : res.data
        })
        
       
        
        console.log("列表为12",that.data.list)
       


        for(i=0;i<that.data.list.length;i++){
         
          if(that.data.list[i].seller_id==app.globalData.openid){                  //对面用户id为买家
            that.data.list[i].isFlag = 1
            that.data.list[i].chatroom_id =  that.data.list[i]._openid + app.globalData.openid + that.data.list[i].current_good_id
                                                   
            
          }
          else if(that.data.list[i]._openid==app.globalData.openid){              //对面用户id为卖家
           that.data.list[i].isFlag = 0
           that.data.list[i].chatroom_id = app.globalData.openid + that.data.list[i].seller_id + that.data.list[i].current_good_id
           
          }
        }
        console.log("99",list,that.data.list)


        for(j=0;j<that.data.list.length;j++){
           real_list[j] = that.data.list[j]
        }
      
       console.log("对面id",real_list,app.globalData.openid,newText_opid)
       for(n=0;n<that.data.list.length;n++){
         if(real_list[n].chatroom_id==newText_roomId){
           if(app.globalData.openid==newText_opid){               //在新消息发送方不显示新消息提醒
            real_list[n].newFlag = 1
            console.log(111)
           }
           if(app.globalData.openid!=newText_opid)
           real_list[n].newFlag = 0
           console.log(222)
         }
        
       }

        that.setData({
          real_list:real_list
        })
        wx.showTabBarRedDot({
          index:3
        })
      
       
      }
      
    })
    console.log("最后的newlist",real_list)
  },
  


   

 
    

 

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    setTimeout(()=>{
      
      if (app.globalData.hasUserInfo==false && this.data.showFlag == 1 ) {
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
      else if(app.globalData.hasUserInfo==true && this.data.showFlag == 1){
        console.log("222!!")
        if(this.data.unloadFlag==0){
          this.getList();
          this.getWatcher();
          this.setData({
            unloadFlag:1
          })
        }
        else if(this.data.unloadFlag==1){
  
      console.log(111)
      let isShowNew = this.data.isShowNew
      if(isShowNew==0){
        wx.hideTabBarRedDot({
          index:3
        })
      }
    }
      }
    },1500)
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
   
   
    
   
  },


  

  
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  go(e){                                                       //判断进入的聊天室是否有新消息，如果是，进入聊天室后取消新消息提醒
    console.log("1111111111",e)
   let item = e.currentTarget.dataset.item
   let real_list = this.data.real_list
   let isShowNew = this.data.isShowNew
   let i = 0
   let that = this
   console.log("你好",item)
   for(i=0;i<real_list.length;i++){
     if(real_list[i].chatroom_id==item.chatroom_id){
       if(item.newFlag==1){
         real_list[i].newFlag = 0
         isShowNew = 0
         app.globalData.is_new = 0
       }
     }
   }

   


   
   that.setData({
     real_list:real_list,
     isShowNew:isShowNew
     
   })
   
  
  },
  
})









