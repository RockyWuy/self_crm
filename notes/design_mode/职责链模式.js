/*职责链模式的定义是：使多个对象都有机会处理请求，从而避免请求的发送者和接收者之间
的耦合关系，将这些对象连成一条链，并沿着这条链传递该请求，直到有一个对象处理它为止。*/

//orderType：表示订单类型(定金用户或者普通购买用户), code 的值为1的时候是500元定金用户, 为2的时候是200元定金用户, 为3的时候是普通购买用户。
//pay：表示用户是否已经支付定金, 值为true或者false, 虽然用户已经下过500元定金的订单, 但如果他一直没有支付定金, 现在只能降级进入普通购买模式。
//stock：表示当前用于普通购买的手机库存数量, 已经支付过500 元或者200 元定金的用户不受此限制
function order(orderType, pay, stock){
	if( orderType === 1 ){     //500元定金购买模式
		if( pay === true ){    //已支付定金
			console.log( '500元定金预购, 得到100元优惠劵' );
		} else{  //未支付定金, 降级为普通购买模式
			if( stock > 0 ){   //用于普通购买的手机还有库存
				console.log('普通购买, 无优惠劵')
			} else{
				console.log('手机库存不足')
			}
		}
	} else if( orderType === 2 ){
		if( pay === true ){
			console.log('200元定金预购, 得到50元优惠劵');
		} else{
			if( stock > 0 ){
				console.log('普通购买, 无优惠劵')
			} else{
				console.log('手机库存不足');
			}
		}
	} else if( orderType === 3 ){
		if( stock > 0 ){
			console.log('普通购买, 无优惠劵')
		} else{
			console.log('手机库存不足')
		}
	}
}
/*职责链模式重构*/
function order500( orderType, pay, stock ){
	if( orderType === 1 && pay === true ){
		console.log('500元定金预购, 得到100优惠劵');
	} else{
		order200( orderType, pay, stock )
	}
}

function order200( orderType, pay, stock ){
	if( orderType === 2 && pay === true ){
		console.log('200元定金预购, 得到50优惠劵')
	} else{
		orderNormal( orderType, pay, stock );
	}
}

function orderNormal( orderType, pay, stock ){
	if( stock > 0 ){
		console.log('普通购买, 无优惠劵');
	} else{
		console.log('手机库存不足');
	}
}

//灵活可拆分的职责链节点
function order500( orderType, pay, stock ){
	if( orderType === 1 && pay === true ){
		console.log('500元定金预购');
	} else{
		return 'next';         //不知道下一个节点是谁, 反正请求向后传
	}
}
function order200( orderType, pay, stock ){
	if ( orderType === 2 && pay === true ){
		console.log( '200 元定金预购' );
	}else{
		return 'next';        //不知道下一个节点是谁, 反正请求向后传
	}
};
function orderNormal( orderType, pay, stock ){
	if ( stock > 0 ){
		console.log( '普通购买，无优惠券' );
	}else{
		console.log( '手机库存不足' );
	}
};

function Chain( fn ){
	this.fn = fn;
	this.nextFunc = null;
}
Chain.prototype.setNext = function( nextFunc ){
	return this.nextFunc = nextFunc;
}
Chain.prototype.passRequest = function(){
	let ret = this.fn.apply( this, arguments );
	if( ret === 'next' ){
		return this.nextFunc && this.nextFunc.passRequest.apply( this.nextFunc, arguments );
	}
	return ret;
}

let chainOrder500 = new Chain( order500 );
let chainOrder200 = new Chain( order200 );
let chainOrderNormal = new Chain( orderNormal );

chainOrder500.setNext( chainOrder200 );
chainOrder200.setNext( chainOrderNormal );
chainOrder500.passRequest( 1, true, 500 );
/*异步情况*/
Chain.prototype.next = function(){
	return this.nextFunc && this.nextFunc.passRequest.apply( this.nextFunc, arguments );
}


Function.prototype.after = function( fn ){
	let self = this;
	return function(){
		let ret = self.apply( this, arguments );
		if( ret === 'next' ){
			return fn.apply( this, arguments );
		}
		return ret;
	}
}
