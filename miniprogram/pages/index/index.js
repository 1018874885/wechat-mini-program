const app = getApp()
const db = wx.cloud.database();
const config = require("../../config.js");
const _ = db.command;
Page({

    data:{
       carousellist:[],
       list:[],
       hasUserInfo:app.globalData.hasUserInfo,
       campus: JSON.parse(config.data).campus,
       category:JSON.parse(config.data).category,
    },

    onLoad(){
        this.getImages()
        this. getloginstatus()
        this.getList()
         },


    onShow: function () {
      
      this. getloginstatus()
    },
    detail(e){
      
      let that = this;
      let detail = e.currentTarget.dataset.detail;
      
        wx.navigateTo({
          url: '/pages/goods_detail/goods_detail?goods_id=' + detail._id,
        })
      
      
    },


    getImages() {
        let that=this;
        let imgArr = [];
        wx.cloud.database().collection("carousel").get({
          success(res) {
            
            let dataList = res.data;
            for (let i = 0; i < dataList.length; i++) {
              imgArr.push(dataList[i].url)
            }
            
            that.setData({
              carousellist: imgArr
            })
          },
          fail(res) {
            console.log("请求失败", res)
          }
        })
    
      },
      
      //去不同分类界面函数
      goclass(e) {
        console.log(111111,e)
        wx.navigateTo({
              url: e.currentTarget.dataset.go
        })
  },
  
  //获取用户是否登录函数
  getloginstatus(){
    this.setData({
      hasUserInfo:app.globalData.hasUserInfo
    })
  },

  onPullDownRefresh() {
    this.getList();
},
  getList() {                                  //获取商品列表
    let that = this;
    
    db.collection('goods').where({
          status:0,
    }).orderBy('creat', 'desc').limit(20).get({
          success: function(res) {
            wx.stopPullDownRefresh(); //暂停刷新动作
                that.setData({
                      list: res.data,                    
                    
                      
                      
                })
                console.log(888,that.data.list)
                
                
          }
         
    })
},

   























})