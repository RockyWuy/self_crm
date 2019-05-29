let obj = {}
obj.a.b.c.d = 1;
Reflect

// Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。Proxy 这个词的原意是代理，用在这里表示由它来“代理”某些操作，可以译为“代理器”

// ES6原生提供 Proxy 构造函数，用来生成 Proxy 实例
let proxy = new Proxy(target, handler);
// Proxy 对象的所有用法，都是上面这种形式，不同的只是handler参数的写法。其中，new Proxy()表示生成一个Proxy实例，target参数表示所要拦截的目标对象，handler参数也是一个对象，用来定制拦截行为

let proxy = new Proxy({}, {
    get(target, key) {
    },
    set(target, key, value) {
    }
})

// handler是空对象，访问proxy等同于直接访问target对象

/* Proxy 支持的拦截操作一览，一共 13 种 */
// 拦截对象属性的读取，比如proxy.foo和proxy['foo']
get(target, propKey, receiver)
// 拦截对象属性的设置，比如proxy.foo = v或proxy['foo'] = v，返回一个布尔值
set(target, propKey, value, receiver)
// 拦截propKey in proxy的操作，返回一个布尔值
has(target, propKey)
// 拦截delete proxy[propKey]的操作，返回一个布尔值
Reflect.deleteProperty(obj, 's')
deleteProperty(target, propKey)
// 拦截Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for...in循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而Object.keys()的返回结果仅包括目标对象自身的可遍历属性
ownKeys(target)
// 拦截Object.getOwnPropertyDescriptor(proxy, propKey)，返回属性的描述对象
getOwnPropertyDescriptor(target, propKey)
// 拦截Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)，返回一个布尔值
defineProperty(target, propKey, propDesc)
// 拦截Object.preventExtensions(proxy)，返回一个布尔值
preventExtensions(target)
// 拦截Object.getPrototypeOf(proxy)，返回一个对象
getPrototypeOf(target)
// 拦截Object.isExtensible(proxy)，返回一个布尔值
isExtensible(target)
// 拦截Object.setPrototypeOf(proxy, proto)，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截
setPrototypeOf(target, proto)
// 拦截 Proxy 实例作为函数调用的操作，比如proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)
apply(target, object, args)
// 拦截 Proxy 实例作为构造函数调用的操作，比如new proxy(...args)
construct(target, args)

/* get 实现数组读取负数的索引 */
function createArray(...elements) {
    let handler = {
        get(target, propKey, receiever) {
            console.log(target, propKey, receiever)
            let index = Number(propKey)
            if(index < 0) {
                propKey = String(target.length + index)
            }
            return Reflect.get(target, propKey, receiever)
        }
    }
    let target = []
    target.push(...elements)
    return new Proxy(target, handler)
}
let arr = createArray('a', 'b', 'c')
arr[-1]

/* set 使用proxy保证age的属性值符合要求 */
let validator = {
    set(target, propKey, value) {
        if(propKey === 'age') {
            if(!Number.isInteger(value)) {
                throw new TypeError('The age is not an integer')
            }
            if(value > 200) {
                throw new RangeError('The age seems invalid')
            }
        }
        target[propKey] = value
    }
}
//let person = new Proxy({}, validator)
//person.age = 100
//person.age = 300

/* apply实现拦截 */
var target = function() {
    return 'I am the target';
}
var handler = {
    apply(target, ctx, params) {
        if(params.length > 0) {
            return 'I am the proxy'
        }
        return Reflect.apply(...arguments)
    }
}
//var p = new Proxy(target, handler)
//p()

// has拦截只对in运算符生效，对for...in循环不生效
// hasOwnProperty可以用来检测一个对象是否含有特定的自身属性；和 in 运算符不同，该方法会忽略掉那些从原型链上继承到的属性
/* has隐藏某些属性 */
let handler = {
    has(target, key) {
        if(key[0] === '_') {
            return false
        }
        return Reflect.has(target, key)
    }
}
var target = { _prop: 'foo', prop: 'foo' }
var proxy = new Proxy(target, handler)
'_prop' in proxy // false
'prop' in proxy // true

/* deleteProperty拦截delete操作符 */
var handler = {
    deleteProperty(target, key) {
        if(key[0] === '_') {
            throw new Error(`Invalid attempt to delete private "${key}" property`)
        }
        Reflect.deleteProperty(target, key);
        return true;
    }
}
var target = { _prop: 'foo', prop: 'foo' }
var proxy = new Proxy(target, handler);
delete proxy._prop

/* getOwnPropertyDescriptor方法拦截Object.getOwnPropertyDescriptor() */
var handler = {
    getOwnPropertyDescriptor(target, key) {
        if(key[0] === '_') {
            return;
        }
        return Object.getOwnPropertyDescriptor(target, key);
    }
};
var target = { _foo: 'bar', baz: 'tar' };
var proxy = new Proxy(target, handler);
Object.getOwnPropertyDescriptor(proxy, 'wat')
// undefined
Object.getOwnPropertyDescriptor(proxy, '_foo')
// undefined
Object.getOwnPropertyDescriptor(proxy, 'baz')
// { value: 'tar', writable: true, enumerable: true, configurable: true }

/* ownKeys拦截第一个字符为下划线的属性名 */
var target = {
    _bar: 'foo',
    _prop: 'bar',
    prop: 'baz'
}
var handler = {
    ownKeys(target) {
        return Reflect.ownKeys(target).filter(key => key[0] !== '_')
    }
}
var proxy = new Proxy(target, handler)
for(let key of Object.keys(proxy)) {
    console.log(target[key])
}

/*2、默认值*/
function propDefaults(defaults){
    let handler = {
        get(target, key){
            return Reflect.get(target, key) || defaults[key]
        }
    }
    return new Proxy({}, handler);
}

let myObj = propDefaults({ name: 'noname' });

function log(){
    let isIn = 'name' in myObj ? 'is in' : 'is not in';
    console.log(`name = ${myObj.name} ( name ${ isIn } myobj )`)
}
log();                // name = "noname" (name is not in myObj)
myObj.name = 'Bob';
log();                // name = "Bob" (name is in myObj)
delete myObj.name;
log();                // name = "noname" (name is not in myObj)

/* 3、隐藏私有属性 */
function privateProps(obj, filterFunc){
    let handler = {
        get(target, key) {
            if(!filterFunc(key)){
                let value = Reflect.get(target, key);
                if( typeof value === 'function' ){
                    value = value.bind(target);
                }
                return value;
            }
        },
        set(target, key, value){
            if(filterFunc(key)){
                throw new TypeError(`can't set property ${key}`);
            }
            return Reflect.set(target, key, value);
        },
        has(target, key){
            return filterFunc(key) ? false : Reflect.has(target, key)
        },
        ownKeys(target){
            return Reflect.ownKeys(target).filter(prop => !filterFunc(prop))
        },
        getOwnPropertyDescriptor(target, key) {
            return filterFunc(key) ? undefined : Reflect.getOwnPropertyDescriptor(target, key);
        }
    }
    return new Proxy(obj, handler);
}

function propFilter(key){
    return key.indexOf('_') === 0;
}
let myObj1 = {
    _private: 'secret',
    public: 'hello',
    method: function(){
        console.log( this._private );
    }
}
let myProxy = privateProps(myObj1, propFilter);
console.log(myProxy);                               // chrome somehow logs the private prop, node doesn't
console.log(JSON.stringify(myProxy));               // {"public":"hello"}
console.log(myProxy._private);                      // undefined - not accessible from outside
myProxy.method();                                   // secret - accessible from methods
console.log('_private' in myProxy);                 // false
console.log(Object.keys(myProxy));                  // ["public", "method"]
for (let prop in myProxy) { console.log(prop); }    // public, method

/*4、枚举*/
//function makeEnum( values ){
//    let handler = {
//        set( target, key, value ){
//            throw new TypeError('Enum is read only');
//        },
//        get( target, key ){
//            if( !(key in target ) ){
//                throw new ReferenceError(`unknown enum key ${key}`);
//            }
//            return Reflect.get( target, key );
//        },
//        deleteProperty( target, key ){
//            throw new TypeError('Enum is read only');
//        }
//    };
//    return new Proxy(values, handler);
//}
//
//let someValue = 3;
//// using a plain object as enum
//console.log('Object');
//const myObj2 = {ONE: 1, TWO: 2};
//console.log(myObj2.ONE);       // 1 - ok
//console.log(myObj2.TWWO);      // undefined - typos can lead to silent errors
//if (myObj2.ONE = someValue) {  // this mistyped condition evaluates to true
//    console.log(myObj2.ONE);   // 3 - and changes our enum too
//}
//delete myObj2.ONE;             // deleted
//
//// using a freezed object can prevent by Object.freeze)
//console.log('Freezed object');
//const myFrObj = Object.freeze({ONE: 1, TWO: 2});
//console.log(myFrObj.ONE);       // 1 - ok
//console.log(myFrObj.TWWO);      // undefined - typos can lead to silent errors
//if (myFrObj.ONE = someValue) {  // still evaluates to true
//    console.log(myFrObj.ONE);   // 1 - but at least the modification doesn't happen
//}
//delete myFrObj.ONE;             // no deletion, but no error either
//
//// using a proxy as enum
//console.log('Proxy');
//const MyEnum = makeEnum({ONE: 1, TWO: 2});
//console.log(MyEnum.ONE);           // 1 - ok
//try {
//    console.log(MyEnum.TWWO);      // ReferenceError - typos catched immediately
//} catch(ex) {
//    console.error(ex);
//}
//try {
//    if (MyEnum.ONE = someValue) {  // TypeError - can't be modified, doesn't evaluate, catched immediately
//        console.log(MyEnum.ONE);   // (this line never executes)
//    }
//} catch(ex) {
//    console.error(ex);
//}
//try {
//    delete MyEnum.ONE;             // TypeError
//} catch(ex) {
//    console.error(ex);
//}

/* construct 利用proxy实现单例模式 */
function makeSingleton(fn){
    let instance;
    let handler = {
        constructor: function(target, args){
            if(!instance) {
                instance = new fn();
            }
            return instance;
        }
    }
    return new Proxy(fn, handler);
}
function Test() {
    this.value = 0;
}
// 使用代理来拦截构造方法，强制执行单例行为
let TestSingleton = makeSingleton(Test);
let s1 = new TestSingleton();
let s2 = new TestSingleton();
s1.value = 123; // 更改s1中value属性值
console.log('Singleton:', s2.value);  // Singleton: 123

/* 类似Python的数组切片 */
function pythonIndex(array){
    function parse(value, defaultValue, resolveNegative){
        if(value === undefined || isNaN(value)) {
            value = defaultValue;
        } else if(resolveNegative && value < 0) {
            value += array.length;
        }
        return value;
    }
    function slice(key) {
        if(typeof key === 'string' && key.match(/^[+-\d:]+$/)) {
            if(key.indexOf(':') === -1) { // 不存在 ':', 直接返回
                let index = parse(parseInt(key), 0, true);
                console.log(key, '\t\t', array[index]);
                return array[index];
            }
            let [start, end, step] = key.split(':').map(part => parseInt(part));
            step = parse(step, 1, false);
            if(step === 0) {
                throw new RangeError(`step can't be zero`);
            }
            if(step > 0) {
                start = parse(start, 0, true);
                end = parse(end, array.length, true);
            } else {
                start = parse(start, array.length-1, true);
                end = parse(end, -1, true)
            }
            let result = [];
            for(let i = start; start <= end ? i < end : i > end; i+= step) {
                result.push(array[i]);
            }
            return result;
        }
    }

    let handler = {
        get(arr, key) {
            return slice(key) || Reflect.get(arr, key);
        }
    }
    return new Proxy(array, handler);
}
let values = [0,1,2,3,4,5,6,7,8,9],
    pyValues = pythonIndex(values);

pyValues['-1'];      // 9
pyValues['0:3'];     // [0,1,2]
pyValues['8:5:-1'];  // [8,7,6]
pyValues['-8::-1'];  // [2,1,0]
pyValues['::-1'];    // [9,8,7,6,5,4,3,2,1,0]
pyValues['4::2'];    // [4,6,8]
pyValues[3];         // 3


/* 自动填充对象 */
let handler = {
    get: function(target, key, receiver){
        if(!(key in target)){
            target[key] = Tree();
        }
        return Reflect.get(...arguments);
    }
}
function Tree(){
    return new Proxy({}, handler);
}
let tree = Tree();
tree.a.b.c.d = 1;

/* 以没有经过任何优化的计算斐波那契数列的函数来假设为开销很大的方法，这种递归调用在计算 40 以上的斐波那契项时就能明显的感到延迟感。
希望通过缓存来改善。*/
const getFib = (number) => {
    if (number <= 2) {
        return 1;
    } else {
        return getFib(number - 1) + getFib(number - 2);
    }
}
const getCacheProxy = (fn, cache = new Map()) => {
    return new Proxy(fn, {
        apply(target, context, args){
            console.log( target, context, args );
            let argsString = args.join(' ');
            if( cache.has(argsString) ) {
                //如果有缓存, 直接返回缓存数据
                console.log(`输出${args}的缓存结果:${cache.get(argsString)}`);
                return cache.get( argsString );
            }
            let result = Reflect.apply(target, undefined, args);
            cache.set(argsString, result);
            return result;
//        }
    })
}
const getFibProxy = getCacheProxy(getFib);
getFibProxy(40); // 102334155
getFibProxy(40); // 输出40的缓存结果: 102334155
