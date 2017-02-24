var express = require('express')
    ,lodash =  require('lodash')
    ,validator =  require('../common/validator')
    ,EventChan = require('../common/event-channel')
    ,utils = require('../common/utils')
    ,ordersDao = require('../dao/order-dao');

var router = express.Router();

router.use(function(req,res,next){
    // ... 一些中间的逻辑操作，就像其他的中间件。
    console.log('进入/orders');
    next();
});

router.post('/confirm', confirmOrder);
router.post('/list',getOrderList);
router.post('/detail',getOrderDetail);
module.exports = router;

/*
下单
 */
function confirmOrder(req,res){
	var eventChan = new EventChan(req, res).listen();
	var user_id = req.body.user_id;
    var productIds = req.body.productIds;
    var orderAmount = req.body.orderAmount;
    var receive_id = req.body.receive_id;
    ordersDao.confirmOrder(Number(user_id),productIds,orderAmount,receive_id,eventChan);
}

/**
 * 获取订单列表
 */
function getOrderList(req,res){

    var eventChan = new EventChan(req, res).listen();
    var user_id = req.body.user_id;
    ordersDao.getOrderList(Number(user_id),eventChan);
}

/**
 *  获取订单详情
 */
function getOrderDetail(req,res){

    var eventChan = new EventChan(req, res).listen();
    var order_id = req.body.order_id;
    ordersDao.getOrderDetail(order_id,eventChan);
}
