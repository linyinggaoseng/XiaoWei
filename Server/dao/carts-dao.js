var async = require('async'),
    _ = require('lodash'),
    config = require('../config'),
    pgutil = require('../pg/pg-util'),
    utils = require('../common/utils'),
    cartsModel = require('../model/carts'),
    reason = require('../common/reason'),
    validator = require('../common/validator');

/**
 * 添加到购物车
 * @user_id  用户id
 * @product_id 产品id
 * @buy_num  购买数量
 * @envchan  回调通道  
 */
exports.addToCarts = function(user_id,product_id,buy_num, envchan){
	if (validator.isNullOrEmpty(user_id) || validator.isNullOrEmpty(product_id) 
		|| validator.isNullOrEmpty(buy_num) || !validator.isPositiveInteger(buy_num)) {
        pgutil.processParamsFailureResult(envchan);
        return;
    }
    pgutil.runFindByQuery(cartsModel.cartModel.queryOne,[user_id,product_id],function(err,result){
    	 if (validator.isNullOrEmpty(result)) {
    	 	var server_time = utils.formattime();
    	 	pgutil.runSave(cartsModel.cartModel.insertOne,[user_id,product_id,buy_num,server_time],envchan);
    	 }else{

    	 	pgutil.runSave(cartsModel.cartModel.addProductByCartId,[parseInt(buy_num),result[0]._id],envchan);
    	 }
    });
}

/**
 * 获取购物车列表
 * @user_id  用户id
 * @envchan  回调通道 
 */
exports.getCartList = function(user_id,envchan){
	if (validator.isNullOrEmpty(user_id)) {
        pgutil.processParamsFailureResult(envchan);
        return;
    }
    pgutil.runFindByQuery(cartsModel.cartModel.queryCartList,[user_id],function(err,result){
    	if(err){
            pgutil.processFailureResult(envchan, reason.DB_EXCEPTION_ERR_CODE, err);
            return;
        }
        //如果result为空 要返回数据集为空
        if (validator.isNullOrEmpty(result)) {return pgutil.processFailureResult(envchan, reason.RECORD_NOT_EXISTS_ERR_CODE, null);}
        var tasks = {};
        for (var i = 0; i < result.length; i++) {
            var product = result[i];
            var tmpItem = product.product_id;
            tasks['item' + i] = function(item){
                return function(callback){
                    pgutil.runFindByQuery(cartsModel.cartModel.queryAttribuyesByProductId,[parseInt(item)],callback);
                };
            }(tmpItem);//立即执行函数                
        }
        async.parallel(tasks, function(err, datas) {
                if (err) {
                    pgutil.processFailureResult(envchan, reason.DB_EXCEPTION_ERR_CODE, err);
                    return;
                }
                for (var i = 0; i < result.length; i++){
                    var product = result[i];
                    var attributesValues = [];
                    for(var j = 0; j < datas['item'+i].length;j++){
                        var attribute = datas['item'+i][j];
                        attributesValues.push(attribute.goods_attr);
                    }
                    product.attributeValues = attributesValues;
                }
                pgutil.processSuccessResult(envchan,result);
            });
    });
}