/*
* @author Rocky wu
* Date by 2018/11/13
* 全局model
*/

export default {
	namespace : 'global',

	state : {

		//sider
		siderCollapsed : false,              //侧边栏是否折叠
		menuOpenKeys : [],                   //打开的菜单
		menuSelectedKeys : [],               //选中的菜单
	},

	subscriptions : {
		setup({ dispatch, history }){
			history.listen(({ pathname, query }) => {
				if ( pathname === '/') {
				}
			});
		}
	},

	effects : {
	},

	reducers : {
		updateState( state, action){
			return {
				...state,
				...action.payload
			}
		}
	}
}
