/*
* @author Rocky wu
* Date by 2018/11/13
* 左侧菜单布局
*/

import React from 'react';
import './Sider.less';
//import styles from './Sider.less';
import SiderMenu from '../common/menu/SiderMenu';        //菜单组件
import { /*Icon*/ } from 'antd';


function Sider({

	/*菜单 属性*/
	siderCollapsed,           //侧边栏是否折叠
	menuOpenKeys,             //打开的菜单
	menuSelectedKeys,         //选中的菜单
	//交互方法
	MenuOpenChange,           //打开一级菜单
	MenuOnSelect,             //选择菜单跳转

}){
	/*菜单 属性*/
	let menuProps = {
		siderCollapsed,           //侧边栏是否折叠
		menuOpenKeys,             //打开的菜单
		menuSelectedKeys,         //选中的菜单

		//交互方法
		MenuOpenChange,           //打开一级菜单
		MenuOnSelect,             //选择菜单跳转
	}

	return (
		<div className = 'sider_wrap' >
			<SiderMenu { ...menuProps } />
		</div>
	)
}

export default Sider;
