var express = require('express')
    ,lodash =  require('lodash')
    ,validator =  require('../common/validator')
    ,EventChan = require('../common/event-channel')
    ,utils = require('../common/utils')
    ,payDao = require('../dao/pay-dao');

var router = express.Router();

router.use(function(req,res,next){
    // ... 一些中间的逻辑操作，就像其他的中间件。
    console.log('进入/pay');
    next();
});

router.post('/pay', pay);
router.post('/alipay/notify',alipayNotify);
module.exports = router;

/**
 * 登录验证
 */
function pay(req, res){
    var eventChan = new EventChan(req, res).listen();
    var type = req.body.type
        ,out_trade_no = req.body.out_trade_no
        ,amount = req.body.amount;
    var data = {
        type : type,
        out_trade_no : out_trade_no,
        amount : amount
    };
    payDao.payRequest(data,eventChan);
}

function alipayNotify(req,res){
    payDao.alipayNotify(req,res);
}