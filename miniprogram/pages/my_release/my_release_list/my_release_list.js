// miniprogram/pages/my_release/my_release_list/my_release_list.js
const app = getApp()
const db = wx.cloud.database();
const config = require("../../../config.js");
const _ = db.command;

Page({

  
   
   
  data: {
    list: [],
    page: 1,
    scrollTop: 0,
    nomore: false,
    current_id:'',
    openid:app.globalData.openid

  },


  onLoad: function (options) {
  let openid = this.data.openid  
  console.log("onload",app.globalData.openid)
    wx.showLoading({
      title: '加载中',
    })
    
    this.getList();
  },

  
  onUnload:function(){
    console.log("123321",app.globalData.is_new)
    if(app.globalData.is_new==1){
     wx.showTabBarRedDot({
       index:3
     })
    }
  },

  getList() {
    
    let that = this;

    db.collection('goods').where({
          _openid: app.globalData.openid
    }).orderBy('creat', 'desc').limit(20).get({
          success: function(res) {
                wx.hideLoading();
                wx.stopPullDownRefresh(); //暂停刷新动作
                that.setData({
                      list: res.data,
                      nomore: false,
                      page: 0,
                })
                
          }
    })
},


  del(e) {
    let that = this;
    let del = e.currentTarget.dataset.del;
    wx.showModal({
      title: '温馨提示',
      content: '您确定要删除此商品信息吗？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在删除'
          })
          db.collection('goods').doc(del._id).remove({
            success() {
              wx.hideLoading();
              wx.showToast({
                title: '成功删除',
              })
              that.getList();
            },
            fail() {
              wx.hideLoading();
              wx.showToast({
                title: '删除失败',
                icon: 'none'
              })
            }
          })
        }
      }
    })
  },




  crash(e) {
    let that = this;
    let crash = e.currentTarget.dataset.crash;
    wx.showModal({
      title: '温馨提示',
      content: '您确定要擦亮吗？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在擦亮'
          })
          db.collection('goods').doc(crash._id).update({
            data: {
              creat: new Date().getTime(),
              dura: new Date().getTime() + 7 * (24 * 60 * 60 * 1000), //每次擦亮管7天
            },
            success() {
              wx.hideLoading();
              wx.showToast({
                title: '成功擦亮',
              })
              that.getList();
            },
            fail() {
              wx.hideLoading();
              wx.showToast({
                title: '操作失败',
                icon: 'none'
              })
            }
          })
        }
      }
    })
  },


   alt(e){
     console.log(e)
     var gid=e.currentTarget.dataset.del._id;
     console.log(gid)
     wx.navigateTo({
       url: '/pages/releaseitem_alter/releaseitem_alter?gid='+gid,       //传递商品id
     })
   },

   detail(e){
     console.log(111,e);
     let that = this;
     let detail = e.currentTarget.dataset.detail;
     if (detail.status == 0) {
       wx.navigateTo({
         url: '/pages/goods_detail/goods_detail?goods_id=' + detail._id,
       })
     }
   }


})