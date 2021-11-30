var { CronParser } = require("./cronParser.js");
var { CustomTimer } = require("./customTimer.js");
var { isString , isObject, getDaysInYearMonth, getTargetDate} = require("./utils.js");

exports.CronActuator = CronActuator;

function CronActuator(opts, cb){
  if(!(this instanceof CronActuator)){
    return new CronActuator(opts);
  }
  this.opts = {};
  this.type; // 定时任务类型 1:纯 timeout/interval 定时；2: 纯cron 定时， 3:带 timeout 的 cron 定时
  this.timers = [];
  this.cb = cb;
  this.wake = opts.wake || 3600000;  // 唤醒的间隔，以天为跨度
  this.init(opts);
}

CronActuator.prototype.init = function(opts){
  if(isString(opts)){
    this.type = 2;
    this.opts = new CronParser(opts);
    this.opts.timeout = null;
    this.opts.interval = null; 
  }
  if(isObject(opts)){
    var timerObj = {};
    if(opts.cron){
      this.type = 3;
      timerObj = new CronParser(opts.cron);
      if( !opts.timeout ){  // 没有延时的 cron 当做纯cron
        this.type = 2;
      }
      this.opts.interval = null; 
    }else{
      this.type = 1;
    }
    this.opts = Object.assign(opts, timerObj);
  }
}
CronActuator.prototype.start = function(){
  // 是否是真实的回调，考虑到cron 的时候，需要延时，还有唤醒定时任务的定时任务
  this.opts.real = this.type === 1; 
  this.createTimer(this.opts, 1);
}
/** 
 * type : 常见类型 1： 原始参数创建；2：通过计算创建
*/
CronActuator.prototype.createTimer = function(opts, type){
  var self = this;
  var timer = new CustomTimer(opts, function(){
    self.createNextTimer();
    // 不含 cron 的定时和 cron 非延时定时器 才执行回调，
    if(opts.real){
      self.cb(opts);
    }
  });
  this.timers.push(timer);
  timer.start();
} 
CronActuator.prototype.createNextTimer = function(){
  var self = this;
  var opts = this.opts;
  if(self.type == 1){
    return;
  }
  if(opts.timeEnum){
    var nextTime = calcNextTime(opts, self.wake);
    //console.log(nextTime);
    var data = {
      timeout : nextTime.timeLen,
      interval : 0,
      real : nextTime.real,
    }
    this.createTimer(data, 2);
  }
}
CronActuator.prototype.stop = CronActuator.prototype.clearAll = function(){
  if(this.timers && this.timers.length){
    var i = this.timers.length -1;
    for(; i >= 0; i--){
      var timer = this.timers[i];
      this.cancel(timer);
    }
  }
}
CronActuator.prototype.cancel = function(timer, cb){
  if(timer){
    var timers = this.timers;
    var idx = timers.indexOf(timer);
    idx >= 0 && timers.splice(idx, 1);
    timer && timer.clear();
  }
}

// 计算下一个定时任务的时间
function calcNextTime(opts, maxTime){
  var times = opts.timeEnum;
  var months = times.month;
  var weeks = times.week;
  var days = times.day;
  var hours = times.hour;
  var minutes = times.minute;
  var seconds = times.second;
  var nowDate = getTargetDate();
  var nextDay = getTargetDate(parseInt(maxTime/3600000));

  // 从月份开始找最后一个相等的
  var arr = ["second", "minute", "hour", "day", "month"];
  var i = arr.length - 1;  // 排除星期
  for(; i >= 0; i--){
    var item = times[arr[i]].times;
    if(item.indexOf(nowDate[arr[i]]) < 0){
      break;
    }
  }
  var real = false;
  var res = [];
  var second, minute, hour, day, month;
  for(var n = 0; n < arr.length; n++){
    var item = times[arr[n]].times;
    if(n < i){ // 从月开始第一个不在范围的 
      res.push(item[0]);
    }else{
      if(arr[n] == "second"){
        second = getTimeInArea(seconds, nowDate.second, 60, 1);
        res.push(second[0]);
      }
      if(arr[n] == "minute"){
        minute = getTimeInArea(minutes, nowDate.minute, 60, (second ? second[1] : 1));
        res.push(minute[0]);
      }
      if(arr[n] == "hour"){
        hour = getTimeInArea(hours, nowDate.hour, 24, (minute ? minute[1] : 1));
        res.push(hour[0]);
      }
      if(arr[n] == "day"){
        // 天数是不准的，需要精确计算
        var max = getDaysInYearMonth(nowDate.year, nowDate.month).getDate();
        var day = getTimeInArea(days, nowDate.day, max + 1, (hour ? hour[1] : 1)); 
        res.push(day[0]);
      }
      if(arr[n] == "month"){
        month = getTimeInArea(months, nowDate.month, 13, (day ? day[1] : 1));
        res.push(month[0]);
      }
    }
  }
  var time = new Date(nowDate.year + (month ? month[1] : 1), res[4]-1, res[3], res[2], res[1], res[0]);
  //console.log(time);
  // 是一天内的
  var timeLen = time.getTime() <= nextDay.date.getTime();
  if( weeks.times.indexOf(time.getDay()) > -1 && timeLen){ 
    maxTime = timeLen;
    real = true;
    if(maxTime < 1000){
      setTimeout(function() {
        maxTime = calcNextTime(opts, maxTime).timeLen;
      }, 1000);
    }
  }
  // 都是超过时间范围的，直接返回最大值
  return { timeLen : maxTime, real : real} //[maxTime, real];
}

// 获取 时间区间
function getTimeInArea(opts, val, max, increase){
  var times = opts.times;
  var step = parseInt((val + increase) / max);
  var newVal = parseInt((val + increase) % max);
  for(var i = 0; i < times.length; i++){
    if(times[i] >= newVal && newVal < max){ // 后面这个判断主要是因为月份是动态的，比如 2 月最多只有 29天，枚举里面却可以有 31 天
      return [times[i], step];
    }
  }
  return [times[0], step + 1];
}



/*

https://www.cnblogs.com/yanghj010/p/10875151.html

不受支持的 Cron 功能
目前，不支持W（最近的工作日）和L（每月/每周的最后一天）， 包括#（每月的第 n 个工作日）。
L W C #
流行的 cron 实现支持的大多数其他功能应该可以正常工作.

字段	允许值	允许的特殊字符
秒（Seconds）	0~59的整数	, - * /    四个字符
分（Minutes）	0~59的整数	, - * /    四个字符
小时（Hours）	0~23的整数	, - * /    四个字符
日期（DayofMonth）	1~31的整数（但是你需要考虑你月的天数）	,- * ? / L W C     八个字符
月份（Month）	1~12的整数或者 JAN-DEC	, - * /    四个字符
星期（DayofWeek）	1~7的整数或者 SUN-SAT （1=SUN）	, - * ? / L C #     八个字符
年(可选，留空)（Year）	1970~2099	, - * /    四个字符

*/