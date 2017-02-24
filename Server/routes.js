var EventChan = require('./common/event-channel'),
	reason = require('./common/reason'),
	pgutil = require('./pg/pg-util');

var	user = require('./routes/user');
var goods = require('./routes/goods');
var pay = require('./routes/pay');
var cart = require('./routes/carts');
var order = require('./routes/orders');
var notify = require('./routes/notify');
var prePath = '/api/v1';

exports.loadRoutes = function(app){
    app.use(prePath + '/user', user);
    app.use(prePath + '/goods', goods);
    app.use(prePath + '/pays',pay);
    app.use(prePath + '/carts',cart);
    app.use(prePath + '/orders',order);
    app.use(prePath + '/notify',notify);
};
