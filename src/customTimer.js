/** opts 的格式
  {
    timeout : x
    interval : x
  }
*/

const { getUUId } = require("./utils.js");

function CustomTimer(opts, cb){
  if(!(this instanceof CustomTimer)){
    return new CustomTimer(opts);
  }
  this.timeout = null;
  this.interval = null;
  this.opts = opts;
  this.cb = cb;
  this.id = getUUId();
  this.status = false;
}

CustomTimer.prototype.setTimeout = function (fn, time){
  this.status = true;
  this.timeout = setTimeout(function(){
    fn();
  }, time);
  return this.timeout;
}
CustomTimer.prototype.setInterval = function (fn, time){
  this.status = true;
  this.interval = setInterval(function (){
    fn();
  }, time);
  return this.interval;
}
CustomTimer.prototype.clear = function(){
  this.clearInterval();
  this.clearTimeout();
}
CustomTimer.prototype.clearInterval = function(){
  clearInterval(this.interval);
  this.interval = null;
  if(!this.interval && !this.timeout){
    this.status = false;
  }
}
CustomTimer.prototype.clearTimeout = function(){
  clearTimeout(this.timeout);
  this.timeout = null;
  if(!this.interval && !this.timeout){
    this.status = false;
  }
}
CustomTimer.prototype.start = function(){
  var self = this;
  var opts = this.opts;
  // 有 timeout 的定时任务 type [1,2,3]
  if(opts.timeout){ 
    // type [1] 的定时任务才会进来
    if(opts.interval){
      self.setTimeout(function(){
        // 定时任务执行完了需要删除
        // 顺序很重要，它决定了 定时器的 status 的状态
        self.clearTimeout();
        self.setInterval(function(){
          self.cb();
        }, opts.interval);
        if(opts.immedi){
          self.cb();
        }
      }, opts.timeout);
    }else{
      self.setTimeout(function(){
        self.clearTimeout();
        self.cb();
      }, opts.timeout);
    }
    return;
  }
  // 普通的 interval 定时 type [1]
  if(opts.interval){
    self.setInterval(function(){
      self.cb();
    }, opts.interval);
    return;
  }
  self.cb();
}

exports.CustomTimer = CustomTimer;