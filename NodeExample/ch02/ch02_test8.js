var path=require('path');

var directories=['Users', 'yeonggi', 'docs'];

// 콤마로 구분
var dirStr=directories.join();
console.log('dir: '+dirStr);
// 슬래시로 구분
var dirStr2=directories.join(path.sep);
console.log('dir2: '+dirStr2);

//디렉토리 또는 파일 추가
var filepath=path.join('/Users/yeonggi', 'notedpad.exe');
console.log('filepath: '+filepath);
//파일경로
var dirname=path.dirname(filepath);
console.log('dirname: '+dirname);
//파일이름
var basename=path.basename(filepath);
console.log('basename: '+basename);
//확장자
var extname=path.extname(filepath);
console.log('extname: '+extname);


