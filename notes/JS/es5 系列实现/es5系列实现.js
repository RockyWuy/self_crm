/*
 * @Author: rockyWu
 * @Date: 2018-11-22 15:09:29
 * @Description:
 * @LastEditors: rockyWu
 * @LastEditTime: 2020-05-20 20:37:49
 */

// NaN的本质
[1, 2, NaN].indexOf(NaN); // -1

/**
 * new 实现
 */
function Person(name) {
  this.name = name;
}
let person = new Person('rocky');

function myNew(constructor, ...args) {
  let obj = Object.create(constructor.prototype);
  let result = constructor.call(obj, ...args);
  return typeof result === 'object' ? result : obj;
}

/**
 * call 实现， 仅供娱乐
 */
Function.prototype.myCall = function(context) {
  context = context || window;
  let caller = Symbol('caller'); // 唯一标识，防止被绑定对象中已有属性覆盖
  context[caller] = this;
  let args = Array.prototype.slice.call(arguments, 1);
  let result = context[caller](...args);
  delete context[caller];
  return result;
};
function show() {
  console.log(this);
}
// 区别如下
show.myCall({ a: 1 }); // { a: 1, fn: f }
show.call({ a: 1 }); // { a: 1 }

/**
 * bind 实现
 */
let obj = { value: '1' };
function Person() {
  this.name = 'rocky';
}
Person.prototype.age = 24;
let BindPerson = Person.bind(obj);
let person = new BindPerson();
console.log(person.name, person.age); // rocky 24

Function.prototype.myBind = function(context) {
  if (typeof this !== 'function') {
    throw new Error('Function.prototype.myBind - what is trying to be bound is not caller');
  }
  let _self = this;
  let args = Array.prototype.slice.call(arguments, 1);

  var fNOP = function() {}; // 空函数中转，避免修改 fBound原型影响到 原函数
  let fBound = function() {
    let bindArgs = Array.prototype.slice.call(arguments);
    // 当作为构造函数时，this 指向实例，此时结果为 true，将绑定函数的 this 指向该实例，可以让实例获得来自绑定函数的值
    // 当作为普通函数时，this 指向 window，此时结果为 false，将绑定函数的 this 指向 context
    return _self.call(this instanceof fNOP ? this : context, ...args, ...bindArgs);
  };
  fNOP.prototype = this.prototype;
  fBound.prototype = new fNOP();
  return fBound;
};

/**
 * fill 函数实现
 */
[1, 2, 3].fill(3); // [3, 3, 3];
Array.prototype.myFill = function(value, start, end) {
  start = start || 0;
  end = end || this.length - 1;
  let arrs = [];
  (function replace(start) {
    arrs[start] = value;
    if (start < end) {
      replace(++start);
    }
  })(start);
  return arrs;
};

/**
 * 防抖 函数
 * 不管触发多少次事件，都以最后事件触发 n秒后执行
 */
function debounce(callback, interval) {
  let timer;
  return function() {
    let _self = this; // 防止this指向全局
    let args = arguments; // event 对象
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      callback.apply(_self, args);
      clearTimeout(timer);
    }, interval);
  };
}
// 立即执行
function debounce(callback, interval, immediate) {
  let timer, result;
  let debounced = function() {
    let _self = this;
    let args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    if (immediate) {
      let callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, interval);
      if (callNow) result = callback.apply(_self, args);
    } else {
      timer = setTimeout(() => {
        callback.apply(_self, args);
        clearTimeout(timer);
      }, interval);
    }
    return result;
  };
  // 取消防抖函数
  debounced.cancel = function() {
    clearTimeout(timer);
    timer = null;
  };
}

/**
 * 节流 函数
 * 不管触发多少次事件，都固定隔一段时间执行事件
 */
// 使用时间戳方式， 进入即执行
function throttle(callback, interval) {
  let previous = 0;
  return function() {
    let now = +new Date();
    let _self = this;
    let args = arguments;
    if (now - previous > interval) {
      callback.apply(_self, args);
      previous = now;
    }
  };
}
// 定时器方式，执行过段时间触发
function throttle(callback, interval) {
  let timer;
  return function() {
    let _self = this;
    let args = arguments;
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        callback.apply(_self, args);
      }, interval);
    }
  };
}
// 立刻执行，停止触发的时候还能再执行一次
function throttle(callback, interval) {
  let timer;
  let previous = 0;
  let throttled = function() {
    let now = +new Date();
    // 下次触发 callback 剩余时间
    let remain = interval - (now - previous);
    let _self = this;
    let args = arguments;
    if (remain <= 0) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      previous = now;
      callback.apply(_self, args);
    } else if (!timer) {
      timer = setTimeout(() => {
        previous = +new Date();
        timer = null;
        callback.apply(_self, args);
      }, interval);
    }
  };
  return throttled;
}
