/*
* @author Rocky wu
* Date by 2018/11/13
* 封装方法
*/
window._SYNC_FUNC = {};

//判定对象类型
window._SYNC_FUNC.ObjectType = function( type ){
	return function( object ){
		return Object.prototype.toString.call( object ) === '[object ' + type + ']';
	}
}

//计算列的最小宽度
window._SYNC_FUNC.calcWidth = function( array ){
	let width = 0;
	for( let i = 0; i < array.length; i++ ){
		if( !!array[i].width ){
			width += array[i].width;
		}
	}
	return width;
}
