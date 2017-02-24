var _ = require('lodash'),
    crypto = require('crypto'),
    uuidV1 = require('uuid/v1'),
    validator = require('./validator');


exports.parseJsonstr = function(jsonstr){
    var jsonobj = null;
    if(validator.isNullOrEmpty(jsonstr)){
        return jsonobj;
    }
    try{
        jsonobj = JSON.parse(jsonstr);
    }
    catch(err){
        console.log(err);
    }
    return jsonobj;
};

exports.genTimestamp = function(userid){
    return userid.substr(0, 8);
};

exports.genToken = function(password){
    return hmac(password);
};
/**
 * Generate a v1 UUID (time-based)
 * @return {[type]} [description]
 */
exports.genUUid = function(){

    return uuidV1();
}

/**
 * 生成分页对象
 * @param pageStr 格式 '0,20'
 * @returns {{start: number, count: number}}
 */
exports.genPage = function(pageStr){
    var page = {start: 0, count: 20}; //默认值
    if(typeof(pageStr) != 'string'){
        return page;
    }
    var ps = pageStr.split(',');
    if(ps.length === 2 && validator.isInteger(ps[0]) && validator.isInteger(ps[1])){
        page.start = parseInt(ps[0]);
        page.count = parseInt(ps[1]);
    }
    if(page.count > 50){ //避免一次读取过多数据
        page.count = 20;
    }
    return page;
};

/**
 * 生成坐标的数值数组
 * @param locStr 格式 '120.130674, 30.282653'
 * @returns [120.130674, 30.282653]
 */
exports.genLoc = function(locStr){
    var loc = null;
    if(typeof(locStr) != 'string'){
        return loc;
    }
    var tmpLoc = locStr.split(',');
    if(tmpLoc.length === 2 && validator.isDecimal(tmpLoc[0]) && validator.isDecimal(tmpLoc[1])){
        loc = [Number(tmpLoc[0]), Number(tmpLoc[1])];
    }
    return loc;
};

exports.capitalize = function (str) {
    return str && str[0].toUpperCase() + str.slice(1);
};

exports.hash = function (str) {
    return crypto.createHash('sha1').update(str).digest('hex');
};

exports.md5 = function (str) {
    return crypto.createHash('md5').update(str).digest('hex');
};

exports.hmac = hmac = function(password){
    var timestampStr = String(timestamp());
    return crypto.createHmac('sha1', password).update(timestampStr).digest('hex');
};

exports.toBase64 = function(str){
   return new Buffer(str).toString('base64');
};

exports.genCheckStr = function(userId){
    return crypto.createHash('sha1').update(userId + timestamp()).digest('hex');
};

exports.uniformHash = function(cacheName, base){
    var hashCode = 0;
    var len = cacheName.length;
    for (var i = 0; i < len; i++) {    //base  33
        hashCode = ((hashCode * base) + cacheName.charCodeAt(i)) & 0x7fffffff;
    }
    return hashCode;
};

//补零
exports.padZero = function (num, n) {
    var len = num.toString().length;
    while(len < n) {
        num = '0' + num;
        len++;
    }
    return num;
};
//把小于10的数前面补0
var pad = exports.pad = function (n) {
    return n < 10 ? '0' + n.toString(10) : n.toString(10);
};

//把13位时间戳格式化位字符串，如2013-09-05 10:10:10
exports.formattimeFromTimestamp = function (timestamp) {
    var d = new Date(timestamp);
    var time = [pad(d.getHours()),pad(d.getMinutes()), pad(d.getSeconds())].join(':');
    var date = [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join('-');
    return [date, time].join(' ');
};



//当前时间的格式化形式 如：2013-09-05 10:10:10
exports.formattime = function () {
    var d = new Date();
    var time = [pad(d.getHours()),pad(d.getMinutes()), pad(d.getSeconds())].join(':'); //如果需要毫秒再加 '.' + d.getMilliseconds()
    var date = [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join('-');
    return [date, time].join(' ');
};

//当前时间的日期格式化形式 如：2013-09-05
var formatdate = exports.formatdate = function () {
    var d = new Date();
    return [d.getFullYear(), pad(d.getMonth() + 1), d.getDate()].join('-');
};

//当前的时间戳 13位
var timestamp = exports.timestamp = function () {
    var date = new Date();
    return date.getTime();
};

//把格式化日期(2013-09-05 10:10:10)转为 13位时间戳
var str2time = exports.str2time = function(timeStr) {
    var newStr = timeStr.replace(/:/g,'-');
    newStr = newStr.replace(/ /g,'-');
    var arr = newStr.split("-");
    var datum = new Date(Date.UTC(arr[0],arr[1]-1,arr[2],arr[3]-8,arr[4],arr[5]));
    return datum.getTime();
};

exports.time2Str = function(unixtime) {
    var timestr = new Date(parseInt(unixtime) * 1000);
    var datetime = timestr.toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
    return datetime;
};

exports.genTimeRangeByYearMonth = function(year, month){
    var dateStart = str2time(year + '-' + month + '-01 ' + '00:00:01');
    var dateEnd = str2time(year + '-' + (month + 1) + '-01 ' + '00:00:00');
    return {start: dateStart, end: dateEnd};
};

exports.genTimeRangeStrByYearMonth = function(year, month){
    var dateStart = year + '-' + month + '-01 ' + '00:00:01';
    var dateEnd = year + '-' + (month + 1) + '-01 ' + '00:00:00';
    return {start: dateStart, end: dateEnd};
};

exports.genTimeRangeByToday = function(){
    var dateStr = formatdate();
    var dateStart = str2time(dateStr + ' 00:01:01');
    var dateEnd = str2time(dateStr + ' 23:59:59');
    return {start: dateStart, end: dateEnd};
};

exports.genTimeRangeStrByToday = function(){
    var dateStr = formatdate();
    var dateStart = dateStr + ' 00:01:01';
    var dateEnd = dateStr + ' 23:59:59';
    return {start: dateStart, end: dateEnd};
};

exports.genRandomId = function () {
	return Math.abs(Math.random() * Math.random() * Date.now() | 0).toString()
	    + Math.abs(Math.random() * Math.random() * Date.now() | 0).toString();
};

/**
 * 生成指定位数的随机数
 * @param len 位数
 * @return {String} 随机数
 */
var genRandomNum =exports.genRandomNum = function (len) {
    var num = '';
    for(var i = 0; i < len; i++) {
        num+= Math.floor(Math.random()*10);
    }
    return num;
};

/**
 * 生成订单号
 * @return {[type]} [description]
 */
exports.genOrderId = function(){
    var d = new Date();
    var time = [pad(d.getHours()),pad(d.getMinutes()), pad(d.getSeconds())].join(''); //如果需要毫秒再加 '.' + d.getMilliseconds()
    var date = [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join('');
    return [date, time].join('') + genRandomNum(6);
};

//生成指定范围的随机浮点数，保留两位小数
exports.genRandomFloat = function(under, over){
    switch(arguments.length){
        case 1: return float2bits(Math.random()*under);
        case 2: return float2bits(Math.random()*(over-under) + under);
        default: return 0;
    }
};

//保留两位小数
var float2bits = exports.float2bits = function(flt) {
    if(parseFloat(flt) == flt)
        return Math.round(flt * 100) / 100;
    // 到4位小数, return Math.round(flt * 10000) / 10000;
    else
        return 0;
};

exports.genNodeId = function () {
	return Math.abs(Math.random() * Math.random() * Date.now() | 0).toString();
};

exports.validateOwnProperty = function(schemaObj, paramObj){
    for(var prop in paramObj){
        if(!schemaObj.hasOwnProperty(prop)){
            return prop;
        }
    }
    return true;
};

exports.defineProperty = function(Obj, proName, proValue){
    Object.defineProperty(Obj, proName, {
        value: proValue,
        writable: false,
        enumerable: true,
        configurable: true
    });
};

/**
 * caculate two point between distance
 * @param {Object} lat1
 * @param {Object} lng1
 * @param {Object} lat2
 * @param {Object} lng2
 * @return {number} 米(M)
 */
exports.getTwoPointDistance = function(lng1, lat1, lng2, lat2){
    var EARTH_RADIUS = 6378137.0;    //单位M

    var radLat1 = lat1 * Math.PI/180.0;
    var radLat2 = lat2 * Math.PI/180.0;

    var radLng1 = lng1 * Math.PI/180.0;
    var radLng2 = lng2 * Math.PI/180.0;

    var a = radLat1 - radLat2;
    var b = radLng1 - radLng2;

    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
            Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b/2),2)));
    s = s * EARTH_RADIUS;
    s = Math.round(s * 10000)/10000.0;

    return s;
};