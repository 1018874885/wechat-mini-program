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
    statusList:[],
    list:[],
    openid:app.globalData.openid
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let openid = this.data.openid  
 
    wx.showLoading({
      title: '加载中',
    })
    
    this.getList();
    

  },

  getList() {
    let list = this.data.list
    let i = 0
    let j = 0
    let k = 0
    let that = this;

    db.collection('collection').where({
          _openid: app.globalData.openid
    }).orderBy('time','desc').limit(20).get({
          success: function(res) {
                wx.hideLoading();
                wx.stopPullDownRefresh(); //暂停刷新动作
                that.setData({
                      list: res.data,
                      
                })
                console.log(that.data.list)
                
                /*console.log("11",that.data.list,i)


                var statusList =new Array(that.data.list.length)
                
               
                 while(i<that.data.list.length){
                 console.log(that.data.list[i].collect_good_id)
                  db.collection('goods').where({
                    _id:that.data.list[i].collect_good_id
                   
                  }).get({
                    
                    success:function(res){                                        //bug:查询成功的数据不是按照list数组中的顺序来的
                        
                        
                        console.log(res.data[0]._id,k,i)
                        statusList[k]=res.data[0].status;
                        
                        k++;
                        
                        console.log(statusList,k)
                       
                        if(k==that.data.list.length){
                        that.setData({statusList:statusList})}
                       
                      
                    },
                    fail:function(res){
                      
                    }
                  })
                  i++;
                  
                }
                */
                
                
                
                /*
                console.log("111",that.data.statusList)
                for(j=0;j<that.data.list.length;j++){
                console.log("223",j,that.data.list[j])
                that.data.list[j].status=statusList[j];
                console.log("3",j,that.data.list[j])
                }*/
              
                
          }
    })
   
        
},

detail(e){
  console.log(111,e);
  let that = this;
  let detail = e.currentTarget.dataset.detail;
  
    wx.navigateTo({
      url: '/pages/goods_detail/goods_detail?goods_id=' + detail.collect_good_id,
    })
  
  
},

collectGood(e){
  console.log(e)
  let info = e.currentTarget.dataset.detail
  console.log(info.iscollect,info)
  if(info.iscollect==1){
    
    db.collection('collection').doc(info._id).update({                    //将取消收藏的商品的iscollect置为0
                
      data: {
        iscollect: 0
     },
     success: res => {
       this.getList();
       console.log(12312,this.data.list)
     }
    })
  }

  else if(info.iscollect==0){
    
    db.collection('collection').doc(info._id).update({                    //将取消收藏的商品的iscollect置为0
                
      data: {
        iscollect: 1
     },
     success: res => {
      this.getList();
      console.log(12312,this.data.list)
    
  }})}
      
},

onUnload: function () {    
  
    console.log("123321",app.globalData.is_new)
    if(app.globalData.is_new==1){
     wx.showTabBarRedDot({
       index:3
     })
    }
                                          //页面卸载时将已取消收藏的商品从数据库中删除
  let list = this.data.list
  console.log(list)
  let i = 0
 
console.log(123123213,list)
for(i=0;i<list.length;i++){
  if(list[i].iscollect==0){
    let col_info = list[i]
    console.log(9999,col_info._id)
    db.collection('collection').doc(col_info._id).remove({
      success() {
        
      },
  })
}

}
},
onHide: function () {
  let list = this.data.list
  let i = 0
console.log(123123213,list)
for(i=0;i<list.length;i++){
  if(list[i].iscollect==0){
    let col_info = list[i]
    console.log(9999,col_info._id)
    db.collection('collection').doc(col_info._id).remove({
      success() {
        
      },
  })
}
}
},

onPullDownRefresh: function () {
  let list = this.data.list
  let i = 0
console.log(123123213,list)
for(i=0;i<list.length;i++){
  if(list[i].iscollect==0){
    let col_info = list[i]
    console.log(9999,col_info._id)
    db.collection('collection').doc(col_info._id).remove({
      success() {
        console.log("oko")
       this.onLoad();
      },
  })
}
}
},


  

 
})