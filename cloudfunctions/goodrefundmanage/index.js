
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  console.log("234", event)
  let flag = event.flag
  console.log(flag)
  

  if (flag == 0) {
    return await db.collection('goods').where({                    //同意退款
      _id: event.refund_good_id
    }).update({
      data: {
        status: 0
      }

    })
    console.log(222)
  }

}