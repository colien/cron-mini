function isObject(obj){
  return Object.prototype.toString.call(obj) == "[object Object]" && obj !== null;
}

exports.isObject = isObject;

function isFun(fn){
  return Object.prototype.toString.call(fn) == "[object Function]";
}
exports.isFun = isFun;

function isArray(arr) {
  return Object.prototype.toString.call(arr) == "[object Array]";
}
exports.isArray = isArray;

function isString(str){
  return Object.prototype.toString.call(str) == "[object String]";
}
exports.isString = isString;

function isNumber(num){
  return Object.prototype.toString.call(num) == "[object Number]";
}
exports.isNumber = isNumber;

function isDate(date){
  return date instanceof Date;
}
exports.isDate = isDate

/** 计算某年某月有多少天
 */
function getDaysInYearMonth(year, month, day){
  day = day || 0;
  return new Date(year, month, day);
}
exports.getDaysInYearMonth = getDaysInYearMonth;

// 获取目标月数
function getTargetDate(date, day){
  var myDate = new Date();
  if(isDate(date)){
    myDate = date;
  }else if(isNumber(date)){
    day = date;
  }
  if(day){
    var d = myDate.getDate() + day;
    myDate = new Date(myDate.setDate(d));
  }
  return {
    year : myDate.getFullYear(),
    week : myDate.getDay(),
    month : myDate.getMonth() + 1,
    day : myDate.getDate(),
    hour : myDate.getHours(),
    minute : myDate.getMinutes(),
    second : myDate.getSeconds(),
    date : myDate,
  }
}
exports.getTargetDate = getTargetDate;


