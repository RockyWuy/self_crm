/*
 * @Author: rockyWu
 * @Date: 2020-06-14 17:52:26
 * @Description:
 * @LastEditors: rockyWu
 * @LastEditTime: 2020-08-14 09:31:00
 */
// get 中收集依赖 set中触发依赖
function defineReactive(data, key, val) {
  let dep = new Dep();
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function() {
      dep.depend();
      return val;
    },
    set: function(newVal) {
      if (val === newVal) {
        return;
      }
      val = newVal;
      dep.notify();
    },
  });
}

// 依赖收集 类
class Dep {
  constructor() {
    this.subs = [];
  }
  addSub(sub) {
    this.subs.push(sub);
  }
  removeSub(sub) {
    remove(this.subs, sub);
  }
  depend() {
    if (window.target) {
      this.addSub(window.target);
    }
  }
  notify() {
    const subs = this.subs.slice();
    for (let i = 0; i < subs.length; i++) {
      subs[i].update();
    }
  }
}
function remove(arrs, item) {
  if (arrs.length) {
    const index = arrs.indexOf(item);
    if (index > -1) {
      return arrs.splice(index, 1);
    }
  }
}

class Watcher {
  constructor(vm, expOrFn, cb) {
    this.vm = vm;
    this.getter = parsePath(expOrFn);
    this.cb = cb;
    this.value = this.get();
  }

  get() {
    window.target = this;
    let value = this.getter.call(this.vm, this.vm);
    window.target = undefined;
    return value;
  }

  update() {
    const oldValue = this.value;
    this.value = this.get();
    this.cb.call(this.vm, this.value, oldValue);
  }
}
