/*
* @author yhwu
* Date at 2018/10/24
* 奖品配置 路由
*/
import React from 'react';
import AwardSetPage from './components/AwardSetPage';
import AwardEdit from './components/AwardEdit';

export default function AwardSet(){
	return (
		<React.Fragment>
			<AwardSetPage />
			<AwardEdit />
		</React.Fragment>
	)
}
