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
  // 有 timeout 的定时任务 type [1,2,3]
  if(opts.timeout){ 
    // type [1] 的定时任务才会进来
    if(opts.interval){
      self.setTimeout(function(){
        self.setInterval(function(){
          self.cb();
        }, opts.interval);
        if(opts.immedi){
          self.cb();
        }
        // 定时任务执行完了需要删除
        self.clearTimeout();
      }, opts.timeout);
    }else{
      self.setTimeout(function(){
        self.cb();
        self.clearTimeout();
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