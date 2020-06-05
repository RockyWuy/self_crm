/*
 * @Author: rockyWu
 * @Date: 2020-05-20 15:36:18
 * @Description:
 * @LastEditors: rockyWu
 * @LastEditTime: 2020-05-21 10:54:57
 */
/**
 * 模拟实现 Set数据结构
 */
let set = new Set();
let set = new Set([1, 2, 3, 4]);
console.log(set); // Set(4) {1, 2, 3, 4}
console.log(set.size); // 4
// 操作方法
console.log(set.add(5)); // Set(5) {1, 2, 3, 4, 5}
console.log(set.delete(5)); // true
console.log(set.has(4)); // true
console.log(set.clear()); // undefined
// 遍历方法
set.keys();
set.values();
set.entries();
set.forEach();
// keys()、values()、entries() 返回的是遍历器

// 模拟实现
(function() {
  // 处理 NaN，NaN !== NaN， 但是 Set 会判断成相等
  let NANSymbol = Symbol('NaN');
  function encodeVal(value) {
    return value !== value ? NANSymbol : value;
  }
  function decodeVal(value) {
    return value === NANSymbol ? NaN : value;
  }
  function makeIterator(array, iterator) {
    let nextIndex = 0;
    // new Set(new Set()) 会调用这里
    let obj = {
      next: function() {
        return nextIndex < array.length
          ? { value: iterator(array[nextIndex++]), done: false }
          : { value: void 0, done: true };
      },
    };
    // [...set.keys()] 调用
    obj[Symbol.iterator] = function() {
      return obj;
    };
    return obj;
  }

  function forOf(obj, cb) {
    let iterator, result;
    if (typeof obj[Symbol.iterator] !== 'function') throw new Error(obj + ' is not iterable');
    if (typeof cb !== 'function') throw new Error('cb must be callable');
    iterator = obj[Symbol.iterator]();
    result = iterator.next();
    while (!result.done) {
      cb(result.value);
      result = iterator.next();
    }
  }

  function Set(data) {
    this._values = [];
    this.size = 0;
    forOf(data, item => {
      this.add(item);
    });
  }

  Set.prototype['add'] = function(value) {
    value = encodeVal(value);
    if (this._values.indexOf(value) === -1) {
      this._values.push(value);
      ++this.size;
    }
    return this;
  };

  Set.prototype['delete'] = function(value) {
    let idx = this._values.indexOf(encodeVal(value));
    if (idx === -1) return;
    this._values.splice(index, 1);
    --this.size;
    return true;
  };

  Set.prototype['has'] = function(value) {
    return this._values.indexOf(encodeVal(value)) !== -1;
  };

  Set.prototype['clear'] = function() {
    this._values = [];
    this.size = 0;
  };

  Set.prototype['forEach'] = function(callback, thisArg) {
    thisArg = thisArg || window;
    let iterator = this.entries();
    forOf(iterator, item => {
      callback.call(thisArg, item[1], item[0], this);
    });
  };

  Set.prototype['values'] = Set.prototype['keys'] = function() {
    return makeIterator(this._values, function(value) {
      return decodeVal(value);
    });
  };
  Set.prototype['entries'] = function() {
    return makeIterator(this._values, function(value) {
      return [decodeVal(value), decodeVal(value)];
    });
  };
  Set.prototype[Symbol.iterator] = function() {
    return this.values();
  };

  set.length = 0;
})();
