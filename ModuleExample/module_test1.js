var user1=require('./user1');//exports객체 반환

function showUser() {
	return user1.getUser().name+', '+user1.group.name;
};

console.log('사용자 정보 -> '+showUser());

