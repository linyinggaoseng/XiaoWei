var cartModel={
	insertOne:'insert into carts(_id,user_id,product_id,buy_num,create_time) values(null,?,?,?,?)',
	queryOne:'select *from carts where user_id = ? and product_id = ?',
	deleteOne:'delete from carts where user_id = ? and product_id = ?',
	queryOneProductInCart:'select product_id,buy_num,price from carts left join product on carts.product_id= product._id where user_id = ? and product_id = ?',
	addProductByCartId:'update carts set buy_num=buy_num+? where _id = ?',
	updateProductByCartId:'update carts set buy_num=? where _id = ?',
	queryCartList:'select * from (select carts._id as cart_id,carts.product_id,carts.buy_num,carts.create_time,product.goods_id,'+
	'product.price,product.stock,product.product_img from carts left join product on carts.product_id = product._id where user_id = ? order by create_time desc) as sub left join goods on sub.goods_id = goods._id',
	queryAttribuyesByProductId:'select tb2.goods_attr from product_goods_attr_extend as tb1 left join goods_attr as tb2 on tb1.goods_attr_id = tb2._id where tb1.product_id = ?'

}
exports.cartModel = cartModel;