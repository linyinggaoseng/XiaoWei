var https = require('https')
    ,path = require('path')
    ,fs = require('fs')
    ,util = require('./util')
    ,config = require('./config');

//微信支付 SSL证书
var PayCert = {
    key: fs.readFileSync(path.join(__dirname,'./certs/apiclient_key.pem')),
    cert: fs.readFileSync(path.join(__dirname,'./certs/apiclient_cert.pem')),
    ca: fs.readFileSync(path.join(__dirname,'./certs/rootca.pem'))
};


//分析结果
exports.parseReturnResult = function(chunk, callback){
    util.parseXML(chunk, function(err, body){
        if(err){ //xml解析错误
            callback(err, chunk);
        }
        else{
            callback(null, body);
        }
    });
};

//处理微信回调通知
exports.handleCallback = function(req, res, callback){
    util.pipe(req, function(err, data){
        //回写 SUCCESS 给 wxpay
        res.end(util.buildXML({xml:{return_code:'SUCCESS'}}));
        //分析返回数据
        var xml = data.toString('utf8');
        util.parseXML(xml, function(err, data){
            callback(err, data);
        });
    });
};

/**
 * 添加公共请求信息
 * @param data
 */
function addCommon(data){
    data.appid = config.appid; //微信分配的公众账号ID
    data.mch_id = config.mch_id; //微信支付分配的商户号
    data.nonce_str = util.genNonceStr(16); //随机字符串，不长于32位
    data.sign = util.sign(data, config.key); //签名
}

/**
 * 添加企业付款公共请求信息
 * @param data
 */
function addTransCommon(data){
    data.mch_appid = config.appid; //微信分配的公众账号ID
    data.mchid = config.mch_id; //微信支付分配的商户号
    data.nonce_str = util.genNonceStr(16); //随机字符串，不长于32位
    data.sign = util.sign(data, config.key); //签名
}

/**
 * 生成app端使用的签名等信息
 * @param prepayid  微信生成的预支付回话标识
 */
exports.genAppPayInfo = function(prepayid){
    var info = {
        appid: config.appid,
        partnerid: config.mch_id,
        prepayid: prepayid,
        package: 'Sign=WXPay',
        noncestr: util.genNonceStr(16),
        timestamp: Math.ceil(new Date().getTime()/1000)
    };
    info.sign = util.sign(info, config.key); //签名
    delete info.package; //package是java关键字，并且固定字符串，可以不返回
    return info;
};

/**
 * 除被扫支付场景以外，商户系统先调用该接口在微信支付服务后台生成预支付交易单，
 * 返回正确的预支付交易回话标识后再按扫码、JSAPI、APP等不同场景生成交易串调起支付。
 */
exports.createUnifiedOrder = function(data, callback){
    exec(data, config.unifiedOrderPath, callback);
};

/**
 * 该接口提供所有微信支付订单的查询，商户可以通过该接口主动查询订单状态，完成下一步的业务逻辑。
 */
exports.queryOrder = function(data, callback){
    exec(data, config.queryOrderPath, callback);
};

/**
 * 商户订单支付失败需要生成新单号重新发起支付，要对原订单号调用关单，避免重复支付；
 * 系统下单后，用户支付超时，系统退出不再受理，避免用户继续，请调用关单接口。
 */
exports.closeOrder = function(data, callback){
    exec(data, config.closeOrderPath, callback);
};

/**
 * 当交易发生之后一段时间内，由于买家或者卖家的原因需要退款时，卖家可以通过退款接口将支付款退还给买家，
 * 微信支付将在收到退款请求并且验证成功之后，按照退款规则将支付款按原路退到买家帐号上。
 */
exports.refund = function(data, callback){
    exec(data, config.refundPath, callback);
};

/**
 * 提交退款申请后，通过调用该接口查询退款状态。退款有一定延时，用零钱支付的退款20分钟内到账，银行卡支付的退款3个工作日后重新查询退款状态。
 */
exports.queryRefund = function(data, callback){
    exec(data, config.queryRefundPath, callback);
};

/**
 * 企业向个人付款
 */
exports.mktTansfer = function(data, callback){
    exec(data, config.mktTansferParh, callback);
};

/**
 * 执行支付相关请求
 * @param data 请求数据
 * @param path 路径
 * @param callback 回调函数
 */
function exec(data, path, callback){
    var isCerts = false;
    if(path == config.unifiedOrderPath){
        data.notify_url = config.notify_url; //设置回调地址
    }
    if(path === config.mktTansferParh){ //企业付款，公共信息命名有不同，并且需要携带证书
        addTransCommon(data);
        isCerts = true;
    }
    else{
        addCommon(data); //添加公共信息
    }

    //发送post请求
    post(util.buildXML(data), path, isCerts, function(err, chunk){
        if(err){ //网络错误
            callback(err);
            return;
        }
        util.parseXML(chunk, function(err, body){
            if(err){ //xml解析错误
                callback(err, chunk);
            }
            else{
                callback(null, body);
            }
        });
    });
}

//发送post请求
function post(data, path, isCerts, callback){
    var postData = data; //querystring.stringify(data);
    console.log(data);
    var options = {
        hostname: 'api.mch.weixin.qq.com',
        path: path,
        method: 'POST'
        ,headers: {
            'Content-Type': 'text/xml',
            'Content-Length': util.getStrBytesCount(postData)
        }
    };
    if(isCerts){ //需要携带证书访问
        options.key = PayCert.key;
        options.cert = PayCert.cert;
        options.ca = PayCert.ca;
        options.agent = false;
    }
    //创建请求
    var req = https.request(options, function(res) {
        var chunks='';
        res.setEncoding('utf8');
        //接收处理响应
        res.on('data', function (chunk) {
            chunks += chunk;
        });
        res.on('end', function() {
            //console.log(chunk);
            if(callback && typeof(callback) == 'function'){
                callback(null, chunks);
            }
        });
    });

    //处理错误
    req.on('error', function(e) {
        console.log(e);
        if(callback != null && typeof(callback) == 'function'){
            callback(e);
        }
    });

    //发送数据
    req.write(postData);
    req.end();
}