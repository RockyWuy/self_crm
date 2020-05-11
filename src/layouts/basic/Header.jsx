/*
 * @author Rocky wu
 * Date by 2018/11/13
 * 右侧头部布局
 */

import React from 'react';
import styles from './Header.less';
import { Icon, Menu, Switch } from 'antd';

const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;
const MenuItemGroup = Menu.ItemGroup;

function Header() {
  return (
    <div className={styles.header_wrap}>
      <span className={styles.btn_sider_fold}>
        <Icon type="menu-unfold" />
      </span>
      <Menu mode="horizontal" className={styles.content_right_menu}>
        <SubMenu
          title={
            <span>
              <Icon type="setting" />
              设置
            </span>
          }
        >
          <MenuItemGroup title="主题设置">
            <MenuItem key="theme">
              <Switch
                size="small"
                checked={false}
                //onChange = { SwitchTheme }
                checkedChildren="暗"
                unCheckedChildren="亮"
              />
            </MenuItem>
          </MenuItemGroup>
        </SubMenu>
        <SubMenu
          title={
            <span>
              <Icon type="user" />
              伍雨豪
            </span>
          }
        >
          <MenuItem key="logout">
            <div>退出登录</div>
          </MenuItem>
        </SubMenu>
      </Menu>
    </div>
  );
}

export default Header;
