var express=require('express');
var http=require('http');
var static=require('serve-static');
var path=require('path');

var bodyParser=require('body-parser');
var cookieParser=require('cookie-parser');
var expressSession=require('express-session');

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

var router = express.Router();

router.route('/process/product').get(function(req, res){
	console.log('/process/product 라우팅 함수 호출됨');
	
	if(req.session.user) {
		res.redirect('/public/product.html');
	}else{
		res.redirect('/public/login2.html');
	}
});

router.route('/process/login').post(function(req, res){
	console.log('/process/login 라우팅 함수 호출됨');
	
	var paramId=req.body.id ||req.query.id;
	var paramPassword=req.body.password ||req.query.password;
	console.log('요청 파라미터: '+paramId+', '+paramPassword);
	
	if(req.session.user){
		console.log('이미 로그인되어 있습니다');
		alert('이미 로그인되어 있습니다');
		res.redirect('/publc/product.html');
	}else{
		req.session.user={
			id: paramId,
			name: '소녀시대',
			authorized: true
		};
		
		res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
		res.write('<h1>로그인 성공</h1>');
		res.write('<p>Id: '+paramId+'</p><br><br>');
		res.write('<a href="/process/product">상품 페이지로 이동하기</a>');
		res.end();
	}
});

router.route('/process/logout').get(function(req, res){
	console.log('/process/logout 라우팅 함수 호출됨');
	
	if(req.session.user){
		console.log('로그아웃합니다');
		req.session.destroy(function(err){
			if(err){
				console.log('세션 삭제 시 에러 발생');
				return;
			}
			
			console.log('세션 삭제 성공');
			res.redirect('/public/login2.html');
		});
	}else{
		console.log('로그인되어 있지 않습니다');
		res.redirect('/public/login2.html');
	}
});

app.use('/', router);

app.all('*', function(req, res){
	res.status(404).send('<h1>요청하신 페이지는 없습니다</h1>');
});

var server=http.createServer(app).listen(app.get('port'), function(){
	console.log('익스프레스로 웹 서버를 실행함: '+app.get('port'));
});

