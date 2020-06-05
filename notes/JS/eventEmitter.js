function EventEmitter() {
  this._events = Object.create(null);
}
EventEmitter.defaultMaxListeners = 10;
EventEmitter.prototype.addEventListener = EventEmitter.prototype.on;
EventEmitter.prototype.eventNames = function() {
  return Object.keys(this._events);
};
EventEmitter.prototype.setMaxListeners = function(n) {
  this._count = n;
};
EventEmitter.prototype.getMaxListeners = function() {
  return this._count ? this._count : this.defaultMaxListeners;
};
EventEmitter.prototype.on = function(key, cb, flag) {
  if (!this._events) {
    this._events = Object.create(null);
  }
  if (this._events[key]) {
    if (flag) {
      this._events[key].push(cb);
    } else {
      this._events[key].unshift(cb);
    }
  } else {
    this._events[key] = [cb];
  }
  if (this._events[key].length >= this.getMaxListeners()) {
    console.warn('警告');
  }
};
// 监听一次
EventEmitter.prototype.once = function(key, cb, flag) {};

EventEmitter.prototype.removeListener = function(key, cb) {
  if (this._events[key]) {
    this._events[key] = this._events[key].filter(listener => {
      return cb !== listener;
    });
  }
};
EventEmitter.prototype.removeAll = function() {
  this._events = Object.create(null);
};
// 返回所有监听类型
EventEmitter.prototype.listeners = function(key) {
  return this._events[key];
};
EventEmitter.prototype.emit = function(key, ...args) {
  if (this._events[key]) {
    this._events[key].forEach(listener => {
      listener.apply(this, args);
    });
  }
};
