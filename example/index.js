var CronActuator = CronMini.CronActuator;

var test = new CronActuator({
  cron : "0-10 * 8-23 1-2,7,8 * ?",
  timeout : 5000,
  name : "qunar 定时任务",
  status : "start",
}, function(opts){
  console.log(1, new Date());
});

test.start();




/*
  1. 可以选择 使用原始的 setTimeout setInterval
  2. 可以指定时间段，在一个指定的时间段内使用定时任务
  3. 可以指定什么时候开始执行定时任务
  4. 可以指定 指定的时间执行 

  计算最近一次的定时任务
  最近一次定时任务执行后，自动计算下一次的定时任务时间，
  设置新的定时任务，也即是定时器最多保持两个

  需要计算的是根据 cron 的每一项计算的 yyyy-MM-dd hh:mm:ss
  当前计算的下一个时间-当前时间，就是下次定时任务的 time

  [0,1,2,3,...59]
  [0,1,2,3,...59]
  [1,2,3,4,...31]
  [1,2,3,4,...12]
  [1,2,3,4,...7]

  当前月 -> 是否包含在 月列表中
  当前星期-> 找出下一个最接近的星期
  当前日-> 找出当前最接近的下一个天
  当前小时-> 找出当前最接近的小时
  当前分钟-> 找出当前最接近的分钟
  当前秒-> 找出当前最接近的秒



  不带 cron 的
  timeout 
  interval

  带 cron
  timeout


*/
