
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  /*return await db.collection('goods').doc(event.goods_id).update({
    data: {
     status:1
      
    }
  })*/
}