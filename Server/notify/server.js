var http = require('https');
var querystring = require('querystring');
var config = require('./config');
var util = require('./util');
var cutil = require('../common/utils');


exports.push_single_device = function(channelId,msg,cb){

	var reqParam = {
		method:'post',
		href:config.url+'/rest/3.0/push/single_device'
	};
	var postParam = {
		apikey:config.api_key,
		timestamp:parseInt(cutil.timestamp()/1000),
		channel_id:channelId,
		device_type:4,
		deploy_status:1,
		msg:msg
	};
	var sign = util.singKey(reqParam,postParam,config.secret_key);
	postParam.sign = sign;
	var data = querystring.stringify(postParam);
	var options = {
		host: 'api.tuisong.baidu.com',
		port: 443,
		path: '/rest/3.0/push/single_device',
		method: 'POST',
		headers: {
		    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
		    'Content-Length': Buffer.byteLength(data)
   		}
	};
	var req = http.request(options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
		    console.log("body: " + chunk);
		    if (cb) {
		    	cb(null,'');
		    }
		});
	});
	req.write(data);
	req.end();
}