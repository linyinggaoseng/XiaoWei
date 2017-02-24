var express = require('express')
    ,lodash =  require('lodash')
    ,validator =  require('../common/validator')
    ,EventChan = require('../common/event-channel')
    ,utils = require('../common/utils')
    ,pgutil = require('../pg/pg-util')
    ,notifyDao = require('../notify/server');

var router = express.Router();

router.use(function(req,res,next){
    // ... 一些中间的逻辑操作，就像其他的中间件。
    console.log('进入/notify');
    next();
});

router.post('/singleNotify', singleNotify);

module.exports = router;


function singleNotify(req,res){
 	var eventChan = new EventChan(req, res).listen();
    var channelId = req.body.channelId;
   	var msg = {
		"aps": {  
		     "alert":"百度云推送测试",
		     "content-available": 1,
		     "sound":"",  //可选
		      "badge":0,    //可选
		},
		"key1":"value1",
		"key2":"value2"
	}
	pgutil.processSuccessResult(eventChan,'消息发送成功');
	notifyDao.push_single_device(channelId,JSON.stringify(msg),null);
}


