var goodsModel={
	queryGoodsList:'select * from goods limit ?,?',
	queryGoodsPicList:'SELECT pro._id,pro.price,pro.product_img,gds.goods_name FROM product pro LEFT JOIN goods gds on pro.goods_id = gds._id where goods_id = ? ORDER BY price asc',
	queryAttributesByProductId:'select goods_attr_id from product_goods_attr_extend where product_id = ?',
	queryAttributes:'select * from attribute order by _id asc',
	queryGoodsAttributes:'select * from goods_attr where attribute_id = ?'
}
exports.goodsModel = goodsModel;