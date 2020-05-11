/*
 * @author yhwu
 * Date at 2018/10/24
 * 奖品配置 model
 */
import * as Serv from '../services/renderProps';
import { message } from 'antd';

export default {
  namespace: 'renderProps',

  state: {
    namespace: 'renderProps',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname, query, state }) => {
        if (pathname === '/react/renderProps') {
          dispatch({ type: 'GetAwardList' });
        }
      });
    },
  },

  effects: {
    *GetAwardList({ payload }, { call, put }) {
      let { ret } = yield call(Serv.GetAwardList);
      if (!!ret && ret.errorCode === 0) {
        console.log('lll');
      }
    },
  },

  reducers: {
    updateState(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
