var local_login=require('./passport/local_login');
var local_signup=require('./passport/local_signup');

module.exports=function(app, passport){
	console.log('config/passport 호출됨');
	
	//로그인
	passport.use('local-login', local_login);
	//회원가입
	passport.use('local-signup', local_signup);
	console.log('passport strategy 등록됨');
	
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
};