var fs=require('fs');

var infile=fs.createReadStream('./ch04/output.txt', {flags:'r'});//flags: 권한부여

infile.on('data', function(data){
	console.log('읽어들인 데이터: '+data);
});

infile.on('end', function(){
	console.log('읽기 종료');
})