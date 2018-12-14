
var login = function(req, res){
	console.log('/process/login 라우팅 함수 호출');
	
	var paramId=req.body.id || req.query.id;
	var paramPassword=req.body.password || req.query.password;
	console.log('요청 파라미터: '+paramId+', '+paramPassword);
	
	var database=req.app.get('database');
	if(database){
		authUser(database, paramId, paramPassword, function(err, docs){
			if(err){
				console.log('에러 발생');
				
				res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
				res.write('<h1>에러 발생</h1>');
				res.end();
				return;
			}
			
			if(docs){
				console.dir(docs);
				
				res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
				res.write('<h1>사용자 로그인 성공</h1>');
				res.write('<div><p>사용자: '+docs[0].name+'</p></div><br><br>');
				res.write('<a href="/public/login.html">다시 로그인하기</a>')
				res.end();
			}else{
				console.log('에러 발생');
				
				res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
				res.write('<h1>사용자 데이터 조회 안됨</h1>');
				res.end();
			}
			
		});
	}else{
		console.log('에러 발생');

		res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
		res.write('<h1>데이터베이스 연결 안됨</h1>');
		res.end();
	}
	
};

var adduser=function(req, res){
	console.log('/process/adduser 라우팅 함수 호출됨');
	
	var paramId=req.body.id || req.query.id;
	var paramPassword=req.body.password || req.query.password;
	var paramName=req.body.name || req.query.name;
	
	console.log('요청 파라미터: '+paramId+', '+paramPassword+', '+paramName);
	
	var database=req.app.get('database');
	if(database){
		addUser(database, paramId, paramPassword, paramName, function(err, result){
			if(err){
				console.log('에러 발생');
				
				res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
				res.write('<h1>에러 발생</h1>');
				res.end();
				return;
			}
			
			if(result){
				console.dir(result);
				
				res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
				res.write('<h1>사용자 로그인 성공</h1>');
				res.write('<div><p>사용자: '+paramName+'</p></div><br><br>');
				res.end();
			}else{
				console.log('에러 발생');
				
				res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
				res.write('<h1>사용자 추가 안됨</h1>');
				res.end();
			}
		});
	}else{
		console.log('에러 발생');

		res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
		res.write('<h1>데이터베이스 연결 안됨</h1>');
		res.end();
	}
	
};

var listuser=function(req, res){
	console.log('/process/listuser 라우팅 함수 호출됨');
	
	var database=req.app.get('database');
	if(database){
		database.UserModel.findAll(function(err, results){
			if(err){
				console.log('에러 발생');
				
				res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
				res.write('<h1>에러 발생</h1>');
				res.end();
				return;
			}
			
			if(results){
				console.dir(results);
				
				res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
				res.write('<h3>사용자 리스트</h3>');
				res.write('<div><ul>');
				results.forEach(function(result, index){
					var curId= result._doc.id;
					var curName= result._doc.name;
					
					res.write("		<li>#"+index+" -> "+curId+", "+curName+"</li>");
				});
				
				res.write('</ul></div>');
				res.end();
			}else{
				console.log('에러 발생');
				
				res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
				res.write('<h1>조회된 사용자 없음</h1>');
				res.end();
			}
		});
	}else{
		console.log('에러 발생');

		res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
		res.write('<h1>데이터베이스 연결 안됨</h1>');
		res.end();
	}
};

var authUser=function(db, id, password, callback){
	console.log('authUser 호출됨: '+id+", "+password);
	
	db.UserModel.findById(id, function(err, results){
		if(err){
			callback(err, null);
			return;
		}
		
		console.log('아이디 %s로 검색됨', id);
		if(results.length>0){
			var user=new db.UserModel({id:id});
			var authenticated=user.authenticate(password, results[0]._doc.salt, results[0]._doc.hashed_password);
			
			if(authenticated){
				console.log('비밀번호 일치함');
				callback(null, results)
			}else{
				console.log('비밀번호 일치하지 않음');
				callback(null, null);
			}
		}else{
			console.log('아이디 일치하는 사용자 없음');
			callback(null, null);
		}
		
	});
};

var addUser=function(db, id, password, name, callback){
	console.log('addUser 호출됨: '+id+', '+password+', '+name);
	
	var user=new db.UserModel({"id":id, "password":password, "name":name});
	
	user.save(function(err){
		if(err){
			callback(err, null);
			return;
		}
		
		console.log('사용자 데이터 추가함');
		callback(null, user);
	});
	
};

module.exports.login = login;
module.exports.adduser = adduser;
module.exports.listuser = listuser;