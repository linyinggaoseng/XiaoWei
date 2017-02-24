var express = require('express')
    ,lodash =  require('lodash')
    ,validator =  require('../common/validator')
    ,EventChan = require('../common/event-channel')
    ,utils = require('../common/utils')
    ,userDao = require('../dao/user-dao');

var router = express.Router();

router.use(function(req,res,next){
    // ... 一些中间的逻辑操作，就像其他的中间件。
    console.log('进入/user');
    next();
});

router.post('/login', login);
module.exports = router;

/**
 * 登录验证
 */
function login(req, res){
    var eventChan = new EventChan(req, res).listen();
    var mobile = req.body.name
        ,password = req.body.password;
    userDao.auth(mobile, password, eventChan);
}