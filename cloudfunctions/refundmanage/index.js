
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  console.log("234",event)
  let flag = event.flag
  console.log(flag)
  if(flag==0){                                                    //同意退款
  return await db.collection('order').where({
    good_id:event.refund_good_id
  }).update({
    data: {
     status:2
    }
   
  })
  
}

  if(flag==1){
  return await db.collection('order').where({                    //拒绝退款
    good_id:event.refund_good_id
  }).update({
    data: {
     status:5
    }
    
  })
  console.log(222)
}

}