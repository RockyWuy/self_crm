/*
 * @Author: rockyWu
 * @Date: 2020-05-21 10:55:07
 * @Description:
 * @LastEditors: rockyWu
 * @LastEditTime: 2020-05-21 16:56:21
 */

function makeIterator(array) {
  let nextIndex = 0;
  return {
    next: function() {
      return nextIndex < array.length
        ? { value: array[nextIndex++], done: false }
        : { value: undefined, done: true };
    },
  };
}
var it = makeIterator(['a', 'b']);
// it 指针对象 makeIterator 遍历器生成函数
it.next(); // { value: "a", done: false }
it.next(); // { value: "b", done: false }
it.next(); // { value: undefined, done: true }
