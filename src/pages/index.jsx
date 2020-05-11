import React from 'react';
import { connect } from 'dva';
import styles from './index.less';

function IndexPage() {
  return <div className={styles.normal}>欢迎进入 AC 营销后台</div>;
}

IndexPage.propTypes = {};

export default connect()(IndexPage);
