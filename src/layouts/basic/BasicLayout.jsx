/*
* @author Rocky wu
* Date by 2018/11/12
* 基本全局布局
*/

import React from 'react';
import { connect } from 'dva';
import styles from './BasicLayout.less';    //样式文件
import Sider from './Sider';                //左侧菜单
import Header from './Header';              //右侧头部

class BasicLayout extends React.Component{
	constructor(props){
		super(props);
		this.state = {

		}
		this.MenuOpenChange = this.MenuOpenChange.bind(this);
		this.MenuOnSelect = this.MenuOnSelect.bind(this);
	}

	//打开一级菜单
	MenuOpenChange( openKeys ){
		const { dispatch } = this.props;
		dispatch({
			type : 'global/updateState',
			payload : {
				menuOpenKeys : openKeys
			}
		})
	}

	//选择菜单跳转
	MenuOnSelect( options ){
		const { dispatch } = this.props;
		dispatch({
			type : 'global/updateState',
			payload : {
				menuSelectedKeys : options.selectedKeys,
			}
		})
	}

	render() {
		let { global } = this.props;
		let siderProps = {
			//交互方法
			MenuOpenChange : this.MenuOpenChange,          //打开一级菜单
			MenuOnSelect : this.MenuOnSelect,              //选择菜单跳转
			...global
		}

        let { children } = this.props;

		return (
			<div className = { styles.layout_wrap } >
				<Sider { ...siderProps } />
				<div className = { styles.layout_right } >
					<Header />
					<div style = {{ height : '36px', lineHeight : '30px' }} >面包屑/面包屑</div>
					<div className = { styles.layout_content } >
					    { children }
					</div>
				</div>
			</div>
		)
	}
}

function mapStateToProps({ global }){
	return { global };
}

export default connect(mapStateToProps)(BasicLayout);
