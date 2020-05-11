/*
 * @author yhwu
 * Date at 2018/10/26
 * 表格组件
 */
import React from 'react';
import { Pagination, LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import styles from './CommonPagination.less';

class CommonPagination extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let {
      num, //分页页码 number
      row, //分页大小 number
      total, //数据总数
      showTotal, //共多少数据

      //方法
      NumChange, //页码改变的回调
      RowChange, //页面大小改变的回调
    } = this.props;

    return (
      <LocaleProvider locale={zhCN}>
        <div className={styles.common_pagination}>
          <Pagination
            size="small"
            current={num || 1}
            pageSize={row || 10}
            total={total || 10}
            pageSizeOptions={['10', '20', '30', '40']}
            onChange={NumChange}
            onShowSizeChange={RowChange}
            showSizeChanger
          />
          <div className={styles.show_total}>{showTotal}</div>
        </div>
      </LocaleProvider>
    );
  }
}

export default CommonPagination;
