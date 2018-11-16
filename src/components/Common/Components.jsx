import React from 'react';
import { Popover } from 'antd';
import styles from './Components.less';

/*
 * 点击查看图片
 * @params
 * url string 图片地址
 * text string 文案
 * placement string Popover位置
 * trigger string Popover触发方法
 */
export function ImagePreview({
	url, text, placement, trigger
}){
	let content = (
		<div className = { styles.image_preview } >
			<a rel = 'noopener noreferrer' target = '_blank' href = { url } >
				<img src = { url } alt = '图片' />
			</a>
		</div>
	)

	return (
		<Popover
			style = {{ width : 200 }}
			placement = { placement || 'top' }
			content = { content }
			trigger = { trigger || 'click' }
		>
			{ !!url ?
				<a>{ text || '查看' }</a> : null
			}
		</Popover>
	)
}
