var data = {
      //云开发环境id
      env: 'yhcloud-lh29m',
      //分享配置
      share_title: '北邮商城',
      share_img: 'https://pic.images.ac.cn/image/5e96ca70cc075', //可以是网络地址，本地文件路径要填绝对位置
      share_poster:'https://pic.images.ac.cn/image/5e96ca70cc075',//必须为网络地址
      //客服联系方式
      kefu: {
            weixin: 'peien670609',
            qq: '1018874885',
            gzh: '', //公众号二维码
            phone: '17709710903' //电话客服
      },
      //默认启动页背景图，防止请求失败完全空白 
      //可以是网络地址，本地文件路径要填绝对位置
      bgurl: '/images/startBg.jpg',
      
      //订单状态
      status: [
            {
              name: '已付款',
              id:0
            },
            {
               name: '退款中',
               id:1
            },
            {
               name: '已退款',
               id:2
            },
            {
               name: '已收货',
               id:3
            },
            {
               name: '未付款',
               id:4
            },
            {
               name: '退款失败',
               id:5
            },
            {
               name: '已发货',
               id:6
            }
],
      
      //校区
      campus: [{
                  name: '西土城校区',
                  id: 0
            },
            {
                  name: '宏福校区',
                  id: 1
            },
            {
                  name: '沙河校区',
                  id: 2
            },
            {
                  name: '世纪学院校区',
                  id: 3
            },
      ],
      //配置学院，建议不要添加太多，不然前端不好看
      category: [{
                  name:'手机数码',
                  id: 0
                 },
                 {
                  name: '图书典籍',
                  id: 1
                 },
                 {
                  name: '箱包',
                  id: 2
                 },
                 {
                  name: '化妆品',
                  id: 3
                 },
                 {
                  name: '运动户外',
                  id: 4
                  },
                  {
                    name:'服饰配件',
                    id: 5
                  },
                  {
                    name:'生活百货',
                    id: 6
                  },
                  {
                    name:'家用电器',
                    id: 7
                  },
                  {
                    name:'游戏装备',
                    id: 8
                  },
                  {
                    name:'家具/饰品',
                    id: 9
                  },
                  {
                    name:'玩具',
                    id: 10
                  },
                  {
                    name:'宠物用品',
                    id: 11
                  },
                  {
                    name:'技能服务',
                    id: 12
                  },
                  {
                    name:'男鞋',
                    id: 13
                  },
                  {
                    name:'女鞋',
                    id: 14
                  },
                  {
                    name:'乐器',
                    id: 15
                  },
                  {
                    name:'健身器材',
                    id: 16
                  },

            
                  
                                            
      ]
      
}
//下面的就别动了
function formTime(creatTime) {
      let date = new Date(creatTime),
            Y = date.getFullYear(),
            M = date.getMonth() + 1,
            D = date.getDate(),
            H = date.getHours(),
            m = date.getMinutes(),
            s = date.getSeconds();
      if (M < 10) {
            M = '0' + M;
      }
      if (D < 10) {
            D = '0' + D;
      }
      if (H < 10) {
            H = '0' + H;
      }
      if (m < 10) {
            m = '0' + m;
      }
      if (s < 10) {
            s = '0' + s;
      }
      return Y + '-' + M + '-' + D + ' ' + H + ':' + m + ':' + s;
}

function days() {
      let now = new Date();
      let year = now.getFullYear();
      let month = now.getMonth() + 1;
      let day = now.getDate();
      if (month < 10) {
            month = '0' + month;
      }
      if (day < 10) {
            day = '0' + day;
      }
      let date = year + "" + month + day;
      return date;
}
module.exports = {
      data: JSON.stringify(data),
      formTime: formTime,
      days: days
}