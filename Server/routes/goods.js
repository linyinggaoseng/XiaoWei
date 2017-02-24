var express = require('express')
    ,lodash =  require('lodash')
    ,validator =  require('../common/validator')
    ,EventChan = require('../common/event-channel')
    ,utils = require('../common/utils')
    ,goodsDao = require('../dao/goods-dao');

var router = express.Router();

router.use(function(req,res,next){
    // ... 一些中间的逻辑操作，就像其他的中间件。
    console.log('进入/goods');
    next();
});

router.post('/goodsList', getGoodsList);
router.post('/detail', getGoodsDetail);
router.post('/goodsAttributes', getGoodsAttributes);
module.exports = router;

/*
获取商品列表
 */
function getGoodsList(req,res){
	var eventChan = new EventChan(req, res).listen();
	var page = req.body.page;
    goodsDao.getGoodsList(page,eventChan);
}
/*
获取商品详情
 */
function getGoodsDetail(req,res){
    var eventChan = new EventChan(req, res).listen();
    var goods_id = req.body.goods_id;
    goodsDao.getGoodsDetail(parseInt(goods_id),eventChan);
}

function getGoodsAttributes(req,res){
    var eventChan = new EventChan(req, res).listen();
    var goods_id = req.body.goods_id;
    goodsDao.getGoodsAttributes(parseInt(goods_id),eventChan);
}