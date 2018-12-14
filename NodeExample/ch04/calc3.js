var EventEmitter=require('events').EventEmitter;
var util=require('util');

var Calc=function(){
	this.on('stop', function(){
		console.log('Calc에 stop 이벤트 전달됨');
	});//2. 리스너 등록
};

util.inherits(Calc, EventEmitter);//1. 상속

Calc.prototype.add=function(a, b){
	return a+b;
};

module.exports=Calc;