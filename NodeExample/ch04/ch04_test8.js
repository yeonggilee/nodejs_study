var fs=require('fs');

fs.open('./ch04/output.txt', 'w', function(err, fd){
	if(err){
		console.log('파일 오픈시 에러 발생');
		return;
	}
	var buf=new Buffer('안녕!\n');
	fs.write(fd, buf, 0, buf.length, null, function(err, written, buffer){
		if(err){
			console.log('파일 쓰기 시 에러 발생');
			return;
		}
		console.log('파일 쓰기 완료함');
		
		fs.close(fd, function(){
			console.log('파일 닫기 완료함');
		});
	});//0, buf.length: 0부터 length전까지
})