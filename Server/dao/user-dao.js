var async = require('async'),
    _ = require('lodash'),
    config = require('../config'),
    pgutil = require('../pg/pg-util'),
    utils = require('../common/utils'),
    userModel = require('../model/user'),
    reason = require('../common/reason'),
    validator = require('../common/validator');

/**
 * 登录验证，支持两种登录方式，手机号登录和用户名登录
 */
exports.auth = function(loginName, password, handler){
    if(!validator.isMobile(loginName) || validator.isNullOrEmpty(password)){
        pgutil.processFailureResult(handler, reason.AUTH_PHONE_PASSWORD_EMPTY_ERR_CODE, "");
        return;
    }
    pgutil.runFindByQuery(userModel.userModel.queryOne,[loginName,password],function(err,user){
        if(err){
            pgutil.processFailureResult(handler, reason.DB_EXCEPTION_ERR_CODE, err);
        }else if(!validator.isNullOrEmpty(user)){
            pgutil.processSuccessResult(handler, user[0]);
        }
        else{
            pgutil.processFailureResult(handler, reason.AUTH_PHONE_PASSWORD_ERR_CODE, err);
        }
    });
};