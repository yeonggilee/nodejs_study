var users=[{name: '소녀시대', age: 20}, {name: '걸스데이', age: 22}, {name: '티아라', age: 21}];

/*

delete users[1];

console.dir(users);

users.forEach(function(elem, index){
	console.log('원소 #'+index);
	console.dir(elem);
});
*/

//변경: splice(인덱스, 0:추가/1:삭제, 추가할 값)
users.splice(1, 0, {name: '애프터스쿨', age: 24});
console.dir(users);

users.splice(2, 1);
console.dir(users);
