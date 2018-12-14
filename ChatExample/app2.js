var express=require('express');
var http=require('http');
var static=require('serve-static');
var path=require('path');

var bodyParser=require('body-parser');
var cookieParser=require('cookie-parser');
var expressSession=require('express-session');

var expressErrorHandler=require('express-error-handler');

var user=require('./routes/user');

var config=require('./config/config');

var database_loader=require('./database/database_loader');

var route_loader=require('./routes/route_loader');

var crypto=require('crypto');

var socketio=require('socket.io');
var cors=require('cors');

var passport=require('passport');
var flash=require('connect-flash');

var app=express();

app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');
//app.set('view engine', 'pug');

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

app.use(cors());

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var configPassport=require('./config/passport');
configPassport(app, passport);

var router=express.Router();
route_loader.init(app, router);

var userPassport=require('./routes/user_passport');
userPassport(router, passport);

var errorHandler=expressErrorHandler({
	static: {
		'404': './public/404.html'
	}
});

var server=http.createServer(app).listen(app.get('port'), function(){
	console.log('익스프레스로 웹 서버를 실행함: '+app.get('port'));
	
	database_loader.init(app, config);
});

//socket.io 서버 시작
var io=socketio.listen(server);//웹 서버 위에서 웹 소켓으로 들어오는 요청 처리할 준비
console.log('socket.io 요청을 받아들일 준비가 되었습니다');

io.sockets.on('connection', function(socket){
	console.log('connection info -> '+JSON.stringify(socket.request.connection._peername));
	
	socket.remoteAddress=socket.request.connection._peername.address;
	socket.remotePort=socket.request.connection._peername.port;
	
	socket.on('message', function(message){
		console.log('message 받음 -> '+JSON.stringify(message));
		
		if(message.recepient=='ALL'){
			console.log('모든 클라이언트에게 메시지 전송함');
			
			io.sockets.emit('message', message);//나를 '포함한' 모든 클라이언트에 전송
			//socket.broadcast.emit(event, object); //나를 '제외한' 모든 클라이언트에 전송
		}
	});
});