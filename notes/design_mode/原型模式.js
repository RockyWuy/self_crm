/*
* 从设计模式的角度讲, 原型模式是用于创建对象的一种模式, 如果我们想要创建一个对象, 一种方法是先指定它的类型, 然后通过类来创建这个对象。
* 原型模式选择了另外一种方式, 我们不再关心对象的具体类型, 而是找到一个对象, 然后通过克隆来创建一个一模一样的对象。
*/

//原型模式的实现关键, 是语言本身是否提供了clone 方法; ECMAScript 5 提供了Object.create方法, 可以用来克隆对象
//Object.create()方法创建一个新对象, 使用现有的对象来提供新创建的对象的__proto__ (请查看浏览器控制台以获取视觉证据)
//Object.create(proto, [propertiesObject])
//proto -- 新创建对象的原型对象。
//propertiesObject  -- 可选; 如果没有指定为 undefined, 则是要添加到新创建对象的可枚举属性(即其自身定义的属性，而不是其原型链上的枚举属性)对象的属性描述符以及相应的属性名称; 这些属性对应Object.defineProperties()的第二个参数。

//创建的对象并不是完全一致, 创建出来的对象是上一个对象为原型对象;
var Plane = function(){
	this.blood = 100;
	this.attackLevel = 1;
	this.defenseLevel = 1;
}
var plane = new Plane();
var clonePlane = Object.create( plane );
console.log( clonePlane );

//new Object() 运算的过程
//新建一个对象, 将新对象的__proto__指向 构造器的原型对象, 改变this指向到新对象上
function Person( name ){
	this.name = name;
}
Person.prototype.getName = function(){
	return this.name;
}
var ObjectFactory = function(){
	var obj = new Object();                       //从Object.prototype上克隆一个空的对象
	var Constructor = [].shift.call(arguments);   //取得外部传入的构造器, 此例是Person
	obj.__proto__ = Constructor.prototype;        //指向正确的原型
	var ret = Constructor.apply( obj, arguments );
	return typeof ret === 'object' ? ret : obj;   //确保构造器总是会返回一个对象
}
var a = ObjectFactory( Person, 'seven' );
var cloneA = new Person('seven');
//new Object() 运算的过程
