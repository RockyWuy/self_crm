/*
* @author yhwu
* Date at 2018/10/26
* 表格组件
*/
import React from 'react';
import { Table } from 'antd';
//import './CommonTable.less';
import styles from './CommonTable.less';

class CommonTable extends React.Component {
	constructor( props ) {
		super( props );
		this.state = {

		}
	}

	render() {
		let {
			rowKey,
			loading,
			columns,
			dataSource,
			rowSelection,
			explainText,

            yScroll,
		} = this.props;

		let explainHeight = !!explainText ? '32px' : '0px';
		let defaultYScroll = `calc(100vh - 50px - 38px - 68px - 50px - 70px - 10px - ${explainHeight} )`;

		return (
			<div className = 'common_table' >
				{ !!explainText &&
					<div className = { styles.explain_text } >{ explainText }</div>
				}
				<Table
					rowKey = { rowKey || 'id' }
					bordered
					loading = { loading || false }
					pagination = { false }
					columns = { columns || [] }
					dataSource = { loading ? [] : dataSource || [] }
					scroll = {{ x : window._SYNC_FUNC.calcWidth( columns ), y : yScroll || defaultYScroll }}
					rowSelection = { rowSelection || undefined }
				/>
			</div>
		)
	}
};

export default CommonTable;
