var fs=require('fs');

var data=fs.readFile('./package.json', 'utf8', function(err, data){
	console.log(data);
});