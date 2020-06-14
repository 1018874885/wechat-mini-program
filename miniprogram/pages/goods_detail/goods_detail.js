const db = wx.cloud.database();
const app = getApp();
const config = require("../../config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
   show:false,                        //留言输入框是否显示
   show1:false,                       //回复输入框是否显示
   keyboardFocus:false,               //键盘是否显示
   campus: JSON.parse(config.data).campus,
   goods_id:'',
   current_id:'',
   isCollect:0,                          //记录商品是否被用户收藏的变量
   current_collect_good_id:'',            //记录当前被收藏的商品的唯一_id
   isLike:'false',                             //记录商品是否被用户点赞的变量
   current_like_good_id:'',               //记录当前被点赞商品的唯一_id
   like_count:0,
   openid:app.globalData.openid,
   strMsg:'',                          //留言内容
   strMsg_time:'',
   msgInfo:[],
   msgInfo1:[],
   msg_head:'',
   msg_name:'',
   re_options:[],
   flag:false,           //判断是否存在聊天框
   id1:'',
   isa:1,
   chatroom_id:'',
   own_info:[],
   hasUserInfo:app.globalData.hasUserInfo
   

   

   
  },
  
  showInput: function() {
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
          })}
    else{
    this.setData({
      show: true,
      
    })
   setTimeout(()=>{
    this.setData({
     keyboardFocus:true
    })
  },2000)
}
    
  },
  //隐藏输入框
  onHideInput: function() {
    this.setData({
      show: false,
     
    })
    setTimeout(()=>{
      this.setData({
       keyboardFocus:false
      })
    },9000)
  
  },

  bindInputMsg(e) {              //接收用户输入的留言
    let that = this;
    console.log(e)
    that.setData({
      
      strMsg: e.detail.value,
      strMsg_time:e.timeStamp
    })
  },

  sendTextMsg(){
    let strMsg = this.data.strMsg
    let strMsg_time = this.data.strMsg_time
    let re_options = this.data.re_options
    let openid = this.data.openid
    let goods_id = this.goods_id
    let that = this
    re_options.goods_id = ''
    console.log("333",app.globalData.openid,that.data.goods_id)

    db.collection('user').where({
      _openid:app.globalData.openid
    }).get({
      success:function(res){
        
        let info = res.data[0].info
        console.log(info)
        that.setData({
          msg_name:info.nickName,
          msg_head:info.avatarUrl,
          own_info:info
        })
        
      },
      fail:function(res){},

    }),
    
    db.collection('leave_message').where({
      
      goods_id:goods_id
    }).get({
      success: function (res) {
        
          console.log(111,goods_id,that.data.goods_id)
          db.collection('leave_message').add({
            data:{
              goods_id:that.data.goods_id,
              strMsg:that.data.strMsg,
              strMsg_time:that.data.strMsg_time,
              msg_head:that.data.msg_head,
              msg_name:that.data.msg_name
            },
            success:res=>{
              console.log("添加留言成功")
               
               re_options.goods_id=that.data.goods_id
               
               that.onLoad(re_options)
             
              
            },
            fail:res=>{}

          })
      
        }
        
        
      
    })
    
  },

  showInput1: function(e) {
    console.log(e)
    this.setData({
      show1: true,
      
    })
    
   setTimeout(()=>{
    this.setData({
     keyboardFocus:true
    })
  },2000)
    
    

  },
  //隐藏输入框
  onHideInput1: function() {
    console.log(12)
    this.setData({
      show1: false,
     
    })
    setTimeout(()=>{
      this.setData({
       keyboardFocus:false
      })
    },9000)
  
  },



  manage(){
    let gid = this.data.goods_id
    console.log(gid)
    wx.showModal({
      title: '温馨提示',
      content: '您确定要编辑吗？',
      success(res) {
        if (res.confirm) {
          
          wx.navigateTo({
            url: '/pages/releaseitem_alter/releaseitem_alter?gid='+gid,       //传递商品id
          })



        }
      }
    })
  },


  getSeller(m, n) {                            //获取卖家信息
    
    let that = this;
    db.collection('user').where({
      _openid: m
    }).get({
      success: function (res) {
        console.log("卖家信息",res)
        that.setData({
          userinfo:res.data[0]        
        })
        
      }
    })
    
  },

  getGoodsNum(m){                          //获取用户发布的所有商品信息
    let that = this;
    db.collection('goods').where({
      _openid:m
    }).get({
      success:function(res){
        
        that.setData({
          goods_num:res.data.length
        })
      }
    })
  },

  bygo(e){
  
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
          })}
    else{

    let own_info = this.data.own_info
    let sid = this.data.userinfo._openid                    //临时变量存储卖家Id
    let cgid = this.data.goods_id                           //临时变量存储商品Id
    let info = this.data.userinfo
    let good_imgurl_0 = this.data.goods_imgurl[0]
    this.setData({
      chatroom_id:app.globalData.openid+this.data.userinfo._openid+this.data.goods_id
    })
    
    let flag = this.data.flag
    console.log("yonghu",own_info)
    db.collection('chatroom_index').where({                    //对chatroon_id进行查找
      seller_id: this.data.userinfo._openid,
      
      _openid:app.globalData.openid,
      current_good_id:this.data.goods_id,
    }).get({

      success: function(res) {

        if(res.data.length!=0){                            //数据存在
        console.log("房间已存在",res,flag)
          flag=true
          
        }

        if(res.data.length==0){                           //数据不存在
          console.log("房间不存在1",res,flag)
          flag=false,
          console.log("11",own_info)
          db.collection('chatroom_index').add({           //建立新的聊天室索引数据
            data:{
              seller_id:sid,
              seller_name:info.info.nickName,
              seller_head:info.info.avatarUrl,
              current_good_id:cgid,
              current_good_imgurl:good_imgurl_0,
              own_name:own_info.nickName,
              own_head:own_info.avatarUrl,
              isFlag:0
             
            },
            success:res=>{
              console.log("添加聊天室记录成功")

            },
            fail:res=>{}

          })  
       
        }
        
           
            
      },
      fail:function(res) {
        console.log("房间不存在")
          flag=true
      
        console.log("房间不存在")
      }
        
    })
    
   console.log("000123",this.data.seller_name,this.data.goods_imgurl,this.data.good_id)
    wx.navigateTo({                                                                       //进入聊天室
      url: '/pages/chatroom/room/room?id=' + this.data.chatroom_id + '&op_id=' + this.data.userinfo._openid + '&good_pic='+ this.data.goods_imgurl[0] + '&op_name=' + this.data.seller_name +'&good_id='+this.data._id + '&seller_id=' + this.data.userinfo._openid
    })
    console.log(999,this.data.userinfo._openid,app.globalData.openid,this.data.chatroom_id,this.data.goods_id)
  }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    
    let goods_id=this.data.goods_id
    let current_id = this.data.current_id
    let msgInfo = this.data.msgInfo
    this.setData({
      goods_id:options.goods_id,
      
    })
    
    this.getOpenid(),
    this.getdetail(),
    
    this.getLeaveMessage(),
    this.getCollectInfo(),
    this.getLikeInfo()
    
    
    
  },

 
 
  
  /*db.collection('user').where({
    _openid:app.globalData.openid
  }).get({
    success:function(res){
      
      let info = res.data[0].info
      console.log("用户",info)
      that.setData({
        
        own_info:info
      })
      
    },
    fail:function(res){},

  })*/
 

  getOpenid() {                                  
    let current_id = this.data.current_id
    let id1 = this.data.id1
    let that = this;
    wx.cloud.callFunction({
     name: 'getOpenid',
     complete: res => {
      console.log('云函数获取到的openid: ', res.result.openId)
      var openid = res.result.openId;
      that.setData({
       current_id: openid,
       id1:this.data.current_id
      })
      console.log("OPenid123",this.data.current_id)
      db.collection('user').where({
        _openid:this.data.current_id
      }).get({
        success:function(res){
          
          let info = res.data[0].info
        
          that.setData({
            
            own_info:info
          })
          
        },
        fail:function(res){},
    
      })
     }
     
    })
   },
  

  getdetail() {                                   //获取商品详情
    let goods_id = this.data.goods_id;
    let current_id = this.data.current_id;
    let that = this;
    
    db.collection('goods').where({
      
      _id:goods_id
    }).get({
      success: function (res) {
        console.log(231,res);
        let info = res.data[0];
        
        that.setData({
             good_name:info.good_name,
             good_price:info.good_price,
             cids:info.classid,
             ids:info.campusid,
             notes:info.notes,
             goods_imgurl: info.goods_imgurl,
             imgbox:info.imgbox,
             _id:info._id,
             creat:info.creat,
             like_count:info.like_count,
             good_status:info.status,
             seller_name:info.seller_name,
             seller_head:info.seller_head
             

            
        })
        console.log("9990",that.data.current_id)
        that.getSeller(res.data[0]._openid, res.data[0]._id);
        that.getGoodsNum(res.data[0]._openid);
        console.log("9990",that.data.current_id)
        


      },
      fail() {
        wx.showToast({
          title: '获取失败',
          icon: 'none'
        })
        let e = setTimeout(
          wx.navigateBack({}), 2000
        )
      }
    })

   
    
      

  },


  getLeaveMessage(){                                     //获取商品留言信息
  
   let goods_id=this.data.goods_id
   let strMsg=this.data.strMsg
   let strMsg_time=this.data.strMsg_time
   let msgInfo=this.data.msgInfo
   let that = this;
   

   db.collection('leave_message').where({
     goods_id:goods_id,
   }).orderBy('strMsg_time', 'desc').limit(20).get({
     success:function(res){
       console.log(res,123)
       that.setData({
       msgInfo :res.data
       })
       console.log("msg",that.data.msgInfo)
    
     },
     fail:function(res){},
   })

   
   
  },
  /*
 getMessageUser(){                               //获取留言用户信息
   let msgInfo=this.data.msgInfo
   
   let user=new Array()
   let that =this
   let i=0;
   let j=0;
   for(i=0;i<msgInfo.length;i++){
     
     db.collection('user').where({
       
       _openid:msgInfo[i]._openid
     }).get({
       success:function(res){
         
         msgInfo[j].userHead = res.data[0].info.avatarUrl
         msgInfo[j].userName = res.data[0].info.nickName
         j++;
         
       },
       fail:function(res){},
       
     })
    }
    that.setData({
      msgInfo:msgInfo
    })
     
   console.log("liuyan",msgInfo,this.data.msgInfo)
   this.qqq()
 },*/

  getCollectInfo(){                                          //获取商品是否被用户收藏的信息
    let goods_id = this.data.goods_id;
    let that = this;
    db.collection('collection').where({
        collect_good_id:goods_id,
        _openid:app._openid
    }).get({
      success: function (res) {

        
        if(res.data.length==0){
        that.setData({
         isCollect:0
        })
      }else{
        that.setData({
          isCollect:1,
          current_collect_good_id:res.data[0]._id           //获取当前商品数据库collection的_id
        })
       
           }
        
  },
  fail(){}
  
})
},




  collectGood1(e){         
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
          })}
    else{
    let id1 = this.data.id1
                                               //用户给其他用户的商品进行点赞
    console.log("点击收藏按钮")
  
    let goods_id = this.data.goods_id
    let isCollect = this.data.isCollect
    let current_collect_good_id = this.data.current_collect_good_id
    
    
    if(isCollect==0){
    db.collection('collection').add({                                      //将收藏的商品加入到数据库collection
      data:{
        collect_good_id:this.data.goods_id,
        good_name:this.data.good_name,
        good_price:this.data.good_price,
        ids:this.data.ids,
        cids:this.data.cids,
        notes:this.data.notes,
        good_imgurl:this.data.goods_imgurl[0],
        time:e.timeStamp,
        seller_name:this.data.seller_name,
        seller_head:this.data.seller_head,
        iscollect:1

      },
      success:res=>{
        wx.showToast({
          title: '收藏成功',
          icon:'none'
        })
        this.setData({
          isCollect:1
         })
         this.getCollectInfo()
      },
      fail:res=>{
        wx.showToast({
          title: '收藏失败',
          icon:'none'
        })
      }
    })
  }
  else if(isCollect==1){                                                          //将collection中要取消收藏的商品从数据库中删除
    db.collection('collection').doc(current_collect_good_id).remove({
      success:res=>{
        wx.showToast({
          title: '取消收藏',
          icon:'none'
        })
        this.setData({
          isCollect:0
         })
         this.getCollectInfo()
      }
    })
    
  }
}
  },
  
  collectGood2(){                                                //用户不能收藏自己的商品
    if(app.globalData.hasUserInfo==false) {
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
    wx.showToast({
      title: '不能收藏自己的宝贝哦~',
      icon:'none'
    })
  }
  },


  getLikeInfo(){                                          //获取商品是否被用户点赞的信息
    let goods_id = this.data.goods_id;
    let that = this;
    db.collection('like').where({
        like_good_id:goods_id,
        _openid:app.globalData.openid
    }).get({
      success: function (res) {

        console.log("找到喜欢的商品",res)
        if(res.data.length==0){
        that.setData({
         isLike:'false'
        })
      }else{
        that.setData({
          isLike:'true',
          current_like_good_id:res.data[0]._id           //获取当前商品数据库like的_id
        })
       
           }
        
  },
  fail(){}
  
})
  

  },


 getLikeCount(){
  let goods_id = this.data.goods_id;
 
  let that = this;
  
  db.collection('goods').where({
    
    _id:goods_id
  }).get({
    success: function (res) {
      
      let info = res.data[0];
      
      that.setData({          
           like_count:info.like_count,    
      })
      
    },
    fail() {}
      
      })
      console.log("函数获取喜欢数",this.data.like_count)
      
    },




likeGood1(){                                                             //用户给其他用户的商品进行点赞
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
        })}
  else{
  let goods_id = this.data.goods_id
  let current_id = this.data.current_id
  this.getLikeCount()
  
  let like_count = this.data.like_count
  console.log("点赞数获取：",like_count,"isLike",this.data.isLike)
  let isLike = this.data.isLike
  let current_like_good_id = this.data.current_like_good_id

  switch(isLike){
  case 'false':
    
  db.collection('like').add({                                      //将收藏的商品加入到数据库collection
    data:{
      like_good_id:this.data.goods_id,
    },
    success:res=>{
      wx.showToast({
        title: '点赞成功',
        icon:'none'
      })
      like_count = like_count + 1
      this.setData({
        isLike:'true',
        like_count:like_count
       })
       console.log("点赞后喜欢数",this.data.like_count,"isLike",this.data.isLike)
       this.getLikeInfo()
      
      
      
      wx.cloud.callFunction({                                       //修改数据库中like_count的值
        name: 'likecount',
        data: {
          goods_id:this.data.goods_id,
          like_count: this.data.like_count,
         
        },
        complete: res => {
          console.log('callFunction test result: ', res)
        }
      })
      
    },
    fail:res=>{
      wx.showToast({
        title: '点赞失败',
        icon:'none'
      })
    }
  })

                            
    
break;

case 'true':  
                                                        //将collection中要取消收藏的商品从数据库中删除
  db.collection('like').doc(current_like_good_id).remove({
    success:res=>{
      wx.showToast({
        title: '取消点赞',
        icon:'none'
      })
      like_count = like_count -1
      this.setData({
        isLike:'false',
        like_count:like_count
       })
       
       console.log("取消点赞后",this.data.like_count,"isLike",this.data.isLike)
       this.getLikeInfo()
     

       wx.cloud.callFunction({
        name: 'likecount',
        data: {
          goods_id:this.data.goods_id,
          like_count: this.data.like_count,        
        },
        complete: res => {
          console.log('callFunction test result: ', res)
        }
      })
    
    }
  })
  

break;
  }
}
},

likeGood2(){                                                //用户不能收藏自己的商品
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
        })}
  else{
  wx.showToast({
    title: '不能点赞自己的宝贝哦~',
    icon:'none'
  })
}
},

})

