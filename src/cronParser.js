/** cron 表达式解析
*/

exports.CronParser = CronParser;

function CronParser (cron){
  if(!(this instanceof CronParser)){
    return new CronParser(cron)
  }
  this.cron = cron;
  var timeArea = cronParse(this.cron);
  this.timeEnum  = calcTime(timeArea);
}

// 解析 cron 表达式
function cronParse (cron){
  var crons = cron.split(" ");
  var rex = /^((([0-9]{1,2}([-\/][0-9]{1,2})?)(,[0-9]{1,2}([-\/][0-9]{1,2})?)*)|[\*\?])$/;
  var cronList = [];
  var len = crons.length;
  // 如果后面的没有填，自动的回填 *
  for(var n = len; n < 6; n++){
    crons[n].push("*");
  }
  // 解析里面的每一项
  for(var i = 0; i < crons.length; i++){
    var item = crons[i];
    if(!rex.test(item)){
      return ;
    }
    // 所有的日期都按 0-60 算，后面会截取有效的日期
    if(item == "*" || item == "?"){  // 不限
      cronList.push(parserItem("0-60"));
      continue;
    }
    // 逗号的最大的分类，先解析逗号
    if(item.indexOf(",") > -1){// 枚举
      var times = item.split(/[\,]/g);
      var arr = []
      for(var n = 0; n < times.length; n++){
        arr = arr.concat(parserItem(times[n]));
      }
      cronList.push(arr);
      continue
    }
    cronList.push(parserItem(item));
  }
  return cronList;
}
// 解析每一项
function parserItem(item){
  var arr = [];
  if(item.indexOf("-") > -1){ //范围
    var times = item.split(/[-]/g);
    var start = parseInt(times[0]);
    var end = Math.min(parseInt(times[1]), 60); // 减少循环次数
    for(var x = start; x <= end; x++){
      arr.push(x);
    }
    return arr;
  }
  if(item.indexOf("/") > -1){ // 间隔
    var times = item.split(/[\/]/g);
    var start = parseInt(times[0]);
    var step = parseInt(times[1]);
    for(var x = start; x <= 60; x = x + step){
      arr.push(x);
    }
    return arr;
  } 
  // 指定的时间
  return [parseInt(item)];
}

// 计算定时任务时间
function calcTime (cronList){
  if(!cronList){
    return {};
  }
  var data = {};
  for(var i = 0; i < cronList.length; i++){
    var item = cronList[i];
    if(i == 0){ // 秒
      data.second = normalizaTime(item, 0, 59);
    }else if(i == 1){ // 分钟
      data.minute = normalizaTime(item, 0, 59);
    }else if(i == 2){ // 小时
      data.hour = normalizaTime(item, 0, 23);
    }else if(i == 3){ // 天
      data.day = normalizaTime(item, 1, 31);
    }else if(i == 4){ // 月
      data.month = normalizaTime(item, 1, 12);
    }else{  // 星期
      data.week = normalizaTime(item, 1, 7);
    }
  }
  return data;
}

// 规范数据
function normalizaTime(times, min, max){
  var data = {
    times : [],
  };
  for(var i = 0; i < times.length; i++){
    var item = times[i];
    if(item >= min && item <= max){
      data.times.push(item);
    }
  }
  data.times.sort(function(a, b){return a - b});
  return data;
}
