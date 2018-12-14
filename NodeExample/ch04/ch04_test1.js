var url=require('url');

var urlStr='https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query=popcorn';

var curUrl=url.parse(urlStr);//주소 문자열 -(파싱)-> url 객체
console.dir(curUrl);
console.log('query-> '+curUrl.query);

var curStr=url.format(curUrl);//url 객체 -(포맷)-> 주소 문자열
console.log('url-> '+curStr);

var querystring=require('querystring');
var params=querystring.parse(curUrl.query);
console.log('검색어: '+params.query);
