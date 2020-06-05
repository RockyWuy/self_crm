/*
 * @Author: rockyWu
 * @Date: 2018-12-30 11:28:44
 * @Description:
 * @LastEditors: rockyWu
 * @LastEditTime: 2020-06-02 15:02:54
 */

//单一职责原则
//开放-封闭原则
function arrayMap(arg, callback) {
  let i = 0,
    length = arg.length,
    value,
    ret = [];
  for (; i < length; i++) {
    value = callback(i, arg[i]);
    ret.push(value);
  }
  return ret;
}
