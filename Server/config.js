exports.ROOT_DIR = __dirname;

exports.APP_SITE = {
	host: '127.0.0.1',
	port:8877
};

exports.APPS_SITE = {
	host: '127.0.0.1',
	port: 8878
};

exports.MYSQL = {
	connectionLimit:99,//连接池最多可以创建连接数
  	host:'127.0.0.1',
  	user:'root',
  	password:'',
  	database:'xiaowei',
  	port:3306,
    queueLimit:0 // 队伍中等待连接的最大数量，0为不限制。
};