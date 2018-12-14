process.on('exit', function(){
	console.log('exit 이벤트 발생함');//리스너 등록
});

setTimeout(function(){
	console.log('2초 후에 실행되었음');
	process.exit();
},2000);

console.log('2초 후에 실행될 것임');

