var async = require('async'),
    _ = require('lodash'),
    config = require('../config'),
    pgutil = require('../pg/pg-util'),
    utils = require('../common/utils'),
    cartsModel = require('../model/carts'),
   	ordersModel = require('../model/orders'),
    reason = require('../common/reason'),
    validator = require('../common/validator');


    /**
     * 下单
     * @param  {[type]} user_id            [description]
     * @param  {[type]} productIds         product_id组成的，分割的字符串
     * @param  {[type]} orderAmount        订单金额
     * @param  {[type]} receive_id，envchan 收货人信息id
     * @return {[type]}                    [description]
     */
    exports.confirmOrder = function(user_id,productIds,orderAmount,receive_id,envchan){
    	if (validator.isNullOrEmpty(user_id) || validator.isNullOrEmpty(productIds) 
			|| validator.isNullOrEmpty(orderAmount) || validator.isNullOrEmpty(receive_id)) {
		    pgutil.processParamsFailureResult(envchan);
		    return;
    	}
    	//先验证订单总金额是否正确
    	var productList = productIds.split(',');
    	var tasks = {};
    	for(var i = 0; i < productList.length; i++){
    		var tmpItem = productList[i];
    		tasks['item' + i] = function(item){
                return function(callback){
                    pgutil.runFindByQuery(cartsModel.cartModel.queryOneProductInCart,[user_id,item],callback);
                };
             }(Number(tmpItem));//立即执行函数 
         
    	}
    	async.parallel(tasks, function(err, productsInCart) {
            if (err) {
                pgutil.processFailureResult(hander, reason.DB_EXCEPTION_ERR_CODE, err);
                return;
            }
            var amount = 0;
            for(var i = 0; i < productList.length; i++){
            	var res = productsInCart['item'+i];
            	for(var j = 0; j < res.length; j++){
            		var product = res[j];
            		amount += Number(product.price) * Number(product.buy_num);
            	}
            }
            if (!(Number(amount).toFixed(2) == Number(orderAmount).toFixed(2))) {
            	//金额不对 返回错误信息
            	 pgutil.processFailureResult(envchan, reason.ORDER_AMOUNT_ERR_CODE, err);
                 return;
            }
            var uuid = utils.genUUid();
            //生成订单号 插入订单表
            var orderNo = utils.genOrderId();
            var server_time = utils.formattime();
            var sqlParamsEntity = [];
			var sql1 = ordersModel.orderModel.insertOne;
			var param1 = [uuid,orderNo,user_id,receive_id,Number(amount).toFixed(2),server_time];
			sqlParamsEntity.push(pgutil.getNewSqlParamEntity(sql1, param1));
			for(var i = 0; i < productList.length; i++){
    			var tmpItem = productList[i];
    			var tempSql = ordersModel.orderModel.insertOrder_product_extend;
    			var res = productsInCart['item'+i];
    			var product = res[0];
    			var tempParam = [uuid,Number(tmpItem),Number(product.buy_num)];
    			sqlParamsEntity.push(pgutil.getNewSqlParamEntity(tempSql, tempParam));
    		}

    		for(var i = 0; i < productList.length; i++){
    			var tmpItem = productList[i];
    			var tempSql = cartsModel.cartModel.deleteOne;
    			var res = productsInCart['item'+i];
    			var product = res[0];
    			var tempParam = [user_id,Number(product.product_id)];
    			sqlParamsEntity.push(pgutil.getNewSqlParamEntity(tempSql, tempParam));
    		}

			pgutil.execTrans(sqlParamsEntity,function(err,res){
				if (err) {
					pgutil.processFailureResult(envchan, reason.DB_EXCEPTION_ERR_CODE, err);
                	return;
				}else{
					pgutil.processSuccessResult(envchan,{orderNo:orderNo,amount:Number(amount).toFixed(2)});
				}
			});
           
        });
    };

    /**
    * 获取订单列表
    * @param  {[type]} user_id [description]
    * @param  {[type]} envchan [description]
    * @return {[type]}         [description]
    */
    exports.getOrderList = function(user_id,envchan){
        if (validator.isNullOrEmpty(user_id)) {
            pgutil.processParamsFailureResult(envchan);
            return;
        }
        pgutil.runFindByQuery(ordersModel.orderModel.queryByUserId,[user_id],envchan);
    }
    /**
     * 获取订单详情
     * @param  {[type]} order_id  订单id
     * @param  {[type]} envchan  [description]
     * @return {[type]}          [description]
     */
    exports.getOrderDetail = function(order_id,envchan){
        if (validator.isNullOrEmpty(order_id)) {
            pgutil.processParamsFailureResult(envchan);
            return;
        }
        pgutil.runFindByQuery(ordersModel.orderModel.queryOrderDetail,[order_id],function(err,result){
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