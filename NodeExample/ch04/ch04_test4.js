var Calc=require('./calc3');

var calc1=new Calc();
calc1.emit('stop');//3. 이벤트 전달 -> 4. 리스너 함수 호출

console.log('Calc에 stop이벤트 전달함');//전달이 너무 빨라서 늦게 나옴


	