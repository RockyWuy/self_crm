//单例模式的定义是： 保证一个类仅有一个实例, 并提供一个访问它的全局访问点
function Singleton( name ){
	this.name = name;
	this.instance = null;
}
Singleton.prototype.getName = function(){
	alert( this.name );
}
Singleton.getInstance = function( name ){
	if( !this.instance ){
		this.instance = new Singleton( name );
	}
	return this.instance;
}
//or
function Singleton( name ){
	this.name = name;
};
Singleton.getInstance = (function(){
	let instance = null;
	return function( name ){
		if( !instance ){
			instance = new Singleton( name );
		}
		return instance;
	}
})()
var a = Singleton.getInstance( 'sven1' );
var b = Singleton.getInstance( 'sven2' );

/*用代理实现单例模式*/
function CreateDiv( html ){
	this.html = html;
	this.init();
}
CreateDiv.prototype.init = function(){
	let div = document.createElement('div');
	div.innerHTML = this.html;
	document.appendChild( div );
}
//代理类
let ProxySingletonCreateDiv = (function(){
	let instance;
	return function( html ){
		if( !instance ){
			instance = new CreateDiv( html );
		}
		return instance;
	}
})();
var a = new ProxySingletonCreateDiv( 'sven1' );
var b = new ProxySingletonCreateDiv( 'sven2' );
alert ( a === b );

/*通用的惰性单例*/
function getSingleton(fn){
	let result;
	return function(){
		return result || ( result = fn.apply( this, arguments ) );
	}
}
function createLoginLayer(){
	let div = document.createElement('div');
	div.innerHTML = '我是登录浮窗';
	div.style.display = 'none';
	document.body.appendChild( div );
	return div;
}
function createSignleFrame(){
	let iframe = document.createElement('iframe');
	document.body.appendChild( iframe );
	return iframe;
}
