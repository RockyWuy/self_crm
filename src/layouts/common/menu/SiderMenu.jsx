/*
* @author Rocky wu
* Date by 2018/11/13
* 菜单 组件
*/

import React from 'react';
import './SiderMenu.less';
//import styles from './Sider.less';
import { Menu, Icon } from 'antd';
import { Link } from 'dva/router';
import { menuArrs } from './menuConfig';     //菜单配置
import { TransArrsToTree } from '../../../utils/sync/array';  //平级数组转树状方法

const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;

function SiderMenu({
	siderCollapsed,           //侧边栏是否折叠
	menuOpenKeys,             //打开的菜单
	menuSelectedKeys,         //选中的菜单

	//交互方法
	MenuOpenChange,           //打开一级菜单
	MenuOnSelect,             //选择菜单跳转
}){
	let menus = TransArrsToTree( menuArrs );
	let menuProps = {
		theme : 'dark',
		mode : 'inline',
		inlineCollapsed : siderCollapsed,
		onOpenChange : MenuOpenChange,     //打开上级菜单
		onSelect : MenuOnSelect,           //点击选中菜单
		openKeys : menuOpenKeys,           //打开的菜单
		selectedKeys : menuSelectedKeys,   //选中的菜单
	}
	//渲染菜单
	function renderMenu( arrs, key ){
		let menus = [];
		arrs.length > 0 && arrs.forEach(( item, index ) => {
			if( item.children && item.children.length > 0 ){
				menus.push(
					<SubMenu
						key = {item.key}
						title = {<span>{ !!item.icon && <Icon type = {item.icon} />}<span>{ item.name }</span></span>}
					>
						{renderMenu( item.children, key + item.key )}
					</SubMenu>
				)
			} else{
				menus.push(
					<MenuItem key = {item.key} >
						<Link to = { key + item.key } >{ item.name }</Link>
					</MenuItem>
				)
			}
		})
		return menus;
	}

	return (
		<Menu { ...menuProps } selectedKeys = { menuSelectedKeys } >
			{ menus.length > 0 && menus.map(( item, index ) => {
				if( !!item.children && item.children.length > 0 ){
					return (
						<SubMenu
							key = { item.key }
							title = { <span>{ !!item.icon && <Icon type = {item.icon} />}<span>{ item.name }</span></span> }
						>
							{ renderMenu( item.children, item.key ) }
						</SubMenu>
					)
				} else {
					return (
						<MenuItem key = { item.key } >
							<Link to = { item.key } >
								<Icon type = { item.icon } />
								<span>{ item.name }</span>
							</Link>
						</MenuItem>
					)
				}
			})}
		</Menu>
	)
}

export default SiderMenu;
