var http=require('http');

var server=http.createServer();

var host = '192.168.200.109';
var port=3000;
server.listen(port, host, 50000, function(){
	console.log('웹서버가 실행되었습니다 -> '+ host + ' : ' +port);
});//50000: 동시 접속자 수 제한
