module.exports = {
    partner: '2088811588743359'
    ,app_id:'2016091901922853'
    ,key: ''
    ,seller_id: ''
    ,seller_name: ''
    ,host: 'http://localhost:3000/'
    ,transport: 'https'
    ,input_charset: 'utf-8'
    ,pubkey_cert: './certs/rsa_public_key.pem'
    ,prvkey_cert: './certs/rsa_private_key.pem'
    ,alipy_pubkey_cert: './certs/alipay_rsa_public_key.pem'
    ,alipy_gateway: 'https://mapi.alipay.com/gateway.do'
    ,notify_url: 'http://60.205.124.182:8877/api/v1/pays/alipay/notify'
    ,trans_notify_url: 'http://www.ppstar.cn:8888/api/v1/capital/trans/alipay/notify'
};