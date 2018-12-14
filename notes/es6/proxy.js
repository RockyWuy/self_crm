//es6 代理proxy

/*1、基本用法*/
let target = { a : 1, b : 2 };
let handler = {
    get( target, key ){
        let value = target[key];
        console.log(`GET ${ key } - ${ value }`);
        return value;
    }
}

let proxy = new Proxy( target, handler );
console.log( proxy.a );
console.log( proxy.c );

/*2、默认值*/
function propDefaults( defaults ){
    let handler = {
        get( target, key ){
            return Reflect.get( target, key ) || defaults[key]
        }
    }
    return new Proxy({}, handler);
}

let myObj = propDefaults({ name : 'noname' });

function log(){
    let isIn = 'name' in myObj ? 'is in' : 'is not in';
    console.log( `name = ${myObj.name} ( name ${ isIn } myobj )`)
}

log();                // name = "noname" (name is not in myObj)
myObj.name = 'Bob';
log();                // name = "Bob" (name is in myObj)
delete myObj.name;
log();                // name = "noname" (name is not in myObj)

/*3、隐藏私有属性*/
function privateProps(obj, filterFunc){
    let handler = {
        get( target, key ){
            if( !filterFunc(key) ){
                let value = Reflect.get( target, key );
                // auto-bind the methods to the original object, so they will have unrestricted access to it via 'this'
                if( typeof value === 'function' ){
                    value = value.bind( target );
                }
                return value;
            }
        },
        set(target, key, value){
            if(  filterFunc(key) ){
                throw new TypeError(`can't set property ${key}`);
            }
            return Reflect.set( target, key, value );
        },
        has( target, key ){
            return filterFunc( key ) ? false : Reflect.has(target, key)
        },
        ownKeys(target){
            return Reflect.ownKeys(target).filter(prop => !filterFunc(prop))
        },
        getOwnPropertyDescriptor(target, key) {
            return filterFunc(key) ? undefined : Reflect.getOwnPropertyDescriptor(target, key);
        }
    }
    return new Proxy( obj, handler );
}

function propFilter(key){
    return key.indexOf('_') === 0;
}
let myObj1 = {
    _private : 'secret',
    public : 'hello',
    method : function(){
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
function makeEnum( values ){
    let handler = {
        set( target, key, value ){
            throw new TypeError('Enum is read only');
        },
        get( target, key ){
            if( !(key in target ) ){
                throw new ReferenceError(`unknown enum key ${key}`);
            }
            return Reflect.get( target, key );
        },
        deleteProperty( target, key ){
            throw new TypeError('Enum is read only');
        }
    };
    return new Proxy(values, handler);
}

let someValue = 3;
// using a plain object as enum
console.log('Object');
const myObj2 = {ONE: 1, TWO: 2};
console.log(myObj2.ONE);       // 1 - ok
console.log(myObj2.TWWO);      // undefined - typos can lead to silent errors
if (myObj2.ONE = someValue) {  // this mistyped condition evaluates to true
    console.log(myObj2.ONE);   // 3 - and changes our enum too
}
delete myObj2.ONE;             // deleted


// using a freezed object can prevent by Object.freeze)
console.log('Freezed object');
const myFrObj = Object.freeze({ONE: 1, TWO: 2});
console.log(myFrObj.ONE);       // 1 - ok
console.log(myFrObj.TWWO);      // undefined - typos can lead to silent errors
if (myFrObj.ONE = someValue) {  // still evaluates to true
    console.log(myFrObj.ONE);   // 1 - but at least the modification doesn't happen
}
delete myFrObj.ONE;             // no deletion, but no error either

// using a proxy as enum
console.log('Proxy');
const MyEnum = makeEnum({ONE: 1, TWO: 2});
console.log(MyEnum.ONE);           // 1 - ok
try {
    console.log(MyEnum.TWWO);      // ReferenceError - typos catched immediately
} catch(ex) {
    console.error(ex);
}
try {
    if (MyEnum.ONE = someValue) {  // TypeError - can't be modified, doesn't evaluate, catched immediately
        console.log(MyEnum.ONE);   // (this line never executes)
    }
} catch(ex) {
    console.error(ex);
}
try {
    delete MyEnum.ONE;             // TypeError
} catch(ex) {
    console.error(ex);
}

/**/
function trackChange( obj, onChange ){
    let handler = {
        set(target, key, value){
            let oldVal = target[key];
            Reflect.set( target, key, value );
            onChange( target, key, oldVal, value );
        },
        deleteProperty( target, key ){
            let oldVal = target[key];
            Reflect.deleteProperty(target, key);
            onChange(target, key, oldVal, undefined);
        }
    }
    return new Proxy(target, handler);
}

/*使用特定属性 缓存TTL(生存时间)*/
function cacheObj(ttlFunc){
    let obj = {};
    let handler = {
        get( target, key ){
            let data = Reflect.get( target, key );
            if( data ){
                return data.value
            }
        },
        set( target, key, value ){
            let data = {
                ttl : ttlFunc(key),
                value : value
            }
            return Reflect.set( target, key, data );
        }
    }
    // decrease TTL and remove prop when it reaches zero
    function invalidate(){
        for( let key in obj ){
            obj[key].ttl -= 1;
            if( obj[key].ttl <= 0 ){
                delete obj[key]
            }
        }
    }
    window.setInterval( invalidate, 1000 );
    return new Proxy( obj, handler );
}
let cache = cacheObj((key) => 5);
function log1( sec ){
    console.log( `${sec}s : a=${cache.a}`)
}
cache.a = 123;
for( let sec = 0; sec < 6; sec += 1){
    window.setTimeout(() => log1(sec), sec * 1000);
}

/*Using the "in" operator like "includes"*/
let arr = [1,2];
1 in arr  //true
4 in arr  //false
arr.includes(1)   //true
arr.includes(3)   //false
arr.indexOf(1)    //0
arr.indexOf(2)    //1
arr.indexOf(3)    //-1

/*利用proxy实现单例模式*/
function makeSingleton(func){
    let instance;
    let handler = {
        constructor : function(target, args){
            if( !instance ){
                instance = new func();
            }
            return instance;
        }
    }
    return new Proxy( func, handler );
}
// we will try it out on this constructor
function Test() {
    this.value = 0;
}
// normal construction
let t1 = new Test(),
    t2 = new Test();
t1.value = 123;
console.log('Normal:', t2.value);  // 0 - because t1 and t2 are separate instances

// using Proxy to trap construction, forcing singleton behaviour
let TestSingleton = makeSingleton(Test),
    s1 = new TestSingleton(),
    s2 = new TestSingleton();
s1.value = 123;
console.log('Singleton:', s2.value);  // 123 - bcause s1 and s2 is the same instance

/*类似Python的数组切片*/
function pythonIndex(array){
    function parse(value, defaultValue, resolveNegative){
        if( value === undefined || isNaN(value)){
            value = defaultValue;
        } else if( resolveNegative && value < 0 ){
            value += array.length;
        }
        return value;
    }

    function slice( key ){
        if(typeof key === 'string' && key.match(/^[+-\d:]+$/)){
            // no ':', return a single item
            if(key.indexOf(':') === -1){
                let index = parse(parseInt(key), 0, true);
                console.log(key, '\t\t', array[index]);
                return array[index];
            }
            // otherwise: parse the slice string
            let [start, end, step] = key.split(':').map(part => parseInt(part));
            step = parse(step, 1, false);
            if( step === 0 ){
                throw new RangeError(`step can't be zero`);
            }
            if( step > 0 ){
                start = parse(start, 0, true);
                end = parse(end, array.length, true);
            } else{
                start = parse(start, array.length-1, true);
                end = parse(end, -1, true)
            }
            let result = [];
            for( let i = start; start <= end ? i < end : i > end; i+= step ){
                result.push(array[i]);
            }
            console.log( key, '\t', JSON.stringify(result) );
            console.log('lll', result );
            return result;
        }
    }

    let handler = {
        get( arr, key ){
            return slice( key ) || Reflect.get( arr, key );
        }
    }
    return new Proxy(array, handler);
}
// try it out
let values = [0,1,2,3,4,5,6,7,8,9],
    pyValues = pythonIndex(values);

console.log(JSON.stringify(values));

pyValues['-1'];      // 9
pyValues['0:3'];     // [0,1,2]
pyValues['8:5:-1'];  // [8,7,6]
pyValues['-8::-1'];  // [2,1,0]
pyValues['::-1'];    // [9,8,7,6,5,4,3,2,1,0]
pyValues['4::2'];    // [4,6,8]

// and normal indexing still works
pyValues[3];         // 3




/*Schema 校验*/
//person 是一个普通对象，包含一个 age 属性，当我们给它赋值的时候确保是大于零的数值，否则赋值失败并抛出异常
let validator = {
    set(target, key, value){
        if( key === 'age' ){
            if(typeof value !== 'number' || Number.isNaN(value)){
                throw new TypeError('Age must be a number');
            }
            if( value <= 0 ){
                throw new RangeError('Age must be a positive number');
            }
        }
    }
}
var proxy2 = new Proxy({}, validator)
proxy2.age = 'foo'
// <- TypeError: Age must be a number
proxy2.age = NaN
// <- TypeError: Age must be a number
proxy2.age = 0
// <- TypeError: Age must be a positive number
proxy2.age = 28

/*自动填充对象*/
let handler1 = {
    get : function(target, key, receiver){
        if(!(key in target)){
            target[key] = Tree();
        }
        return Reflect.get( target, key, receiver );
    }
}
function Tree(){
    return new Proxy({}, handler1);
}
let tree = Tree();

//handler.getPrototypeOf()：在读取代理对象的原型时触发该操作，比如在执行Object.getPrototypeOf(proxy)时
//handler.setPrototypeOf()：在设置代理对象的原型时触发该操作，比如在执行Object.setprototypeOf(proxy, null)时
//handler.isExtensible()：在判断一个代理对象是否是可扩展时触发该操作，比如在执行Object.isExtensible(proxy)时
//handler.preventExtensions()：在让一个代理对象不可扩展时触发该操作，比如在执行Object.preventExtensions(proxy)时
//handler.getOwnPropertyDescriptor()：在获取代理对象某个属性的属性描述时触发该操作，比如在执行Object.getOwnPropertyDescriptor(proxy, 'foo')时
//handler.defineProperty()：在定义代理对象某个属性时的属性描述时触发该操作，比如在执行Object.defineProperty(proxy,'foo',{})时
//handler.has()：在判断代理对象是否拥有某个属性时触发该操作，比如在执行'foo' in proxy时
//handler.get()：在读取代理对象的某个属性时触发该操作，比如在执行proxy.foo时
//handler.set()：在给代理对象的某个赋值时触发该操作，比如在执行proxy.foo = 1时
//handler.deleteProperty()：在删除代理对象的某个属性时触发该操作，比如在执行delete proxy.foo时
//handler.ownKeys()：在获取代理对象的所有属性键时触发该操作，比如在执行Object.getOwnPropertyNames(proxy)时
//handler.apply()：在调用一个目标对象为函数的代理对象时触发该操作，比如在执行proxy()时
//handler.construct()：在给一个目标对象为构造函数的代理对象构造实例时触发该操作，比如在执行new proxy()时

/*以没有经过任何优化的计算斐波那契数列的函数来假设为开销很大的方法，这种递归调用在计算 40 以上的斐波那契项时就能明显的感到延迟感。
希望通过缓存来改善。*/
const getFib = (number) => {
    if (number <= 2) {
        return 1;
    } else {
        return getFib(number - 1) + getFib(number - 2);
    }
}
const getCacheProxy = (fn, cache = new Map()) => {
    return new Proxy(fn,{
        apply(target, context, args){
            console.log( target, context, args );
            let argsString = args.join(' ');
            if( cache.has(argsString) ){
                //如果有缓存, 直接返回缓存数据
                console.log(`输出${args}的缓存结果:${cache.get(argsString)}`);
                return cache.get( argsString );
            }
            let result = Reflect.apply(target, undefined, args);
            cache.set( argsString, result );
            return result;
        }
    })
}
const getFibProxy = getCacheProxy(getFib);
getFibProxy(40); // 102334155
getFibProxy(40); // 输出40的缓存结果: 102334155
