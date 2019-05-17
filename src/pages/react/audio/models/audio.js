/*
* @author yhwu
* Date at 2018/10/24
* 奖品配置 model
*/
//import * as Serv from '../services/audio';
import { message } from 'antd';

export default {

	namespace: 'audio',

	state: {
		namespace: 'audio',

	},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(({ pathname, query, state }) => {
                if( pathname === '/react/audio' ){
				}
            });
		},
	},

	effects: {
	},

	reducers: {
		updateState(state, action) {
			return { ...state, ...action.payload };
		},
	},
}
