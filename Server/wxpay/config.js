
module.exports = {
    //微信分配的公众账号ID（企业号corpid即为此appId）
    appid: '',
    //微信支付分配的商户号
    mch_id: '',
    //key
    key: '',
    //回调地址
    notify_url: 'https://120.27.131.5:8889/api/v1/capital/recharge/wxpay/notify',

    //统一下单地址：商户系统先调用该接口在微信支付服务后台生成预支付交易单，返回正确的预支付交易回话标识后再按扫码、JSAPI、APP等不同场景生成交易串调起支付。
    unifiedOrderPath: '/pay/unifiedorder',

    //订单查询地址：该接口提供所有微信支付订单的查询，商户可以通过该接口主动查询订单状态，完成下一步的业务逻辑。
    queryOrderPath: '/pay/orderquery',

    //关闭订单地址：商户订单支付失败需要生成新单号重新发起支付，要对原订单号调用关单，避免重复支付；系统下单后，用户支付超时，系统退出不再受理，避免用户继续，请调用关单接口。
    closeOrderPath: '/pay/closeorder',

    //退款地址：当交易发生之后一段时间内，由于买家或者卖家的原因需要退款时，卖家可以通过退款接口将支付款退还给买家，微信支付将在收到退款请求并且验证成功之后，按照退款规则将支付款按原路退到买家帐号上。
    refundPath: '/secapi/pay/refund',

    //查询退款地址
    queryRefundPath: '/pay/refundquery',

    //企业付款地址：为了协助商户方便地实现企业向个人付款
    mktTansferParh : '/mmpaymkttransfers/promotion/transfers'
};