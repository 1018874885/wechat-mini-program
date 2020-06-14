const app = getApp()
const db = wx.cloud.database();
const config = require("../../config.js");
const _ = db.command;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    campus: JSON.parse(config.data).campus,
    category:JSON.parse(config.data).category,
    real_userinfo:'',
         tabs:[
           {
             id:0,
             value:"综合",
             isActive:true
           },
           {
            id:0,
            value:"价格",
            isActive:false
          },
          {
            id:0,
            value:"时间",
            isActive:false
          },
         ],



         list:[],
         price_list:[],
         creat_list:[]
  },

    //标题点击事件 从子组件传递过来
    handleTabsItemChange(e){
      //获取被点击的标题索引
      const {index}=e.detail;
      //修改源数组
      let {tabs}=this.data;
      tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
      //赋值到data中
      this.setData({
        tabs
      })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    wx.showLoading({
      title: '加载中',
    })
    this.getList();
    this.getPriceList()
    this.getCreatList();
    },

  onUnload:function(){
    console.log("123321",app.globalData.is_new)
    if(app.globalData.is_new==1){
     wx.showTabBarRedDot({
       index:3
     })
    }
  },
 

  getList() {                                  //获取商品列表
    let that = this;
    
    db.collection('goods').where({
          status:0,
          classid:3,
    }).get({
          success: function(res) {
           
             console.log("999",res)
                wx.hideLoading();
                wx.stopPullDownRefresh(); //暂停刷新动作
                that.setData({
                      list: res.data,                    
                      nomore: false,
                      page: 0,
                      
                      
                })
                
                console.log(888,that.data.list)
                
                
          }
         
    })
},


  getCreatList(){
    console.log("222222")
    let that = this;
    
    db.collection('goods').where({
          status:0,
          classid:3,
    }).orderBy('creat', 'desc').limit(20).get({
          success: function(res) {
           console.log("creat",res)
             
              
                that.setData({
                      creat_list: res.data,                    
                      nomore: false,
                      page: 0,
                      
                      
                })
              
                
                
          }
         
    })

  },

  getPriceList(){
 
    let that = this;
    
    db.collection('goods').where({
          status:0,
          classid:3,
    }).orderBy('good_price', 'asc').limit(20).get({
          success: function(res) {
           console.log("12313",res)
             
              
                that.setData({
                      price_list: res.data,                    
                      nomore: false,
                      page: 0,
                      
                      
                })
              
                
                
          }
         
    })



  },

  onPullDownRefresh() {
    this.getList();
  },

  getSeller(m) {                            //获取卖家信息
    
    let that = this;
    let userinfo=this.data.userinfo
    db.collection('user').where({
      _openid: m
    }).get({
      success: function (res) {
       
        
        that.setData({
          userinfo: res.data[0]        
        })
        console.log(res,123)
        
      }
    })
    
  },
 

})