process.on('tick', function(count){
	console.log('tick 이벤트 발생함: '+count);
});

setTimeout(function(){
	console.log('2초 후에 실행되었음');
	process.emit('tick',2);// 이벤트 전달
},2000);

console.log('2초 후에 실행될 것임');
