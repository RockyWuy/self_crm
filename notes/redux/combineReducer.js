/*
 * @Author: rockyWu
 * @Date: 2020-08-03 09:52:24
 * @Description:
 * @LastEditors: rockyWu
 * @LastEditTime: 2020-08-03 09:52:38
 */

import count from './count';
import alert from './alert';
//实现combineReducers函数
const combineReducers = reducers => {
  return (state = {}, action) => {
    return Object.keys(reducers).reduce((nextState, key) => {
      //key: count,key
      //state[key]:当前遍历的reducer先前的state值
      //nextState[key]:当前遍历的reducer变化后的state值
      nextState[key] = reducers[key](state[key], action);
      return nextState;
    }, {});
  };
};
//调用combineReducers,传入所有的reducers
const reducers = combineReducers({
  count,
  alert,
});
export default reducers;
