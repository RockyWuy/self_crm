/*
 * @Author: rockyWu
 * @Date: 2019-01-22 15:16:12
 * @Description:
 * @LastEditors: rockyWu
 * @LastEditTime: 2020-06-29 17:16:12
 */

/* 判断两个对象相等 */
function eq(a, b) {
  // === 结果为true 的区别出+0 和 -0
  if (a === b) return a !== 0 || 1 / a === 1 / b;
  // typeof null 的结果为object, 这里做判断
  if (a == null || b == null) return false;
  // 判断NaN
  if (a !== a) return b !== b;

  // 判断参数 a 类型，如果是基本类型，在这里可以直接返回 false
  let type = typeof a;
  if (type !== 'function' && type !== 'object' && typeof b !== 'object') return false;

  // 更复杂的对象使用 deepEq 函数进行深度比较
  return deepEq(a, b);
}

function isFunction(obj) {
  return toString.call(obj) === '[object Function]';
}

function deepEq(a, b) {
  let className = Object.prototype.toString.call(a);
  let classNameb = Object.prototype.toString.call(b);
  if (className !== classNameb) return false;
  switch (className) {
    case '[object RegExp]':
    case '[object String]':
      return '' + a === '' + b;
    case '[object Number]':
      if (+a !== +a) return +b !== +b;
      return +a === 0 ? 1 / +a === 1 / b : +a === +b;
    case '[object Date]':
    case '[object Boolean]':
      return +a === +b;
  }
  var areArrays = className === '[object Array]';
  // 不是数组
  if (!areArrays) {
    // 过滤掉两个函数的情况
    if (typeof a != 'object' || typeof b != 'object') return false;

    var aCtor = a.constructor,
      bCtor = b.constructor;
    // aCtor 和 bCtor 必须都存在并且都不是 Object 构造函数的情况下，aCtor 不等于 bCtor， 那这两个对象就真的不相等啦
    if (
      aCtor == bCtor &&
      !(
        isFunction(aCtor) &&
        aCtor instanceof aCtor &&
        isFunction(bCtor) &&
        bCtor instanceof bCtor
      ) &&
      'constructor' in a &&
      'constructor' in b
    ) {
      return false;
    }
  }
}
