var reason = require('./reason');

exports.genHttpResp = function(code, data, err){
	var result = {
        code: code,  //[0 - 成功]，[ >= 1  - 失败, 也是错误代码, 1~10保留，11：email已存在、12：电话号码已存在]
        msg: reason.getReason(code)  // 失败时，存储失败原因，对用户友好的原因说明
	};

    if(data != null){
        result.data = data;  //响应数据
    }
    if(err){
        result.err = err.message? err.message : err; //实际的错误信息，这种信息只用于调试定位问题，显示给用户是不友好的
    }

    return result;
};