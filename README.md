# cron-mini
可用于浏览器和 node 端的 cron 风格定时器，非常轻量，不依赖任何第三方包。

cron 表达式暂不支持 L W C # ，可以支持 * ? , - / 等设置的表达式。


### 使用示例
浏览器和 node 端使用方式是一样的。

var { CronActuator } = require("cron-mini");

CronActuator(String | Object, function);


#### 普通的 timeout 定时任务
```javascript
// 引入 定时任务执行器构造函数
var { CronActuator } = require("cron-mini");

// 创建一个定时器对象，此处只是创建了定时器对象，并没有开始定时

var testTimer = new CronActuator({
  timeout : 5000, // 单位 ms ， 此参数创建的是一个 5 秒后执行的 setTimeout 定时任务
  // 此处可以自定义属性，属性会挂载到 创建的定时器对象上
}, function(){  // 定时任务到时间后的执行方法
  console.log(new Date());
});
// 调用定时器对象的开始方法，定时器开始创建定时任务，
testTimer.start(); 
// 停止定时任务
testTimer.stop();
```

#### 普通的 interval 定时任务
```javascript
var { CronActuator } = require("cron-mini");

var testTimer = new CronActuator({
  interval : 5000,  // 此参数创建的是一个 5 秒后执行的 setInterval 定时任务
}, function(){
  console.log(new Date());
});
testTimer.start();

```

#### 指定时间后执行 interval 定时任务
```javascript
var { CronActuator } = require("cron-mini");

var testTimer = new CronActuator({
  timeout : 1000, // 一秒钟后开始创建 interval 定时任务
  interval : 5000,  // 1 秒后开始进入 interval 5秒循环任务
  // 默认为 false, 指定 timeout 时间后是否需要立即执行 一次回调，
  // 如果为 true, 则 1秒后会调用第一次回调
  // 如果为 false, 则6秒后会调用第一次回调
  immedi : true,  
}, function(){
  console.log(new Date());
});
testTimer.start();

```


#### cron 格式的定时任务
```javascript
var { CronActuator } = require("cron-mini");

var test = new CronActuator("0-10 * 8-23 1-2,7,8 * ?", function(){
  console.log(new Date());
});
test.start();
```


#### 指定时间后执行 cron 定时任务
```javascript
var { CronActuator } = require("cron-mini");

var testTimer = new CronActuator({
  timeout : 1000, // 一秒钟后开始解析 crom 定时任务
  cron : "0-10 * 8-23 1-2,7,8 * ?",
  // immedi : true,  此参数不生效
  // interval : 1000, 此参数不生效
}, function(){
  console.log(new Date());
});
testTimer.start();

```


## 浏览器支持
支持所有的浏览器及所有的 node 版本


## 后期计划
后面升级表达式支持 L W C # 。


