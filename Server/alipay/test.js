var service = require('./service')
    ,util = require('./util');


//var notifyStr = 'discount=0.00&payment_type=1&subject=%E6%B5%8B%E8%AF%95%E7%9A%84%E5%95%86%E5%93%81&trade_no=2015121500001000440073013616&buyer_email=573966%40qq.com&gmt_create=2015-12-15 16%3A12%3A38&notify_type=trade_status_sync&quantity=1&out_trade_no=1215161226-1875&seller_id=2088811588743359&notify_time=2015-12-15 16%3A12%3A39&body=%E8%AF%A5%E6%B5%8B%E8%AF%95%E5%95%86%E5%93%81%E7%9A%84%E8%AF%A6%E7%BB%86%E6%8F%8F%E8%BF%B0&trade_status=TRADE_SUCCESS&is_total_fee_adjust=N&total_fee=0.01&gmt_payment=2015-12-15+16%3A12%3A39&seller_email=2500322870%40qq.com&price=0.01&buyer_id=2088102529332443&notify_id=65c3de3fdbed0f8b35925552edb283684g&use_coupon=N&sign_type=RSA&sign=WWz8in40CXBepht2ksLFBItvBRzgE0yDkLzGXheIoT1a5Eb7ay1jmcEBRxhI1g0gOYELAY%2F0kTJFjXAzy8kEZgOOehwyqznX277HOuLug4bCWP4zTEnqlwII5a6TZJAmx6kPNSSX7fnB%2Bjk2OTJULb38xW8hhNHrwJm56CzJX1c%3D';
//var result = util.parseNotify(notifyStr);
//console.log(result);
//console.log(util.linkParams(result));
//var sign = util.signRsa(result, PayCert.PPStar_RSA_Prv_Key);
//result.sign = sign;
//console.log(util.signRsa(result, PayCert.PPStar_RSA_Prv_Key));
//console.log(util.verifyRsa(result, PayCert.PPStar_RSA_Pub_Key));

//var result = {"discount":"0.00","payment_type":"1","subject":"1","trade_no":"2015121600001000440073045612","buyer_email":"573966@qq.com","gmt_create":"2015-12-16 13:31:48","notify_type":"trade_status_sync","quantity":"1","out_trade_no":"SXINAOWUYOCJUJT","seller_id":"2088811588743359","notify_time":"2015-12-16 13:31:49","body":"我是测试数据","trade_status":"TRADE_SUCCESS","is_total_fee_adjust":"N","total_fee":"0.02","gmt_payment":"2015-12-16 13:31:49","seller_email":"2500322870@qq.com","price":"0.02","buyer_id":"2088102529332443","notify_id":"47f793cf8dd2ee738103e25b71c640784g","use_coupon":"N","sign_type":"RSA","sign":"In9RBnL3YuMgsXTOOfoBI8Rmm98zNspKpUD1zPJ+Qupdo9ecLCm6W6vDvxoMf/Zh6THg8WK9+BqSqSIhgTnyAXIz8SeIXCGTEQB5gFcSS7d41J2eF7ais4eqFrHYdwWZDE/Qlj0IItPP63GmVlS1mxN7Sq/AM4RHmKi8gbFaZqs="};
//console.log(result);
//console.log(util.verifyRsa(result, PayCert.Alipay_RSA_Pub_Key));
////console.log(PayCert.Alipay_RSA_Pub_Key.toString());

//var result = {"discount":"0.00","payment_type":"1","subject":"测试的商品","trade_no":"2015121600001000440073047037","buyer_email":"573966@qq.com","gmt_create":"2015-12-16 14:22:12","notify_type":"trade_status_sync","quantity":"1","out_trade_no":"121614215753232","seller_id":"2088811588743359","notify_time":"2015-12-16 14:22:13","body":"该测试商品的详细描述","trade_status":"TRADE_SUCCESS","is_total_fee_adjust":"N","total_fee":"0.01","gmt_payment":"2015-12-16 14:22:13","seller_email":"2500322870@qq.com","price":"0.01","buyer_id":"2088102529332443","notify_id":"9ae028fe173b47465d2781176e3b5f274g","use_coupon":"N","sign_type":"MD5","sign":"c27bc3842a39f13c5013584b8b970b40"}
//console.log(result);
//console.log(util.verifyMd5(result, config.key));

//service.checkAlipayNotify(result.notify_id, function(err, rs){
//    console.log(err);
//    console.log(rs);
//});
