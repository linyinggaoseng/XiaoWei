var http = require('http')
    ,https = require('https')
    ,fs = require('fs')
    ,express = require('express')
    ,path = require('path')
    ,logger = require('morgan')
    ,bodyParser = require('body-parser');

var config = require('./config')
    ,route = require('./routes');

var fs = require('fs');
var accessLog = fs.createWriteStream('access.log', {flags: 'a'});
var exceptionLog = fs.createWriteStream('execption.log', {flags: 'a'});
global.sqlLog =  fs.createWriteStream('sql.log', {flags: 'a'});
global.operationLog =  fs.createWriteStream('operation.log', {flags: 'a'});
var app = express();
var server = http.createServer(app);
//ssl key cert
var options = {
    key: fs.readFileSync('./ssl/key.pem'),
    cert: fs.readFileSync('./ssl/cert.pem')
};
var sslserver = https.createServer(options, app);

app.set('port', process.env.PORT || config.APP_SITE.port);

app.use(logger('dev'));
app.use(logger({stream: accessLog}));
app.use(function (req, res, next){
  if (req.url === '/api/v1/pays/alipay/notify') {
    req.headers['content-type'] = 'application/x-www-form-urlencoded';
  }
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('express-domain-middleware'));

process.setMaxListeners(0);
process.title = 'xiaowei';
process.on('uncaughtException', function (err) {
    console.log(err);

    try {
        var killTimer = setTimeout(function () {
            process.exit(1);
        }, 30000);
        killTimer.unref();

        server.close();
        sslserver.close();
    } catch (e) {
        console.log('error when exit', e.stack);
    }
});

route.loadRoutes(app);


app.use(function (err, req, res, next) {
  var meta = '[' + new Date() + '] ' + req.url + '\n';
  exceptionLog.write(meta + err.stack + '\n');
 // console.log(meta);
  if(err.domain) {
    //you should think about gracefully stopping & respawning your server
    //since an unhandled error might put your application into an unknown state
    var response = {'code':500,'msg':'执行异常'};
    var resJson = JSON.stringify(response);
    res.send(resJson);
     try {
        // 强制退出机制
        var killTimer = setTimeout(function () {
            process.exit(1);
        }, 30000);
        killTimer.unref(); // 非常重要

        // 自动退出机制，停止接收新链接，等待当前已建立连接的关闭
        server.close(function () {
       // 此时所有连接均已关闭，此时 Node 会自动退出，不需要再调用 process.exit(1) 来结束进程
        });
        sslserver.close(function () {
       // 此时所有连接均已关闭，此时 Node 会自动退出，不需要再调用 process.exit(1) 来结束进程
        });
    } catch(e) {
        console.log('err', e.stack);
    }
  }else{
    var response = {'code':500,'msg':'执行异常'};
    var resJson = JSON.stringify(response);
    res.send(resJson);
  }
  next();
});


server.listen(config.APP_SITE.port);
console.log('express http app started on port ' + config.APP_SITE.port);

sslserver.listen(config.APPS_SITE.port);
console.log('express https app started on port ' + config.APPS_SITE.port);