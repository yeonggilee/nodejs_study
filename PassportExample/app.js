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

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var LocalStrategy=require('passport-local').Strategy;
//로그인
passport.use('local-login', new LocalStrategy({
	usernameField:'email',
	passwordField:'password',
	passReqToCallback:true
}, function(req, email, password, done){
	console.log('passport의 local-login 호출됨: '+email+', '+password);
	
	var database = app.get('database');
	database.UserModel.findOne({'email':email}, function(err, user){
		if(err){
			console.log('에러 발생함');
			return done(err);//인증결과
		}
		
		if(!user){
			console.log('사용자 정보가 일치하지 않습니다');
			return done(null, false, req.flash('loginMessage', '등록된 계정이 없습니다'));
		}
		
		var authenticated=user.authenticate(password, user._.doc.salt, user._doc.hashed_password);// true/false
		
		if(!authenticated){
			console.log('비밀번호가 일치하지 않습니다');
			return done(null, false, req.flash('loginMessage', '비밀번호가 일치하지 않습니다'));
		}
		
		console.log('아이디와 비밀번호가 일치합니다');
		return done(null, user);
	});
}));
//회원가입
passport.use('local-signup', new LocalStrategy({
	usernameField:'email',
	passwordField:'password',
	passReqToCallback:true
}, function(req, email, password, done){
	var paramName=req.body.name || req.query.name;
	console.log('passport의 local-signup 호출됨: '+email+', '+password+', '+paramName);
	
	var database=app.get('database');
	database.UserModel.findOne({'email':email}, function(err, user){
		if(err){
			console.log('에러 발생함');
			return done(err);
		}
		
		if(user){
			console.log('기존에 계정이 있습니다');
			return done(null, false, req.flash('signupMessage', '계정이 이미 있습니다'));
		}else{
			var user=new database.UserModel({'email':email, 'password':password, 'name':paramName});
			user.save(function(err){
				if(err){
					console.log('데이터베이스에 저장 시 에러');
					return done(null, false, req.flash('signupMessage', '사용자 정보 저장 시 에러가 발생했습니다'));
				}
				
				console.log('사용자 데이터 저장함');
				return done(null, user);
			});
		}
	});
}));
//자동 호출
//인증 처음 성공 시 할 일
passport.serializeUser(function(user, done){
	console.log('serializeUser 호출됨');
	console.dir(user);
	
	done(null, user);
});
//인증 후 할 일
passport.deserializeUser(function(user, done){
	console.log('deserializeUser 호출됨');
	console.dir(user);
	
	done(null, user);
});

var router=express.Router();
route_loader.init(app, router);
//회원가입과 로그인 라우팅 함수
router.route('/').get(function(req, res){
	console.log('/ 패스로 요청됨');
	
	res.render('index.ejs');
});
router.route('/login').get(function(req, res){
	console.log('/login 패스로 get 요청됨');
	
	res.render('login.ejs', {messege:req.flash('loginMessage')});
});
router.route('/login').post(passport.authenticate('local-login', {
	successRedirect:'/profile',
	failureRedirect:'/login',
	failureFlash:true
}));
router.route('/signup').get(function(req, res){
	console.log('/signup 패스로 get 요청됨');
	
	res.render('signup.ejs', {messege:req.flash('signupMessage')});
});
router.route('/signup').post(passport.authenticate('local-signup', {
	successRedirect:'/profile',
	failureRedirect:'/signup',
	failureFlash:true
}));
router.route('/profile').get(function(req, res){
	console.log('/profile 패스로 get 요청됨');
	
	console.log('req.user 객체 정보');
	console.dir(req.user);
	
	if(!req.user){
		console.log('사용자 인증 안된 상태임');
		res.redirect('/');
	}else{
		console.log('사용자 인증된 상태임');
		
		if(Array.isArray(req.user)){
			res.render('profile.ejs', {user:req.user[0]._doc});
		}else{
			res.render('profile.ejs', {user:req.user});
		}
	}
});
router.route('/logout').get(function(req, res){
	console.log('/logout 패스로 get 요청됨');
	
	req.logout();//? 만들었었나.. 페이지에서 보내주는 정보인가..
	res.redirect('/');
});

var errorHandler=expressErrorHandler({
	static: {
		'404': './public/404.html'
	}
});

var server=http.createServer(app).listen(app.get('port'), function(){
	console.log('익스프레스로 웹 서버를 실행함: '+app.get('port'));
	
	database_loader.init(app, config);
});
