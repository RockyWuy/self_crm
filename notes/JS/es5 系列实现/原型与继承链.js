// 一、普通对象和函数对象

// 二、构造函数
function Person(name, age) {
  this.name = name;
  this.age = age;
}
let person = new Person('kobe', 40);
console.log(person.constructor === Person); //true
// 实例的构造函数属性(constructor)指向构造函数

// 三、原型对象
// 其中每个函数对象都有一个 prototype 属性, 这个属性指向函数的 原型对象(obj.prototype)
// 每个对象都有 __proto__ 属性, 但只有函数对象才有 prototype 属性
// console.log( Person.prototype.constructor === Person );  //true
// 原型对象(Person.prototype)是 构造函数(Person)的一个实例.

// 四、__proto__
// JS 在创建对象(不论是普通对象还是函数对象)的时候, 都有一个叫做__proto__ 的内置属性, 用于指向创建它的构造函数的原型对象
// console( person.__proto__ === Person.prototype );        //true

// 五、构造器
// Object, Array, Function, Date, Number, String, Boolean

// 六、原型链
// 	1 person.__proto__ 是什么?
// 		因为 person.__proto__ === person的构造函数.prototype
// 		因为 person的构造函数 === Person
// 		所以 person.__proto__ === Person.prototype

// 	2 Person.__proto__ 是什么?
// 		因为 Person.__proto__ === Person的构造函数.prototype
// 		因为 Person的构造函数 === Function
// 		所以 Person.__proto__ === Function.prototype

// 	3 Person.prototype.__proto__ 是什么?
// 		Person.prototype 是一个普通对象, 我们无需关注它有哪些属性, 只要记住它是一个普通对象
// 		因为一个 普通对象的构造函数 === Object
// 		所以 Person.prototype.__proto__ === Object.prototype

// 	4 Object.__proto__ 是什么?
// 		参照第二题, 因为 Person 和 Object 一样都是构造函数

// 	5 Object.prototype__proto__ 是什么?
// 		Object.prototype 对象也有proto属性, 但它比较特殊, 为 null; 因为 null 处于原型链的顶端, 这个只能记住
// 		Object.prototype.__proto__ === null

// 七、函数对象
// 	所有函数对象的__proto__都指向Function.prototype, 它是一个空函数(Empty function)

// 	Function.prototype.__proto__ === Object.prototype //true
// 	Function.prototype是个函数对象, 理论上他的__proto__应该指向 Function.prototype, 就是他自己, 自己指向自己, 没有意义。
// 	JS一直强调万物皆对象, 函数对象也是对象, 给他认个祖宗, 指向Object.prototype; Object.prototype.__proto__ === null, 保证原型链能够正常结束
