/*
 * @Author: rockyWu
 * @Date: 2018-12-30 11:32:00
 * @Description:
 * @LastEditors: rockyWu
 * @LastEditTime: 2020-06-16 10:20:18
 */

function createStore(reducer) {
  let state = null;
  let listeners = [];
  const subscribe = listener => listeners.push(listener);
  const getState = () => state;
  const dispatch = action => {
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  };
  dispatch({}); //初始化 state
  return { getState, dispatch, subscribe };
}

export default createStore;
