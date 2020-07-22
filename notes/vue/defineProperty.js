/*
 * @Author: rockyWu
 * @Date: 2020-06-14 17:52:26
 * @Description:
 * @LastEditors: rockyWu
 * @LastEditTime: 2020-06-14 21:59:34
 */

const Vue = (function() {
  let uid = 0;

  // 订阅发布中心 负责存储订阅者和消息的分发
  class Dep {
    constructor() {
      this.id = uid++; // 区分新的 watcher 和只改变属性值后产生的 watcher
      this.subs = []; // 存储订阅者的数组
    }

    depend() {
      Dep.target.addDep(this);
    }

    // 添加订阅者 (Watcher)
    addSub(sub) {
      this.subs.push(sub);
    }

    // 通知所有的订阅者(Watcher), 触发订阅者的相应逻辑
    notify() {
      this.subs.forEach(sub => sub.update());
    }
  }

  // 监听者, 监听对象属性值的变化
  class Observer {
    constructor(data) {
      this.data = data;
      this.walk(data);
    }

    // 遍历属性值并监听
    walk(data) {
      Object.keys(data).forEach(key => {
        defineReactive(data, key, data[key]);
      });
    }
  }

  function defineReactive(obj, key, val) {
    const dep = new Dep();
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: () => {
        if (Dep.target) {
          dep.depend();
        }
        return val;
      },
      set: newVal => {
        if (newVal === val) return;
        val = newVal;
        observer(newVal); // 对新值进行监听
        dep.notify(); // 通知订阅者, 数值改变了
      },
    });
  }

  function observer(value) {
    if (!value || typeof value !== 'object') {
      return;
    }
    return new Observer(value);
  }

  class Watcher {
    constructor(vm, expOrFn, cb) {
      this.depIds = {};
      this.vm = vm;
      this.cb = cb;
      this.expOrFn = expOrFn;
      this.val = this.get();
    }

    get() {
      Dep.target = this;
      const val = this.vm._data[this.expOrFn];
      Dep.target = null;
      return val;
    }

    addDep(dep) {
      if (!this.depIds.hasOwnProperty(dep.id)) {
        this.depIds[dep.id] = dep;
        dep.addSub(this);
      }
    }
  }
})();
