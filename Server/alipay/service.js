var https = require('https')
    ,querystring = require('querystring')
    ,path = require('path')
    ,fs = require('fs')
    ,util = require('./util')
    ,utils = require('../common/utils')
    ,config = require('./config');


//支付宝支付 安全校验码(Key)
var PPStar_MD5_Key = config.key;

//支付宝支付 SSL证书
var PayCert = {
   // Alipay_RSA_Pub_Key: fs.readFileSync(path.join(__dirname, config.alipy_pubkey_cert))
    PPStar_RSA_Prv_Key: fs.readFileSync(path.join(__dirname, config.prvkey_cert))
    ,PPStar_RSA_Pub_Key: fs.readFileSync(path.join(__dirname, config.pubkey_cert))
};

//构造支付请求
exports.buildPayReq = function(data){
    var payInfo = {
        partner: config.partner,
        seller_id: config.seller_id,
        notify_url: config.notify_url,
        service: 'mobile.securitypay.pay',
        return_url: 'cn.ppstar.ppx',
        payment_type: '1',
        _input_charset: 'utf-8',
        it_b_pay: '10m',
        out_trade_no: data.out_trade_no,
        subject: data.subject,
        total_fee: data.total_fee,
        body: data.body
    };
    var linkStr = util.linkParams(payInfo);
    var sign = util.signMd5ForStr(linkStr, PPStar_MD5_Key);
    linkStr += '&sign_type=MD5&sign=' + sign;
    return linkStr;
};

exports.buildAliayPayReq = function(data){
    var totalAmount = Number(data.total_fee).toFixed(2);
    var biz_content = {
        subject:data.subject?data.subject:'',
        out_trade_no:data.out_trade_no?data.out_trade_no:'',
        total_amount:totalAmount,
        seller_id:config.seller_id,
        product_code:'QUICK_MSECURITY_PAY'
     };
     var tempDic = {
        app_id:config.app_id,
        biz_content:JSON.stringify(biz_content),
        charset:'utf-8',
        method:'alipay.trade.app.pay',
        notify_url: config.notify_url,
        sign_type:'RSA',
        timestamp:utils.formattime(),
        version:'1.0'
     };
     var orderInfo  = util.linkParamsWithUrlEncode(tempDic,false);
     var orderInfoEncoded = util.linkParamsWithUrlEncode(tempDic,true);
     console.log('private:'+'\n'+ PayCert.PPStar_RSA_Prv_Key);
     var sign = util.signRsa(orderInfo,PayCert.PPStar_RSA_Prv_Key);
     orderInfoEncoded += '&sign=' + sign;
     return orderInfoEncoded;
    // var sign = util.signRsa('treweywgdwjh362873',PayCert.PPStar_RSA_Prv_Key);
    // console.log(sign);
    //  return sign;
}

//处理支付回调通知
exports.handleCallback = function(req, res, callback){
    util.pipe(req, function(err, data){
        var result = data;
        //回写 success 给 alipay
        res.end('success');
        if(data) {
            //将post数据解析为对象
            result = querystring.parse(data);
            //var isCheck = util.verifyMd5(result, PPStar_MD5_Key);
            // if (!isCheck) {
            //     err = '签名校验失败'
            // }
        }
        else{
            err = '通知数据为空'
        }

        //checkAlipayNotify(result.notify_id, function(err, rs){
        //    if(!err && 'true' === rs){
        //        res.end('success');
        //        //分析返回数据
        //        callback(err, result);
        //    }
        //});

        //返回数据
        callback(err, result);
    });
};

//批量转账付款到用户支付宝账号有密接口
/* 	data{
 pay_date:'',//付款当天日期, 必填，格式：年[4位]-月[2位]-日[2位] 小时[2位 24小时制]:分[2位]:秒[2位]，如：2007-10-01 13:13:13
 batch_no: '', //批次号, 必填，格式：当天日期[8位]+序列号[3至24位]，如：201008010000001
 batch_num:'', //付款笔数, 必填，参数detail_data的值中，“#”字符出现的数量加1，最大支持1000笔（即“#”字符出现的数量999个）
 batch_fee:'', //付款总金额, 必填
 detail_data: '',//付款详细数据 必填，具体格式请参见接口技术文档
 } */
exports.batchTransfer = function(data, callback){
    //构造要请求的参数数组，无需改动
    var transInfo = {
        service: 'batch_trans_notify',
        partner: config.partner,
        email: config.seller_id,
        account_name: config.seller_name,
        notify_url: config.trans_notify_url,
        _input_charset	: config.input_charset,

        pay_date	: data.pay_date,
        batch_no	: data.batch_no,
        batch_num	: data.batch_num,
        batch_fee   : data.batch_fee,
        detail_data	: data.detail_data
    };

    var linkStr = util.linkParams(transInfo);
    var sign = util.signMd5ForStr(linkStr, PPStar_MD5_Key);
    linkStr += '&sign_type=MD5&sign=' + sign;
    var url = config.alipy_gateway + "?" + linkStr;
    get(url, callback);
};

//校验是否为支付宝发过来的通知
function checkAlipayNotify(notify_id, callback){
    var url = config.alipy_gateway + "?service=notify_verify&partner=" + config.partner + "&notify_id=" + notify_id;
    get(url, function(err, result){
        if(err){
            callback(err);
        }
        else{
            callback(null, result);
        }
    });
}

//执行get请求
function get(url, callback){
    var req = https.get(url, function(res) {
        var chunks='';
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            chunks += chunk;
        });
        res.on('end', function() {
            if(callback != null){
                callback(null, chunks);
            }
        });
    });
    req.on('error', function(e) {
        callback(e);
    });
    req.end();
}
