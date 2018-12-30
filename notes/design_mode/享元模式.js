//享元（flyweight）模式是一种用于性能优化的模式, “fly”在这里是苍蝇的意思, 意为蝇量级。
//享元模式的核心是运用共享技术来有效支持大量细粒度的对象。

//使用享元模式的关键是如何区别内部状态和外部状态。
//可以被对象共享的属性通常被划分为内部状态, 如同不管什么样式的衣服, 都可以按照性别不同, 穿在同一个男模特或者女模特身上, 模特的性别就可以作为内部状态储存在共享对象的内部。
//而外部状态取决于具体的场景, 并根据场景而变化, 就像例子中每件衣服都是不同的, 它们不能被一些对象共享, 因此只能被划分为外部状态

//对象池的实现
//对象池维护一个装载空闲对象的池子, 如果需要对象的时候, 不是直接new, 而是转从对象池里获取。
//如果对象池里没有空闲对象, 则创建一个新的对象, 当获取出的对象完成它的职责之后, 再进入池子等待被下次获取
/*先定义一个获取小气泡节点的工厂, 作为对象池的数组成为私有属性被包含在工厂闭包里, 这个工厂有两个暴露对外的方法,
create 表示获取一个div 节点, recover 表示回收一个div 节点*/
function toolTipFactory(function(){
	let toolTipPool = [];       //toolTipPool 对象池
	return : {
		create : function(){
			if( toolTipPool.length === 0 ){    //如果对象池为空
				let div = document.createElement('div');   //创建一个dom
				document.body.appendChild(div);
				return div;
			} else{     //如果对象池不为空
				return toolTipPool.shift();    //则从对象池取出一个dom
			}
		},
		recover : function( toolTipDom ){
			return toolTipPool.push( toolTipDom );   //对象池回收dom
		}
	}
})();
//先创建两个dom
let ary = [];
for( let i = 0, str; str = ['A','B'][i++] ){
	let toolTip = toolTipFactory.create();
	toolTip.innerHTML = str;
	ary.push( toolTip );
}
//重新处理
for( let i = 0, toolTip; toolTip = ary[i++] ){
	toolTipFactory.recover( toolTip );
}
let ary = [];
for( let i = 0, str; str = ['A','B','C','D','E','F'][i++] ){
	let toolTip = toolTipFactory.create();
	toolTip.innerHTML = str;
	ary.push( toolTip );
}

function objectPoolFactory( createObjFn ){
	let objectPool = [];
	return {
		create : function(){
			let obj = objectPool.length === 0 ?
				createObjFn.apply( this, arguments ) : objectPool.shift();
			return obj;
		},
		recover : function( obj ){
			objectPool.push( obj );
		}
	}
}
let iframeFactory = objectPoolFactory(function(){
	let iframe = document.createElement('iframe');
	document.body.appendChild(iframe);
	iframe.onload = function(){
		iframe.onload = null;             // 防止iframe 重复加载的bug
		iframeFactory.recover( iframe );  // iframe 加载完成之后回收节点
	}
	return iframe;
})
