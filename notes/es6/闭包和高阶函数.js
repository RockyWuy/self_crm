/*闭包实例*/
//1
var mult = (function(){
	var cache = {};
	return function(){
		var args = Array.prototype.join.call( arguments, ',');
		if( cache[args] ){
			return cache[args];
		}
		var a = 1;
		for( let i = 0, length = arguments.length; i < length; i++ ){
			a = a * arguments[i];
		}
		return cache[args] = a;
	}
})();
mult(1,2,3);

//闭包与内存管理
/*局部变量本来应该在函数退出的时候被解除引用, 但如果局部变量被封闭在闭包形成的环境中, 那么这个局部变量就能一直生存下去。
从这个意义上看, 闭包的确会使一些数据无法被及时销毁。
使用闭包的一部分原因是我们选择主动把一些变量封闭在闭包中, 因为可能在以后还需要使用这些变量, 把这些变量放在闭包中和放在全局作用域, 对内存方面
的影响是一致的, 这里并不能说成是内存泄露。如果在将来需要回收这些变量, 我们可以手动把这些变量设为null。*/
//跟闭包和内存泄露有关系的地方是, 使用闭包的同时比较容易形成循环引用

/*高阶函数*/
//高阶函数是指至少满足下列条件之一的函数。
//一、函数可以作为参数被传递;
//二、函数可以作为返回值输出;

/*函数作为参数传递*/
//1、回调函数
//回调函数的应用不仅只在异步请求中, 当一个函数不适合执行一些请求时, 我们也可以把这
//些请求封装成一个函数, 并把它作为参数传递给另外一个函数, “委托”给另外一个函数来执行
var getUserInfo = function( userId, callback ){
	$.ajax('http://xxxx.com/getUserInfo?' + userId, function( data ){
		if( typeof callback === 'function' ){
			callback( data )
		}
	})
}
//2、Array.prototype.sort
//Array.prototype.sort 接受一个函数当作参数, 这个函数里面封装了数组元素的排序规则。
//从Array.prototype.sort 的使用可以看到, 我们的目的是对数组进行排序, 这是不变的部分;而使用什么规则去排序, 则是可变的部分。
//把可变的部分封装在函数参数里, 动态传入Array.prototype.sort, 使Array.prototype.sort 方法成为了一个非常灵活的方法
[1, 4, 2].sort(function( a, b ){
	return a - b;
});   //输出[1,2,4] 从小到大排序
[1, 4, 2].sort(function( a, b ){
	return b - a;
});   //输出[4,2,1] 从大到小排序

/*函数作为返回值输出*/
//1、判断数据的类型
function isType( type ){
	return function( obj ){
		return Object.prototype.toString.call( obj ) === '[object ' + type + ']';
	}
}
var isString = isType( 'String' );
var isArray = isType( 'Array' );
var isNumber = isType( 'Number' );
console.log( isArray( [ 1, 2, 3 ] ) ); // 输出：true
//改进
function isType( param, type ){
	return Object.prototype.toString.call( param ) === '[object ' + type + ']';
}
//2、getSingle 单例模式
function getSingle( fn ){
	var ret;
	return function(){
		return ret || (ret = fn.apply( this, arguments ));
	}
}
var getDiv = getSingle(function(){
	return document.createElement('div');
})
var div1 = getDiv();
var div2 = getDiv();
console.log( div1 === div2 );  //输出 true

/*高阶函数实现AOP*/
//AOP（面向切面编程）的主要作用是把一些跟核心业务逻辑模块无关的功能抽离出来, 这些
//跟业务逻辑无关的功能通常包括日志统计、安全控制、异常处理等。把这些功能抽离出来之后再通过“动态织入”的方式掺入业务逻辑模块中。
//这样做的好处首先是可以保持业务逻辑模块的纯净和高内聚性
Function.prototype.before = function( beforefn ){
	var _self = this;       // 保存原函数的引用
	return function(){      // 返回包含了原函数和新函数的"代理"函数
		console.log( _self, this );             //_self 指向函数, this指向window
		beforefn.apply( this, arguments );      // 执行新函数, 修正this
		return _self.apply( this, arguments );  // 执行原函数
	}
}

Function.prototype.after = function( afterfn ){
	var _self = this;
	return function(){
		var ret = _self.apply( this, arguments );
		afterfn.apply( this, arguments );
		return ret;
	}
}
function func(){
	console.log( 2 );
}
funcTest = func.before(function(){
	console.log( 1 );
}).after(function(){
	console.log( 3 )
})
funcTest();  // 1 2 3

/*函数currying化*/
function currying( fn ){
	let args = [];
	return function(){
		if( arguments.length === 0 ){
			return fn.apply( this, args );
		} else{
			[].push.apply( args, arguments );
			return arguments.callee;
		}
	}
}
let cost = (function(){
	let money = 0;
	return function(){
		for( let i = 0, l = arguments.length; i < l; i++ ){
			money += arguments[i]
		}
		return money;
	}
})();
let costTest = currying( cost );
costTest( 100 );
costTest( 200 );
costTest();

/*函数节流*/
//JavaScript 中的函数大多数情况下都是由用户主动调用触发的, 除非是函数本身的实现不合
//理, 否则我们一般不会遇到跟性能相关的问题。但在一些少数情况下, 函数的触发不是由用户直
//接控制的。在这些场景下,函数有可能被非常频繁地调用,而造成大的性能问题
//1、window.onresize事件  我们给window 对象绑定了resize 事件, 当浏览器窗口大小被拖动而改变的时候, 这个事件触发的频率非常之高
//2、mousemove事件  同样, 如果我们给一个div节点绑定了拖曳事件(主要是mousemove),当div 节点被拖动的时候, 也会频繁地触发该拖曳事件函数
/*关于函数节流的代码实现有许多种, 下面的throttle 函数的原理是, 节流函数允许一个函数在规定的时间内只执行一次
throttle 函数接受2个参数, 第一个参数为需要被延迟执行的函数, 第二个参数为延迟执行的时间*/
function throttle( fn, interval ){
	let timer;
	let firstTime = true;
	return function(){
		let args = arguments;
		let _self = this;
		if( firstTime ){      //第一次调用, 不需要延迟执行
			fn.apply( _self, args );
			return firstTime = false;
		}
		if( timer ){     //定时器存在, 前一次延迟执行还未完成
			return false;
		}
		timer = setTimeout(function(){  //延迟一段时间执行
			clearTimeout( timer );
			timer = null;
			fn.apply( _self, args );
		}, interval || 500 );
	}
}
window.onresize = throttle(function(){
	console.log( 1 );
}, 2000 );

/*分时函数*/
//某些函数确实是用户主动调用的, 但因为一些客观的原因, 这些函数会严重地影响页面性能
//在短时间内往页面中大量添加DOM节点显然也会让浏览器吃不消, 我们看到的结果往往就是浏览器的卡顿甚至假死
//timeChunk 函数让创建节点的工作分批进行, 比如把1 秒钟创建1000 个节点, 改为每隔200 毫秒创建8 个节点
function timeChunk( ary, fn, count ){
	let obj, timer;
	var len = ary.length;
	function start(){
		for( let i = 0; i < Math.min(count || 1, ary.length); i++ ){
			obj = ary.shift();
			fn( obj );
		}
	}
	return function(){
		timer = setInterval(function(){
			if( arg.length === 0 ){
				return clearInterval( timer );
			}
			start();
		}, 200)
	}
}
var args = [];
for ( var i = 1; i <= 1000; i++ ){
	args.push( i );
};
var renderFriendList = timeChunk( args, function( n ){
	var div = document.createElement( 'div' );
	div.innerHTML = n;
	document.body.appendChild( div );
}, 8 );
