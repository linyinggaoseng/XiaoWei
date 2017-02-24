var express = require('express')
    ,lodash =  require('lodash')
    ,validator =  require('../common/validator')
    ,EventChan = require('../common/event-channel')
    ,utils = require('../common/utils')
    ,cartsDao = require('../dao/carts-dao');

var router = express.Router();

router.use(function(req,res,next){
    // ... 一些中间的逻辑操作，就像其他的中间件。
    console.log('进入/carts');
    next();
});

router.post('/addToCarts', addToCarts);
router.post('/getCartList',getCartList);
module.exports = router;


function addToCarts(req,res){
    var eventChan = new EventChan(req, res).listen();
    var user_id = req.body.user_id;
    var product_id = req.body.product_id;
    var buy_num = req.body.buy_num;
    cartsDao.addToCarts(Number(user_id),Number(product_id),Number(buy_num),eventChan);
}

function getCartList(req,res){
 	var eventChan = new EventChan(req, res).listen();
    var user_id = req.body.user_id;
    cartsDao.getCartList(Number(user_id),eventChan);
}


