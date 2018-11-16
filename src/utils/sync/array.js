/*
* @author Rocky wu
* Date by 2018/11/13
* 数组操作 封装方法
*/

//平级数组转为树状结构
export function TransArrsToTree( arrs, pId = '0' ){
	if( !window._SYNC_FUNC.ObjectType('Array')(arrs) ){
		throw new Error('required Arrray');
	}
	let result = [];
	for( let i = 0, length = arrs.length; i < length; i++ ){
		if( arrs[i].pId === pId ){
			let item = Object.assign({}, arrs[i]);
			let children = TransArrsToTree( arrs, item.id );
			if( children.length > 0 ){
				item.children = children;
			}
			result.push( item )
		}
	}
	return result;
}
