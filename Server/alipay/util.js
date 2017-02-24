var crypto = require('crypto')
    ,config = require('./config');

//把参数对象拼接成支付宝要求的字符串格式
var linkParams = exports.linkParams = function(obj) {
    var params = [];
    // remove sign && sign_type
    for(var name in obj) {
        if(name != 'sign' && name != 'sign_type') {
            params.push(name + '=' + obj[name]);
        }
    }
    params.sort();
    return params.join('&');
};

var linkParamsWithUrlEncode = exports.linkParamsWithUrlEncode = function(obj,encode){
    var params = [];
    // remove sign && sign_type
    for(var name in obj) {
        if(name != 'sign') {
            if (encode) {
                params.push(name + '=' + encodeURIComponent(obj[name]));
            }else{
                params.push(name + '=' + obj[name]);
            }   
        }
    }
    params.sort();
    return params.join('&');
}

//校验rsq签名
exports.verifyRsa = function(params, publicKey) {
    var prestr = linkParams(params);
    console.log(prestr);
    if(params.sign_type == 'RSA') {
        return crypto.createVerify('RSA-SHA1').update(prestr).verify(publicKey, params.sign, 'base64');
    } else {
        return true
    }
};

//用rsa签名
exports.signRsa = function(params, privateKey) {
    //var prestr = linkParams(params);
     
    var res =  crypto.createSign('RSA-SHA1').update(params).sign(privateKey, 'base64');
    return encodeURIComponent(res);
};

//校验md5签名
exports.verifyMd5 = function(params, key) {
    var prestr = linkParams(params);
    return md5(prestr + key) == params.sign;
};

//用md5签名
exports.signMd5 = function(params, key) {
    var prestr = linkParams(params);
    return md5(prestr + key);
};

//用md5签名
exports.signMd5 = function(params, key) {
    var prestr = linkParams(params);
    return md5(prestr + key);
};

//用md5签名
exports.signMd5ForStr = function(paramsLinkStr, key) {
    return md5(paramsLinkStr + key);
};

function md5(str){
    var buf = new Buffer(10240);
    var len = buf.write(str, 0);
    var result = buf.toString('binary', 0, len);
    var md5_value = crypto.createHash('md5').update(result).digest('hex');
    return md5_value;
}

/**
 * Handle stream data
 * @param stream
 * @param callback
 */
exports.pipe = function(stream, callback){
    var buffers = [];
    stream.on('data', function (trunk) {
        console.log('数据111');
        buffers.push(trunk);
    });
    stream.on('end', function () {
        callback(null, Buffer.concat(buffers).toString('utf8'));
    });
    stream.once('error', callback);
};

/**
 * 解析通知字符串为对象
 * @param notifyStr
 * @returns {{}}
 */
exports.parseNotify = function(notifyStr){
    var tmpArr = notifyStr.split('&');
    var result = {};
    for(var i = 0, len = tmpArr.length; i < len; i++){
        var kv = tmpArr[i].split('=');
        result[kv[0]] = decodeURIComponent(kv[1]);
    }
    return result;
};