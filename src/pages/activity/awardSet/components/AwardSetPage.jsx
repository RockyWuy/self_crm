/*
 * @author yhwu
 * Date at 2018/10/26
 * 页面组件
 */
import React from 'react';
import { connect } from 'dva';
import { Popover } from 'antd';
//import styles from './AwardSetPage.less';
import { ImagePreview } from '../../../../components/Common/Components';
import CommonSearch from '../../../../components/CommonSearch/CommonSearch';
import CommonTable from '../../../../components/CommonTable/CommonTable';
import CommonPagination from '../../../../components/CommonPagination/CommonPagination';

function AwardSetPage({ dispatch, awardSetPage }) {
  let {
    namespace,

    awardTypeSels, //奖品类型 下拉

    num, //分页页码
    row, //分页大小
    total, //数据总数
    loading, //是否加载中
    dataSource, //所有数据
  } = awardSetPage;

  //普通搜索 重置
  function OnCommonSearch(values) {
    dispatch({ type: `${namespace}/GetAwardList`, payload: { num: 1, row, values } });
  }

  //分页改变
  function NumChange(num, row) {
    dispatch({ type: `${namespace}/GetAwardList`, payload: { num, row } });
  }

  //刷新列表数据
  function RefreshList() {
    dispatch({ type: `${namespace}/GetAwardList` });
  }

  //点击编辑奖品
  function ClickToEdit(item) {
    dispatch({ type: `awardEdit/OpenAwardEditModal`, payload: { item, RefreshList } });
  }

  let searchProps = {
    OnSearch: OnCommonSearch,
    OnReset: OnCommonSearch,
    fields: [{ type: 'input', key: 'name', placeholder: '请输入奖品名称' }],
  };

  let tableProps = {
    dataSource,
    loading,
    columns: [
      {
        title: '奖品编号',
        dataIndex: 'id',
        key: 'id',
        width: 96,
      },
      {
        title: '奖品名称',
        dataIndex: 'name',
        key: 'name',
        width: 96,
        render: (text, item) => <Popover content={text || '--'}>{text || '--'}</Popover>,
      },
      {
        title: '奖品类型',
        dataIndex: 'type',
        key: 'type',
        width: 96,
        render: (text, item) => {
          let render_item = window._COM_FUNC.loopArrGetValue(awardTypeSels, text, 'key', 'label');
          return <Popover content={render_item}>{render_item}</Popover>;
        },
      },
      {
        title: '奖品数量',
        dataIndex: 'prizeCnt',
        key: 'prizeCnt',
        width: 96,
      },
      {
        title: '当前库存',
        dataIndex: 'remainCnt',
        key: 'remainCnt',
        width: 96,
      },
      {
        title: '奖品图片',
        dataIndex: 'photo',
        key: 'photo',
        width: 96,
        render: (text, item) => <ImagePreview url={text} />,
      },
      {
        title: '配置概率%',
        dataIndex: 'configureProbability',
        key: 'configureProbability',
        width: 112,
      },
      {
        title: '当前概率%',
        dataIndex: 'actualProbability',
        key: 'actualProbability',
        width: 112,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 96,
        render: (text, item) => <a onClick={() => ClickToEdit(item)}>编辑</a>,
      },
    ],
  };

  let paginationProps = {
    num,
    row,
    total,
    showTotal: `共${total}个奖品`,
    NumChange,
    RowChange: NumChange,
  };

  return (
    <div style={{ height: '100%' }}>
      <CommonSearch {...searchProps} />
      <CommonTable {...tableProps} />
      <CommonPagination {...paginationProps} />
    </div>
  );
}

function mapStateToProps({ awardSetPage }) {
  return { awardSetPage };
}

export default connect(mapStateToProps)(AwardSetPage);
