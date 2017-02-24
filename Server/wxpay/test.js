/**
 * Created by Administrator on 2015-05-19.
 */
var WXService = require("./service");

//测试 创建预付款订单
function testCreateUnifiedOrder(){
    var payment = {
        out_trade_no:        '55d46061278b7bde48000002', //商户订单号,商户系统内部的订单号,32个字符内、可包含字母
        attach:              '支付测试' ,   //附加数据，在查询API和支付通知中原样返回，该字段主要用于商户携带订单的自定义数据
        total_fee: 		     1,   //单位：分，.只能为整数
        body: 		         '可口可乐等9种商品',    //商品或支付单简要描述
        device_info: 	     '5427dc63f1cedbe82b000082',    //终端设备号(门店号或收银设备ID)，注意：PC网页或公众号内支付请传"WEB"
        trade_type:          'APP',    //交易类型,取值如下：JSAPI，NATIVE，APP，WAP
        spbill_create_ip: 	 '192.168.31.66'    //用户支付时的网络终端IP
    };

    WXService.createUnifiedOrder(payment, function(err, result){
        console.log(err);
        console.log(result);
    });
}

//测试 查询订单
function testQueryOrder(){
    var data = {
        out_trade_no: 		 '55d46061278b7bde48000001'    //商户系统内部的订单号，当没提供transaction_id时需要传这个。
        //,transaction_id:      '55c41be0e1be662d270029d7' ,   //微信的订单号，优先使用
    };

    WXService.queryOrder(data, function(err, result){
        console.log(err);
        console.log(result);
    });
}

//测试 关闭订单
function testCloseOrder(){
    var data = {
        out_trade_no: 		 '55d46061278b7bde48000001'    //商户系统内部的订单号，当没提供transaction_id时需要传这个。
    };

    WXService.closeOrder(data, function(err, result){
        console.log(err);
        console.log(result);
    });
}

//测试 退款
function testRefund(){
    var data = {
        out_trade_no: 		 '55d46061278b7bde48000001'    //商户系统内部的订单号，当没提供transaction_id时需要传这个。
        //,transaction_id:      '55c41be0e1be662d270029d7'    //微信的订单号，优先使用
        ,out_refund_no:       '',    //商户系统内部的退款单号，商户系统内部唯一，同一退款单号多次请求只退一笔
        op_user_id: ''         , //操作员帐号, 默认为商户号
        total_fee: 1,       //订单总金额，单位为分，只能为整数
        refund_fee: 1       //退款总金额，订单总金额，单位为分，只能为整数
    };

    WXService.refund(data, function(err, result){
        console.log(err);
        console.log(result);
    });
}

//测试 退款查询
function testQueryRefund(){
    var data = {
        out_trade_no: 		 '55d46061278b7bde48000001'    //商户系统内部的订单号，当没提供transaction_id时需要传这个。
        //,out_refund_no:      '55c41be0e1be662d270029d7' ,  //商户退款单号
        //,out_trade_no:      '55c41be0e1be662d270029d7' ,   //微信的订单号，优先使用
        //,transaction_id:      '55c41be0e1be662d270029d7' ,   //商户系统内部的订单号z
    };

    WXService.queryRefund(data, function(err, result){
        console.log(err);
        console.log(result);
    });
}

//testQueryRefund();

//testCreateUnifiedOrder(); //测试支付

//testQueryOrder();

