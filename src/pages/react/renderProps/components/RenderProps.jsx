/*
 * @author yhwu
 * Date at 2018/11/21
 * 页面组件
 */
import React from 'react';
import { connect } from 'dva';
import { Popover } from 'antd';
import styles from './RenderProps.less';

class RenderProps extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <div>sss</div>;
  }
}

function mapStateToProps({ awardSetPage }) {
  return { awardSetPage };
}

export default connect(mapStateToProps)(RenderProps);
