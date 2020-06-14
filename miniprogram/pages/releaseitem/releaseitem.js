const db = wx.cloud.database();
const app = getApp();
const config = require("../../config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    category: JSON.parse(config.data).category,
    campus: JSON.parse(config.data).campus,
    cid:'',
    ids:'',
    imgbox:[],                 //图片临时地址存放
    good_img_count:0,   
    fileIDs:[],               //fileID集合
    goods_imgurl:[],          //图片云端地址存放
    fileIDas:[],
    seller_name:'',
    seller_head:'',
    dura:''

  },

  chooseCategory(e) {
    let that = this;
    that.setData({
      cids: parseInt(e.detail.value)
    })
  },

  chooseCampus(e) {
    let that = this;
    that.setData({
      ids: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.initial();
   this.getSellerInfo()
   
  },

  onUnload:function(){
    console.log("123321",app.globalData.is_new)
    if(app.globalData.is_new==1){
     wx.showTabBarRedDot({
       index:3
     })
    }
  },


  initial() {
    
    let that = this;
    that.setData({
      good_name:'',
      good_price:0 ,
      ids:-1,
      cids: -1, 
      note_counts: 0,
      notes: '',
      like_count:0
     
    })
   
  },

  getSellerInfo(){
    let seller_head = seller_head
    let seller_name = seller_name
    let that =this
    db.collection('user').where({
      _openid:app.globalData.openid
    }).get({
      success:function(res){
        
        let info = res.data[0].info
        console.log(info)
        that.setData({
          seller_name:info.nickName,
          seller_head:info.avatarUrl,
          
        })
        
        
      },
      fail:function(res){},

    })
  },

  nameInput(e) {
    console.log(e)
    this.data.good_name = e.detail.value
  },

  priceInput(e) {
    console.log(e)
    this.data.good_price = parseInt(e.detail.value)
    console.log(this.data.good_price)
  },

  noteInput(e) {
    let that = this;
    that.setData({
      note_counts: e.detail.cursor,
      notes: e.detail.value,
    })
  },


 
 addPic(e) {                                     //添加图片函数实现
   
   var imgbox= this.data.imgbox;
   var that=this;
   var n=9;
   if(9>imgbox.length>0){                       //上传图片最大值n=9
     n=9-imgbox.length;
   }
   else if(imgbox.length==9){
     n=1;
   }
   wx.chooseImage({                             //用户选择图片
     count: n,
     sizeType: ['compressed'],
     sourceType: ['album', 'camera'],
     success:res=>{
       //console.log(res.tempFilePaths)
       var tempFilePaths = res.tempFilePaths              //临时路径
       if(imgbox.length==0){
         imgbox=tempFilePaths
       }
       else if(9>imgbox.length){
         imgbox=imgbox.concat(tempFilePaths);
       }
       that.setData({
         imgbox:imgbox
       });
       
      }
    })
  },


  imgbox(e){
   
    this.setData({
      imgbox:e.detail.value
    })
  },


  fb: function (e) {                                    //图片上传函数实现
    var fileIDs=this.data.fileIDs;
    
    let that = this;
    var j=this.data.imgbox.length;

    if (!this.data.imgbox.length) {
     wx.showToast({
      icon: 'none',
      title: '图片类容为空'
     });
    } else {
      //上传图片到云存储
      wx.showLoading({
       title: '发布中',
      })
      let promiseArr = [];
      
      for (let i = 0; i < this.data.imgbox.length; i++) {
        promiseArr.push(new Promise((reslove, reject) => {
      
    
        let item = this.data.imgbox[i];
        let suffix = /\.\w+$/.exec(item)[0];//正则表达式返回文件的扩展名

        wx.cloud.uploadFile({                           //上传至云存储
         cloudPath: new Date().getTime() + i + suffix, // 上传至云端的路径
         filePath: item, // 小程序临时文件路径
         success: res => {
           
          
           fileIDs=fileIDs.concat(res.fileID);
           
       
          if(fileIDs.length===j){
            
            db.collection('goods').add({               //将云存储数据上传至数据库保存
              data:{
                   good_name:that.data.good_name,
                   good_price:that.data.good_price,
                   classid:that.data.cids,
                   campusid:that.data.ids,
                   notes:that.data.notes,
                   imgbox:that.data.imgbox,
                   goods_imgurl:fileIDs,
                   like_count:0,
                   creat: new Date().getTime(),
                   dura: new Date().getTime() + that.data.dura * (24 * 60 * 60 * 1000),
                   seller_name:that.data.seller_name,
                   seller_head:that.data.seller_head,
                   
                   status:0                         //宝贝状态 0:待出售  1：交易中  2：交易完成
              },
              success:res=>{                //数据库上传成功
                console.log('OK',res)
                wx.navigateTo({
                  url: '/pages/releaseitemOK/releaseitemOK',
                })
              }
            })
        
        
        
        }
          
          reslove();
          wx.hideLoading();

          wx.showToast({
           title: "发布成功",
          })
         },


         fail: res=>{
          wx.hideLoading();
          wx.showToast({
           title: "发布失败",
          })
         }
   
        })
      }));
        
      }
       
      Promise.all(promiseArr).then(res => {//等数组都做完后做then方法
       console.log("图片上传完成后再执行")
       this.setData({
        imgbox:[]       
       })
      })
     }
     
    
   },

    
   imgDelete1: function (e) {                              //图片删除函数实现
    let that = this; 
    let index = e.currentTarget.dataset.deindex;           //页面传回的删除的图片索引参数
    let imgbox = this.data.imgbox;
    imgbox.splice(index, 1)
    that.setData({
     imgbox: imgbox
    });
   },
   
  confirmRelease(e){                                    //确认发布函数实现     信息合法性检验欠缺
    let that=this;
    
    if(!that.data.good_name){
      wx.showToast({
        title:'请输入宝贝名称',
        icon:'none',
      });
      return false;
    }
    if(!that.data.good_price){
      wx.showToast({
        title:'请输入价格',
        icon:'none',
      });
      return false;
    }
    if(that.data.cids==-1){
      wx.showToast({
        title:'请选择宝贝分类',
        icon:'none',
      });
      return false;
    }
    if(that.data.ids==-1){
      wx.showToast({
        title:'请选择校区',
        icon:'none',
      });
      return false;
    }
    if(!that.data.notes){
      wx.showToast({
        title:'请输入宝贝描述',
        icon:'none',
      });
      return false;
    }
    if(that.data.imgbox.length==0){
      wx.showToast({
        title:'请添加照片',
        icon:'none',
      });
      return false;
    }
    that.release();
  },

  release(){
    
    let that=this;
    wx.showModal({
      title: '温馨提示',
      content: '经检测您填写的信息无误，是否马上发布',
      success: (result) => {
        if (result.confirm) {
          that.fb();
          
        }
      },
    });
      
  }

  

})