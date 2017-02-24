var mysql = require('mysql');
var config = require('../config'),
    constant = require('../common/constant'),
    under = require('lodash'),
    resp = require('../common/response'),
    reason = require('../common/reason');
    validate = require('../common/validator');
// 使用连接池，提升性能
var pool  = mysql.createPool(config.MYSQL);
var async = require('async');


/**
 * 参数错误，直接错误返回
 * @type {processParamsFailureResult}
 */
exports.processParamsFailureResult = function(handler){
    processFailureResult(handler, reason.REQ_PARAM_ERR_CODE, 'field name validation failed');
};

var processSuccessResult = exports.processSuccessResult = function(handler, redata){
    if(!handler){
        return;
    }
    if(typeof(handler) == 'function'){
        handler(null, redata);
    }
    else{
        handler.emit(constant.EVENT_SUCCESS, resp.genHttpResp(reason.SUCCESS, redata));
    }
};

var processFailureResult = exports.processFailureResult = function(handler, code, err){
    if(!handler){
        return;
    }
    if(typeof(handler) == 'function'){
        handler(code, reason.getReason(code));
    }
    else{
        handler.emit(constant.EVENT_FAILURE, resp.genHttpResp(code, null, err));
    }
};

/**
 * 处理数据保存或更新的返回结果
 * @param handler 事件通道
 * @param err 错误信息
 */
var processSaveResult = exports.processSaveResult = function(handler, err, data){
    if(err){
        processFailureResult(handler, reason.DB_CONSTRAINT_ERR_CODE, err);
    }
    else{
        processSuccessResult(handler, data);
    }
};

/**
 * 处理查询结果
 * @param handler 事件通道
 * @param err 错误对象
 * @param data 结果对象
 * @param errcode 错误码
 */
var processFindResult = exports.processFindResult = function(handler, err, data, errcode){
    if(err){
        processFailureResult(handler, reason.DB_EXCEPTION_ERR_CODE, err);
    }
    else if(!validate.isNullOrEmpty(data)){
        processSuccessResult(handler, data);
    }
    else{
    	if (!errcode) {
    		errcode = reason.RECORD_NOT_EXISTS_ERR_CODE;
    	}
        processFailureResult(handler, errcode, err);
    }
};

/**
 * 执行查询命令
 * @param  sql sql语句
 * @param  params 查询参数
 * @param  handler 事件通道或回调函数
 * @return 
 */
exports.runFindByQuery = function(sql,params,handler){
	if (!handler) {
		return;
	}
	pool.getConnection(function(err, connection) {
		if (err) {
			if(under.isFunction(handler)){
	        	handler(err, null);
	        	return;
	    	}
			processFailureResult(hander,reason.DB_EXCEPTION_ERR_CODE,err);
		}else{
			var query = connection.query(sql,params,function(err,result){
				//console.log(result);
				if (under.isFunction(handler)) {
					handler(err, result);
				}else{
					processFindResult(handler, err, result);
				}
				connection.release();
				var meta = '[' + new Date() + ']' + '\n';
        		global.sqlLog.write(meta + query.sql + '\n');
			});
			
		}
	});
}

exports.runSave = function(sql,params,handler){
	if (!handler) {
		return;
	}
	pool.getConnection(function(err, connection) {
		if (err) {
			if(under.isFunction(handler)){
	        	handler(err, null);
	        	return;
	    	}
			processFailureResult(hander,reason.DB_EXCEPTION_ERR_CODE,err);
		}else{
			var query =connection.query(sql,params,function(err,result){
				if (under.isFunction(handler)) {
					handler(err, result);
				}else{
					processSaveResult(handler, err, result);
				}
				connection.release();
				var meta = '[' + new Date() + ']' + '\n';
        		global.sqlLog.write(meta + query.sql + '\n');
			});
		}
	});
}

exports.getNewSqlParamEntity = function(sql, params, callback) {
    if (callback) {
        return callback(null, {
            sql: sql,
            params: params
        });
    }
    return {
        sql: sql,
        params: params
    };
}

/**
 *  执行事务
 * @param  {[type]}   sqlparamsEntities [description]
 * @param  {Function} callback          [description]
 * @return {[type]}                     [description]
 */
exports.execTrans = function(sqlparamsEntities, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            return callback(err, null);
        }
        connection.beginTransaction(function (err) {
            if (err) {
                return callback(err, null);
            }
            console.log("开始执行transaction，共执行" + sqlparamsEntities.length + "条数据");
            var funcAry = [];
            sqlparamsEntities.forEach(function (sql_param) {
                var temp = function (cb) {
                    var sql = sql_param.sql;
                    var param = sql_param.params;
                   	var query = connection.query(sql, param, function (tErr, rows, fields) {
                   		var meta = '[' + new Date() + ']' + '\n';
        				global.sqlLog.write(meta + query.sql + '\n');
                        if (tErr) {
                          return cb(tErr);
                        } else {
                          return cb(null, 'ok');
                        }
                    })
                };
                funcAry.push(temp);
            });

            async.series(funcAry, function (err, result) {
                console.log("transaction error: " + err);
                if (err) {
                	//此处必须要回滚 如何不回滚  脏数据插入 并且会对插入的行造成行锁  其他操作再对该行进行更改 造成无限等待
                    connection.rollback();
                    connection.release();
                    return callback(err, null);
                } else {
                	//此处必须要提交  如果不提交 会形成行锁 其他事务再对该行进行操作 造成无限等待
                    connection.commit(function (err, info) {
                        console.log("transaction info: " + JSON.stringify(info));
                        if (err) {
                            console.log("执行事务失败，" + err);
                            connection.rollback();
                            connection.release();
                            return callback(err, null);
                        } else {
                            connection.release();
                            return callback(null, info);
                        }
                    })
                }
            })
        });
    });
}


