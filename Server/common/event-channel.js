var util = require('util'),
    EventEmitter = process.EventEmitter,
    validator = require('./validator'),
    constant = require('./constant')

/**
 * Exports the constructor.
 */
exports = module.exports = EventChannel;

/**
 * Constructor.
 *
 * @api public.
 */
function EventChannel(req, res) {
    EventEmitter.call(this);
    this.req = req;
    this.res = res;
}

//Inherits from EventChannel.
util.inherits(EventChannel, EventEmitter);

/**
 * 开始监听 success and failure 事件
 * 只适用于 service api
 * @param req http request
 * @param res http response
 * @return {EventChannel}
 */
EventChannel.prototype.listen = function(){
    this.onSuccessError(function(data){
        this.sendJson(data);
    });
    return this;
};

/**
 * listen success event
 *
 * @param callback
 */
EventChannel.prototype.onSuccess = function (callback){
    this.on(constant.EVENT_SUCCESS, callback);
};

/**
 * listen error event
 *
 * @param callback
 */
EventChannel.prototype.onError = function (callback){
    this.on(constant.EVENT_FAILURE, callback);
};

/**
 * listen success and error event
 *
 * @param callback
 */
EventChannel.prototype.onSuccessError = function (callback){
    this.onSuccess(callback);
    this.onError(callback);
}

/**
 * delete socket disconnect
 *
 * @api public
 */
EventChannel.prototype.deleteAllListeners = function () {
    this.removeAllListeners();
};

/**
 * send message to client
 *
 * @api public
 */
EventChannel.prototype.sendJson = function (data){
    this.res.json(data);
    this.deleteAllListeners();

    var result = JSON.stringify(data);
    if(this.getPath() != '/api/store/distance/find'){
        //logger.info([this.getIP(), this.getPath(), result].join(' '));
        var meta = '[' + new Date() + ']' + '['+this.getIP() + ']' + '[' + this.getPath() + ']' + '\n';
        global.operationLog.write(meta + result + '\n');
        
    }
};

/**
 * render page to browser
 *
 * @api public
 */
EventChannel.prototype.render = function (ejsfile, data){
    this.res.render(ejsfile, data);
    this.deleteAllListeners();

   // logger.info([this.getIP(), this.getPath(), data].join(' '));
};

/**
 * remote address
 */
EventChannel.prototype.getIP = function (){
    var ip = this.req.ip;
    var idx = -1;
    if(ip){
        idx = ip.lastIndexOf(':');
    }
    if(idx > 0){
        ip = ip.substring(idx + 1);
    }
    return ip;
};

/**
 * request URL pathname
 */
EventChannel.prototype.getPath = function (){
    return this.req.path;
};

EventChannel.prototype.getMethod = function (){
    return this.req.method;
};

EventChannel.prototype.getHeaders = function (){
    return this.req.headers
};

EventChannel.prototype.getId = function (){
    return this.req.headers._id;
};

EventChannel.prototype.getToken = function (){
    return this.req.headers.token;
};

EventChannel.prototype.getSn = function (){
    return this.req.headers.sn;
};

EventChannel.prototype.getImei = function (){
    return this.req.headers.imei;
};

EventChannel.prototype.getOs = function (){
    var ostype = this.req.headers.os;
    if(validator.isNullOrEmpty(ostype) || !validator.isInteger(ostype)){
        ostype = 1;
    }
    return ostype;
};