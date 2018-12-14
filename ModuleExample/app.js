var express=require('express');
var http=require('http');
var static=require('serve-static');
var path=require('path');

var bodyParser=require('body-parser');
var cookieParser=require('cookie-parser');
var expressSession=require('express-session');

var expressErrorHandler=require('express-error-handler');

var user=require('./routes/user');

var crypto=require('crypto');

var mongoose=require('mongoose');

var database;
var UserSchema;
var UserModel;

var app=express();

app.set('port', process.env.PORT || 3000);

app.use('/public', static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(expressSession({
	secret:'my key',
	resave:true,
	saveUninitialized:true
}));

function connectDB(){
	var databaseUrl='mongodb://localhost:27017/local';
	
	mongoose.Promise=global.Promise;
	mongoose.connect(databaseUrl);
	database=mongoose.connection;
	
	database.on('open', function(){
		console.log('데이터베이스에 연결됨: '+databaseUrl);
		
		createUserSchema(database);
	});
	
	database.on('disconnected', function(){
		console.log('데이터베이스 연결 끊어짐');
	});
	
	database.on('error', console.error.bind(console, 'mongoose 연결 에러'));
	
	app.set('database', database);
}

function createUserSchema(database){
	database.UserSchema=require('./database/user_schema').createSchema(mongoose);
	database.UserModel=mongoose.model('users3', database.UserSchema);
	console.log('UserModel 정의함');
}

var router = express.Router();

router.route('/process/login').post(user.login);

router.route('/process/adduser').post(user.adduser);

router.route('/process/listuser').post(user.listuser)

app.use('/', router);

var errorHandler=expressErrorHandler({
	static: {
		'404': './public/404.html'
	}
});

var server=http.createServer(app).listen(app.get('port'), function(){
	console.log('익스프레스로 웹 서버를 실행함: '+app.get('port'));
	
	connectDB();
});

