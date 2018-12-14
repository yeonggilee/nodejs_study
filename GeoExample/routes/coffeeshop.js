var add=function(req, res){
	console.log('add 함수 호출됨');
	
	var paramName=req.body.name || req.query.name;
	var paramAddress=req.body.address || req.query.address;
	var paramTel=req.body.tel || req.query.tel;
	var paramLongitude=req.body.longitude || req.query.longitude;
	var paramLatitude=req.body.latitude || req.query.latitude;
	
	console.log('파라미터: '+paramName+', '+paramAddress+', '+paramTel+', '+paramLongitude+', '+paramLatitude);
	
	var database=req.app.get('database');
	var params={
		name:paramName,
		address:paramAddress,
		tel:paramTel,
		geometry:{
			type:'Point',
			coordinates:[paramLongitude, paramLatitude]
		}
	};
	addCoffeeshop(database, params, function(err, result){
		if(err){
			res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
			res.write('<h2>커피숍 추가 중 에러 발생</h2>');
			res.end();
			
			return;
		}
		if(result){
			res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
			res.write('<h2>커피숍 추가 성공</h2>');
			res.end();
		}else{
			res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
			res.write('<h2>커피숍 추가 실패</h2>');
			res.end();
		}
	});
};

var addCoffeeshop=function(database, params, callback){
	console.log('addCoffeeshop 호출됨');
	
	var coffeeshop=new database.CoffeeshopModel(params);
	
	coffeeshop.save(function(err){
		if(err){
			console.log('에러 발생');
			callback(err, null);
			return;
		}
		
		console.log('커피숍 데이터 추가함');
		callback(null, coffeeshop);
	})
};

var list=function(req, res){
	console.log('list 함수 호출됨');
	
	var database=req.app.get('database');
	database.CoffeeshopModel.findAll(function(err, results){
		if(err){
			res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
			res.write('<h2>커피숍 조회 중 에러 발생</h2>');
			res.end();
			
			return;
		}
		if(results){
			res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
			res.write('<h2>커피숍 리스트</h2>');
			res.write('<div><ul>');
			
			for(var i=0; i<results.length; i++){
				var curName=results[i]._doc.name;
				var curAddress=results[i]._doc.address;
				var curTel=results[i]._doc.tel;
				var curLongitude=results[i]._doc.geometry.coordinates[0];
				var curLatitude=results[i]._doc.geometry.coordinates[1];
				
				res.write('<li>#'+i+' : '+curName+', '+curAddress+', '+curTel+', '+curLongitude+', '+curLatitude);
			}
			
			res.write('</ul></div>');
			res.end();
		}else{
			res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
			res.write('<h2>커피숍 조회 실패</h2>');
			res.end();
		}
	});
};

var findNear=function(req, res){
	console.log('findNear 라우팅 함수 호출됨');
	
	var maxDistance=1000;
	var paramLongitude=req.body.longitude || req.query.longitude;
	var paramLatitude=req.body.latitude || req.query.latitude;
	
	console.log('PARAMS -> '+paramLongitude+', '+paramLatitude);
	
	var database=req.app.get('database');
	
	database.CoffeeshopModel.findNear(paramLongitude, paramLatitude, maxDistance, function(err, results){
		if(err){
			res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
			res.write('<h2>가까운 커피숍 조회 중 에러 발생</h2>');
			res.end();
			
			return;
		}
		if(results){
			res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
			res.write('<h2>가까운 커피숍 리스트</h2>');
			res.write('<div><ul>');
			
			for(var i=0; i<results.length; i++){
				var curName=results[i]._doc.name;
				var curAddress=results[i]._doc.address;
				var curTel=results[i]._doc.tel;
				var curLongitude=results[i]._doc.geometry.coordinates[0];
				var curLatitude=results[i]._doc.geometry.coordinates[1];
				
				res.write('<li>#'+i+' : '+curName+', '+curAddress+', '+curTel+', '+curLongitude+', '+curLatitude);
			}
			
			res.write('</ul></div>');
			res.end();
		}else{
			res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
			res.write('<h2>가까운 커피숍 조회 실패</h2>');
			res.end();
		}
	});
};

module.exports.add=add;
module.exports.list=list;
module.exports.findNear=findNear;