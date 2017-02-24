var async = require('async'),
    _ = require('lodash'),
    config = require('../config'),
    pgutil = require('../pg/pg-util'),
    utils = require('../common/utils'),
    goodsModel = require('../model/goods'),
    reason = require('../common/reason'),
    validator = require('../common/validator');

/**
 * [getGoodsList description]
 * @param  {[type]} page   分页'0,20'
 * @param  {[type]} hander 回调通道
 * @return {[type]}        返回标准化商品列表
 */
exports.getGoodsList = function(page,hander){
	if (validator.isNullOrEmpty(page)) {
		pgutil.processFailureResult(hander, reason.REQ_PARAM_ERR_CODE, "");
        return;
	}
    var pageToList = page.split(',');
    var start = parseInt(pageToList[0]);
    var count = parseInt(pageToList[1]);
	pgutil.runFindByQuery(goodsModel.goodsModel.queryGoodsList,[start,count],hander);
}


exports.getGoodsDetail = function(goods_id,hander){
    if (validator.isNullOrEmpty(goods_id)) {
        pgutil.processFailureResult(hander, reason.REQ_PARAM_ERR_CODE, "");
        return;
    }
    pgutil.runFindByQuery(goodsModel.goodsModel.queryGoodsPicList,[parseInt(goods_id)],function(err,result){
        if(err){
            pgutil.processFailureResult(hander, reason.DB_EXCEPTION_ERR_CODE, err);
        }else{
            //如果result为空 要返回数据集为空
            if (validator.isNullOrEmpty(result)) {return pgutil.processFailureResult(hander, reason.RECORD_NOT_EXISTS_ERR_CODE, null);}
            var data = {};
            var tasks = {};
            var pic = [];
            for (var i = 0; i < result.length; i++) {
                var product = result[i];
                pic.push(product.product_img);
                var tmpItem = product._id;
                tasks['item' + i] = function(item){
                    return function(callback){
                        pgutil.runFindByQuery(goodsModel.goodsModel.queryAttributesByProductId,[parseInt(item)],callback);
                    };
                }(tmpItem);//立即执行函数                
            }
            data.pic = pic;
            data.goods_name = result[0].goods_name;
            async.parallel(tasks, function(err, attributes) {
                if (err) {
                    pgutil.processFailureResult(hander, reason.DB_EXCEPTION_ERR_CODE, err);
                    return;
                }
                var products = [];
                for (var i = 0; i < result.length; i++){
                    var product = result[i];
                    var attributesIds = [];
                    for(var j = 0; j < attributes['item'+i].length;j++){
                        var attribute = attributes['item'+i][j];
                        attributesIds.push(attribute.goods_attr_id);
                    }
                    product.attributes = attributesIds;
                    products.push(product);
                }
                data.products = products;
                pgutil.processSuccessResult(hander,data);
            });
        }
    });
}

/**
 * [getGoodsAttributes description] 根据商品id获取标准化商品所有属性，这里默认认为所有标准化商品有相同的属性
 * @param  {[type]} goods_id 商品id
 * @param  {[type]} hander   回调通道
 * @return {[type]}          [description]
 */
exports.getGoodsAttributes = function(goods_id,hander){
    pgutil.runFindByQuery(goodsModel.goodsModel.queryAttributes,[],function(err,attributes){
        if(err){
            pgutil.processFailureResult(hander, reason.DB_EXCEPTION_ERR_CODE, err);
        }else{
            var tasks = {};
            for(var i = 0; i < attributes.length; i++){
                var attribute = attributes[i];
                var tmpItem = attribute._id;
                tasks['item' + i] = function(item){
                    return function(callback){
                        pgutil.runFindByQuery(goodsModel.goodsModel.queryGoodsAttributes,[parseInt(item)],callback);
                    };
                }(tmpItem);//立即执行函数  
            }
            async.parallel(tasks, function(err, attributeValues) {
                if (err) {
                    pgutil.processFailureResult(hander, reason.DB_EXCEPTION_ERR_CODE, err);
                    return;
                }
                var data = [];
                for(var i = 0; i < attributes.length; i++){
                    var attribute = attributes[i];
                    var attributeValue = attributeValues['item'+i];
                    attribute.attributeValues = attributeValue;
                    data.push(attribute);
                }
                pgutil.processSuccessResult(hander,data);
            });
        }
    });
}