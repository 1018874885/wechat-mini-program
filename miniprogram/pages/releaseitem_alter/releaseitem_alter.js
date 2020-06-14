const db = wx.cloud.database();
const app = getApp();
const config = require("../../config.js");
Page({

  
  data: {
    gid:'',
    category: JSON.parse(config.data).category,
    campus: JSON.parse(config.data).campus,
    good_name: '',
    good_price: 0,
    ids: -1,
    cids: -1,
    note_counts: 0,
    notes: '',

    imgbox: [],
    fake_imgbox:[],            //用于在编辑页面展示图片的集合  使用云端路径
    up_imgbox:[],              //用于图片上传数据库时的之前编辑保留的图片路径参数   使用云端路径
    init_imgurl_length:0,      //上次图片编辑保留的图片集合的最大索引值
   
    good_img_count: 0,
    fileIDs: [],
    goods_imgurl: [],
    fileIDas: [],
   
    

  },

  
  onLoad: function (options) {
    
    this.setData({                        //接收页面传递的宝贝id
      gid:options.gid
    })
   
    this.getdetail()
    
  },

  chooseCategory(e) {
    let that = this;
    that.setData({
      cids:  parseInt(e.detail.value)
    })
  },

  chooseCampus(e) {
    let that = this;
    that.setData({
      ids: e.detail.value
    })
  },
  nameInput(e) {
    console.log(e)
    this.data.good_name = e.detail.value
  },

  priceInput(e) {
    console.log(e)
    this.data.good_price =  parseInt(e.detail.value)
  },

  noteInput(e) {
    let that = this;
    that.setData({
      note_counts: e.detail.cursor,
      notes: e.detail.value,
    })
  },

  getdetail() {                                 //根据页面传递的参数获取宝贝信息的函数实现
    let good_id = this.data.gid;
    let that = this;
    db.collection('goods').where({              //根据条件搜索云数据库
      _openid: app.openid,
      _id:good_id
    }).get({                                    //获取宝贝信息
      success: function (res) {
        let info = res.data[0];
        console.log(res)
        that.setData({
             good_name:info.good_name,
             good_price:info.good_price,
             cids:info.classid,
             ids:info.campusid,
             notes:info.notes,
             goods_imgurl: info.goods_imgurl,
             imgbox: info.imgbox,
             fake_imgbox: info.goods_imgurl,
             init_imgurl_length : info.goods_imgurl.length-1,
             _id:info._id
        })
       
        
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












  addPic(e) {

    var imgbox = this.data.imgbox;
    var fake_imgbox = this.data.fake_imgbox;
    var that = this;

    var n = 9;
    if (9 > imgbox.length > 0 ) {
      n = 9 - imgbox.length;

    }
    else if (imgbox.length == 9) {
      n = 9;
    }
    wx.chooseImage({
      count: n,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        console.log(res.tempFilePaths)
        var tempFilePaths = res.tempFilePaths
        if (imgbox.length == 0) {
          imgbox = tempFilePaths,
          fake_imgbox = tempFilePaths
        }
        else if (9 > imgbox.length) {
          imgbox = imgbox.concat(tempFilePaths);
          fake_imgbox = fake_imgbox.concat(tempFilePaths);
        }
        that.setData({
          imgbox: imgbox,
          fake_imgbox:fake_imgbox,
        });

      }
    })
  },


  imgbox(e) {

    this.setData({
      imgbox: e.detail.value,
      fake_imgbox: e.detail.value,
    })
  },


  fb: function (e) {
    
    var fileIDs = this.data.fileIDs;

    let that = this;
    let up_imgbox = this.data.up_imgbox;
    var j = this.data.imgbox.length;
    var init_imgurl_length = this.data.init_imgurl_length;

    for(let k = 0;k <= init_imgurl_length;k++){                     //上次图片编辑保留的路径
      up_imgbox[k] = this.data.fake_imgbox[k]
  }
     

    
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
      console.log(init_imgurl_length,this.data.imgbox.length,11121)

      if(init_imgurl_length+1 !== this.data.imgbox.length){                           //非只删除图片编辑
      for (let i = init_imgurl_length+1; i < this.data.imgbox.length; i++) {
        promiseArr.push(new Promise((reslove, reject) => {


          let item = this.data.imgbox[i];
          let suffix = /\.\w+$/.exec(item)[0];//正则表达式返回文件的扩展名
          console.log(item)
          wx.cloud.uploadFile({
            cloudPath: new Date().getTime() + i + suffix, // 上传至云端的路径
            filePath: item, // 小程序临时文件路径
            success: res => {


              fileIDs = fileIDs.concat(res.fileID);
              var new_imgurls = that.data.up_imgbox.concat(fileIDs)           //生成的新的图片云端地址路径的集合
              console.log(new_imgurls,new_imgurls.length,j)
              if (new_imgurls.length === j) {                              //进行信息由云存储上传到云数据库的操作
                
                
                db.collection('goods').doc(that.data._id).update({
                
                   data: {
                     good_name: that.data.good_name,
                     good_price: that.data.good_price,
                     classid: that.data.cids,
                     campusid: that.data.ids,
                     notes: that.data.notes,
                     imgbox: that.data.imgbox,
                     goods_imgurl: new_imgurls,
                     creat: new Date().getTime(),
                     dura: new Date().getTime() + that.data.dura * (24 * 60 * 60 * 1000),

                     status: 0
                  },
                  success: res => {
                    console.log('OK', res)
                    wx.navigateTo({
                      url: '/pages/releaseitemOK/releaseitemOK',
                    })
                  },
                  fail: res=>{
                   console.log(11,res)
                  }
                })



              }

              reslove();
              wx.hideLoading();

              wx.showToast({
                title: "发布成功",
              })
            },
            fail: res => {
              wx.hideLoading();
              console.log('失败')
              wx.showToast({
                title: "发布失败",
              })
            }

          })
        }));

      }
    }


    else if(init_imgurl_length+1 === this.data.imgbox.length){                    //只删除图片编辑
      console.log(321313)
      db.collection('goods').doc(that.data._id).update({
                
        data: {
          good_name: that.data.good_name,
          good_price: that.data.good_price,
          classid: that.data.cids,
          campusid: that.data.ids,
          notes: that.data.notes,
          imgbox: that.data.imgbox,
          goods_imgurl: up_imgbox,
          creat: new Date().getTime(),
          dura: new Date().getTime() + that.data.dura * (24 * 60 * 60 * 1000),

          status: 0
       },
       success: res => {
         console.log('OK', res)
         wx.navigateTo({
           url: '/pages/releaseitemOK/releaseitemOK',
         })
       },
       fail: res=>{
        console.log(11,res)
       }
     })
    
    wx.hideLoading();

    wx.showToast({
    title: "发布成功",
     })
    }
            
         










      Promise.all(promiseArr).then(res => {//等数组都做完后做then方法
        console.log("图片上传完成后再执行")
        this.setData({
          imgbox: [],
          fake_imgbox: [],
        })
      })
    }


  },

  imgDelete1: function (e) {
   
    let that = this;
    let index = e.currentTarget.dataset.deindex;

    let imgbox = this.data.imgbox;
    let fake_imgbox = this.data.fake_imgbox;
    let init_imgurl_length = this.data.init_imgurl_length;
    console.log(init_imgurl_length)
    

    imgbox.splice(index, 1)
    fake_imgbox.splice(index, 1)
     
    if(index <= init_imgurl_length){                            //当新删除图片索引小于原图片集合最大索引时  将原图片集合最大索引值减1
      init_imgurl_length = init_imgurl_length - 1;
    }
    
    
    
    that.setData({
      imgbox: imgbox,
      fake_imgbox: fake_imgbox, 
      init_imgurl_length: init_imgurl_length     
    });
    console.log(index,fake_imgbox.length,imgbox.length,init_imgurl_length)

  
    
  },

  confirmRelease(e) {
    let that = this;

    if (!that.data.good_name) {
      wx.showToast({
        title: '请输入宝贝名称',
        icon: 'none',
      });
      return false;
    }
    if (!that.data.good_price) {
      wx.showToast({
        title: '请输入价格',
        icon: 'none',
      });
      return false;
    }
    if (that.data.cids == -1) {
      wx.showToast({
        title: '请选择宝贝分类',
        icon: 'none',
      });
      return false;
    }
    if (that.data.ids == -1) {
      wx.showToast({
        title: '请选择校区',
        icon: 'none',
      });
      return false;
    }
    if (!that.data.notes) {
      wx.showToast({
        title: '请输入宝贝描述',
        icon: 'none',
      });
      return false;
    }
    if (that.data.imgbox.length == 0) {
      wx.showToast({
        title: '请添加照片',
        icon: 'none',
      });
      return false;
    }
    that.release();
  },

  release() {

    let that = this;
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