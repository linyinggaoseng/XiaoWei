var async = require('async'),
    _ = require('lodash'),
    config = require('../config'),
    pgutil = require('../pg/pg-util'),
    utils = require('../common/utils'),
    userModel = require('../model/user'),
    reason = require('../common/reason'),
    aliService = require('../alipay/service'),
    querystring = require('querystring'),
    validator = require('../common/validator');

function alipayReq(data,envchan){

	if (validator.isNullOrEmpty(data.out_trade_no) || validator.isNullOrEmpty(data.amount)) {
		pgutil.processParamsFailureResult(envchan);
        return;
	}
	var desc = '0.01';
	var payInfo = { //构造支付请求信息
        out_trade_no:  data.out_trade_no, //商户订单号,商户系统内部的订单号,32个字符内、可包含字母
        total_fee: 	   Number(data.amount),   //单位：元，
        subject: 	   desc,   //如：50P币
    };
    var payReqStr = aliService.buildAliayPayReq(payInfo);
    pgutil.processSuccessResult(envchan, payReqStr);
}

/**
 * 发起支付求情
 */
exports.payRequest = function(data, envchan){
    if(!data.amount || !data.type){
        pgutil.processParamsFailureResult(envchan);
        return;
    }
    //发起支付请求
    if(Number(data.type) === 2 ){
       // wxpayReq(data, envchan);
    }
    else{
        alipayReq(data, envchan);
    }
};
/**
 * [alipayNotify description] 处理支付宝支付回调
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.alipayNotify = function(req,res){

    console.log('支付宝回调数据'+'\n'+ JSON.stringify(req.body));
   
    // aliService.handleCallback(req,res,function(err,result){
    //     console.log('支付宝回调数据'+'\n'+req.body);
    // });
}