var orderModel={
	insertOne:'insert into orders (_id,order_no,user_id,receive_address_id,total_price,create_time) values(?,?,?,?,?,?)',
	insertOrder_product_extend:'insert into order_product_extend(_id,order_id,product_id,buy_num) values(null,?,?,?)',
	queryByUserId:'select * from orders where user_id = ? ORDER BY create_time asc',
	queryOrderDetail:'select * from (select a.order_id,a.product_id,a.buy_num,product.goods_id,product.price,product.product_img FROM order_product_extend as a left join product on a.product_id=product._id where order_id=?) as b left join goods on b.goods_id=goods._id'
}
exports.orderModel = orderModel;