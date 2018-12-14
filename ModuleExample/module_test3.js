var user=require('./user3');//user객체 반환

function showUser() {
	return user.getUser().name+', '+user.group.name;
}

console.log('사용자 정버: '+showUser());