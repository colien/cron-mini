/** opts 的格式
  {
    timeout : x
    interval : x
  }
*/
function CustomTimer(opts, cb){
  if(!(this instanceof CustomTimer)){
    return new CustomTimer(opts);
  }
  this.timeout = null;
  this.interval = null;
  this.opts = opts;
  this.cb = cb;
}

CustomTimer.prototype.setTimeout = function (fn, time){
  this.timeout = setTimeout(function(){
    fn();
  }, time);
  return this.timeout;
}
CustomTimer.prototype.setInterval = function (fn, time){
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
}
CustomTimer.prototype.clearTimeout = function(){
  clearTimeout(this.timeout);
  this.timeout = null;
}
CustomTimer.prototype.start = function(){
  var self = this;
  var opts = this.opts;
  // 普通的定时任务
  if(opts.timeout){
    if(opts.interval){
      var timer = setTimeout(function(){
        var timer2 = self.setInterval(function(){
          self.cb();
        }, opts.interval);
        seif.interval = timer2;
        // 定时任务执行完了需要删除
      }, opts.timeout);
      self.timeout = timer;
    }else{
      var timer = self.setTimeout(function(){
        self.cb();
      }, opts.timeout);
      self.timeout = timer;
    }
  }else{
    self.cb();
  }
}

exports.CustomTimer = CustomTimer;