var express=require('express');
var http=require('http');
var static=require('serve-static');
var path=require('path');

var bodyParser=require('body-parser');

var app=express();

app.set('port', process.env.PORT || 3000);

//get 방식
//http://localhost:3000/public/images/house.png 검색
app.use('/public', static(path.join(__dirname, 'public')));

//post 방식
//'Postman' 사용
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//form 태그 이용도 가능
//login.html -> <form method="post">
app.use(function(req, res, next){
	console.log('첫 번째 미들웨어 호출됨');
	
	var userAgent=req.header('User-Agent');
	var paramId=req.body.id || req.query.id;// post 또는 get
	
	res.send('<h3>서버에서 응답. User-Agent -> '+userAgent+'</h3><h3>Param Id -> '+paramId+'</h3>');
});

var server=http.createServer(app).listen(app.get('port'), function(){
	console.log('익스프레스로 웹 서버를 실행함: '+app.get('port'));
});

