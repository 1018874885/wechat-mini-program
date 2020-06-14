const app = getApp()
const db = wx.cloud.database();
const config = require("../../config.js");
const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
  good_id:'',
  seller_id:'',
  info:{},
  radio:0,
  address:'',
  beizhu:'',
  name:''
 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   console.log(options)
   let good_id = this.data.good_id
   this.setData({
     good_id : options.goods_id,
     
   })
   this.getInfo()
   this.getName()
   
  },


  getInfo(){
  let good_id = this.data.good_id
  let that = this
    db.collection('goods').where({
     _id :good_id
     }).get({
      success: function(res) { 
        console.log(res)         
            that.setData({
                  info:res.data[0]                 
            })           
       }
     
    })
  },

  getName(){
    let that = this
    console.log(111,app.globalData.openid)
    db.collection('user').where({
      _openid: app.globalData.openid
  }).get({
      success: function(res) {
        console.log(res)
           
            
            that.setData({
                  name:res.data[0].info.nickName
                  
            })
            console.log(that.data.name)
          }
        })
  },


 


  onChange(event) {
    this.setData({
      radio: event.detail
    });
  },


  input1(e){
    this.setData({
      address:e.detail
    })
  },

  input2(e){
    this.setData({
      beizhu:e.detail
    })
  },



  check(){
    if(this.data.radio == 2){
      if(!this.data.address)
      wx.showToast({
        title:'请输入地址',
        icon:'none',
      });
      else
      this.onSubmit()
      
    }
    else if(this.data.radio == 0){
      wx.showToast({
        title:'请选择收货方式',
        icon:'none',
      });
    }
    else if(this.data.radio == 1){
    this.onSubmit();
    }
  },


  



  onSubmit(){
   let info = this.data.info
   let radio = this.data.radio
   let name = this.data.name
   console.log(info,this.data.address,this.data.beizhu)
   
  


   wx.showLoading({
    title: '加载中',
  })






   db.collection('order').add({               //将云存储数据上传至数据库保存
    data:{
         good_name:info.good_name,
         good_id:info._id,
         good_price:info.good_price,
         classid:info.classid,
         campusid:info.campusid,
         notes:info.notes,
         good_imgurl:info.goods_imgurl[0],
         radio:radio,
         address:this.data.address,
         beizhu:this.data.beizhu, 
         creat: new Date().getTime(),
         dura: new Date().getTime() + this.data.dura * (24 * 60 * 60 * 1000),
         seller_id:info._openid,
         seller_name:info.seller_name,
         own_name:name,
         status:0              //0:已付款 1：退款中  2：退款成功   3：已确认收货  4：未付款  5：拒绝退款  6：已发货
    },
    success:res=>{                //数据库上传成功
      console.log('OK',res,this.data.good_id)

      wx.cloud.callFunction({                                       //修改数据库中该商品的status的值
        name: 'goodstatus',
        data: {
          goods_id:this.data.good_id,
         
        },
        complete: res => {
          console.log('callFunction test result: ', res)
        }
      })


      wx.hideLoading();
      wx.navigateTo({
        url: '/pages/buy_ok/buy_ok',
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