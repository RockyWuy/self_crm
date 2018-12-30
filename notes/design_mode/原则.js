//单一职责原则
//开放-封闭原则
function arrayMap( arg, callback ){
	let i = 0,
		length = arg.length,
		value,
		ret = [];
	for( ; i < length; i++ ){
		value = callback( i, arg[i] );
		ret.push( value );
	}
	return ret;
}
