/*
 * @author yhwu
 * Date at 2018/10/24
 * 奖品配置 model
 */
import * as awardSetServ from '../services/awardSetPage';
import { message } from 'antd';

export default {
  namespace: 'awardSetPage',

  state: {
    namespace: 'awardSetPage',
    searchObj: {}, //搜索项
    awardTypeSels: [], //奖品类型 下拉

    num: 1, //分页页码
    row: 10, //分页大小
    total: 0, //数据总数
    loading: false, //是否加载中
    dataSource: [], //所有数据
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname, query, state }) => {
        if (pathname === '/activity/awardSet') {
          //					dispatch({ type : 'GetAwardList' })
        }
      });
    },
  },

  effects: {
    //加载奖品 列表
    *GetAwardList({ payload }, { call, put, select }) {
      yield put({ type: 'updateState', payload: { loading: true } });
      let state = yield select(state => state.awardSetPage);
      let num = (!!payload && payload.num) || state.num || 1;
      let row = (!!payload && payload.row) || state.row || 10;
      let values = (!!payload && payload.values) || state.searchObj || {};
      let params = {
        num,
        row,
        ...values,
      };
      let { ret } = yield call(awardSetServ.GetAwardList, params);
      if (!!ret && ret.errorCode === 0) {
        yield put({
          type: 'updateState',
          payload: {
            num,
            row,
            dataSource: ret.data,
            total: ret.total,
          },
        });
      } else {
        message.error((!!ret && ret.errorMessage) || '列表加载失败');
      }
      yield put({ type: 'updateState', payload: { loading: false } });
    },
  },

  reducers: {
    updateState(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
