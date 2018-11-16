/*
* @author yhwu
* Date at 2018/10/27
* 奖品编辑 model
*/
import * as awardEditServ from '../services/awardEdit';
import { message } from 'antd';

export default {

	namespace: 'awardEdit',

	state: {
		namespace : 'awardEdit',
		awardTypeSels : [],               //奖品类型 下拉

		editInfo : {},                    //编辑详情
		RefreshList : undefined,          //刷新列表
		visible : false,                  //表单显隐
		loading : false,
	},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(({ pathname, query, state }) => {

            });
		},
	},

	effects: {
		//打开奖品编辑框
		*OpenAwardEditModal({ payload },{ call, put, select }){
			let { item, RefreshList } = payload;
			yield put({
				type : 'updateState',
				payload : {
					visible : true,
					RefreshList,
					editInfo : item,
				}
			})
		},

		//表单提交保存
		*Submit({ payload },{ call, put, select }){
			if( !payload ) return;
			let state = yield select( state => state.awardEdit );
			yield put({ type : 'updateState', payload : { loading : true }})
			let { ret } = yield call( awardEditServ.Submit, payload );
			if( !!ret && ret.errorCode === 0 ){
				yield put({
					type : 'updateState',
					payload : { visible : false }
				})
				!!state.RefreshList && state.RefreshList();
			} else{
				message.error( !!ret && ret.errorMessage || '奖品编辑失败' )
			}
			yield put({ type : 'updateState', payload : { loading : false }})
		}
	},

	reducers: {
		updateState(state, action) {
			return { ...state, ...action.payload };
		},
	},
}
