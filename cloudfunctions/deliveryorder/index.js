const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  return await db.collection('order').where({
    good_id:event.goods_id
   }).update({
    data: {
     status:6,
     delivery_company:event.delivery_company,
     delivery_number:event.delivery_number    
    }
  })
}