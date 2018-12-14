var express=require('express');
var http=require('http');
var static=require('serve-static');
var path=require('path');

var bodyParser=require('body-parser');
var cookieParser=require('cookie-parser');
var expressSession=require('express-session');

var expressErrorHandler=require('express-error-handler');

var user=require('./routes/user');

var config=require('./config');

var database_loader=require('./database/database_loader');

var route_loader=require('./routes/route_loader');

var crypto=require('crypto');

var app=express();

console.log('config.server_port -> '+config.server_port);
app.set('port', config.server_port || 3000);

app.use('/public', static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(expressSession({
	secret:'my key',
	resave:true,
	saveUninitialized:true
}));

route_loader.init(app, express.Router());

var errorHandler=expressErrorHandler({
	static: {
		'404': './public/404.html'
	}
});

var server=http.createServer(app).listen(app.get('port'), function(){
	console.log('익스프레스로 웹 서버를 실행함: '+app.get('port'));
	
	database_loader.init(app, config);
});

//app2.js와 databse_loader.js, route_loader.js는 건들일 필요 없이
//config.js와 user.js, user_schema.js만 변경하도록 하여 가독성을 높임