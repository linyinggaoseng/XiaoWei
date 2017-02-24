var crypto = require('crypto')
    ,xml2js = require('xml2js')
    ,validator = require('validator');

exports.buildXML = function(json){
    var builder = new xml2js.Builder();
    return builder.buildObject(json);
};

exports.parseXML = function(xml, callback){
    var parser = new xml2js.Parser({trim:true, explicitArray:false, explicitRoot:false});
    parser.parseString(xml, callback||function(err, result){});
};

exports.toXml = function (params) {
    var lines = [];
    lines.push("<xml>");
    for (var k in params) {
        if (!params[k]) {
            continue;
        }
        lines.push('<' + k + '>' + params[k] + '</' + k + '>');
        //if (validator.isNumeric(params[k]) || validator.isFloat(params[k])) {
        //    lines.push('<' + k + '>' + params[k] + '</' + k + '>');
        //} else {
        //    lines.push('<' + k + '><![CDATA[' + params[k] + ']]></' + k + '>');
        //}
    }
    lines.push('</xml>');
    return lines.join('');
};

exports.parseRaw = function(){
    return function(req, res, next){
        var buffer = [];
        req.on('data', function(trunk){
            buffer.push(trunk);
        });
        req.on('end', function(){
            req.rawbody = Buffer.concat(buffer).toString('utf8');
            next();
        });
        req.on('error', function(err){
            next(err);
        });
    }
};

/**
 * Handle stream data
 * @param stream
 * @param callback
 */
exports.pipe = function(stream, callback){
    var buffers = [];
    stream.on('data', function (trunk) {
        buffers.push(trunk);
    });
    stream.on('end', function () {
        callback(null, Buffer.concat(buffers));
    });
    stream.once('error', callback);
};

/**
 * Translate object to url parameters
 *
 * @param params
 * @returns {string}
 */
exports.encodeUri = function (params) {
    params = params || {};
    var keys = [];
    for (var k in params) {
        keys.push(encodeURIComponent(k) + '=' + encodeURIComponent(params[k]));
    }
    return keys.join('&');
};

/**
 * get string's bytes count
 * @param str
 * @returns {number}
 */
exports.getStrBytesCount = function (str){
    var n = str.length, c;
    var len = 0;
    for(var i = 0; i < n; i++){
        c = str.charCodeAt(i);
        if(c < 0x0080)
            len++;
        else if(c < 0x0800)
            len += 2;
        else
            len += 3;
    }
    return len;
};

/**
 * Marshalling object keys to be sorted alphabetically and then translated to url parameters
 *
 * @param params
 * @returns {string}
 */
var marshall = exports.marshall = function (params) {
    params = params || {};
    var keys = Object.keys(params).sort();
    var kvs = [];
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        var v = params[k];
        if (v) {
            kvs.push(k + '=' + v);
        }
    }
    return kvs.join('&');
};

exports.genNonceStr = function(length){
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var maxPos = chars.length;
    var noceStr = "";
    for (var i = 0; i < (length || 32); i++) {
        noceStr += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return noceStr;
};

exports.sign = function(params, key){
    var mstr = marshall(params) + '&key=' + key;
    //console.log(mstr);
    return md5(mstr).toUpperCase();
};

var md5 = exports.md5 = function(str){
    var buf = new Buffer(10240);
    var len = buf.write(str, 0);
    var result = buf.toString('binary', 0, len);
    var md5_value = crypto.createHash('md5').update(result).digest('hex');
    return md5_value;
};