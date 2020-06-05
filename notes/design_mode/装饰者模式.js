/*比如现在有4 种型号的自行车，我们为每种自行车都定义了一个单独的类。现在要给每种自行车都装上前灯、尾灯和铃铛这3 种配件。如果使用继承的方式来给每种自行车创建子类，则需要 4×3 = 12 个子类。
但是如果把前灯、尾灯、铃铛这些对象动态组合到自行车上面，则只需要额外增加3 个类。*/
//这种给对象动态地增加职责的方式称为装饰者（decorator）模式, 装饰者模式能够在不改变对象自身的基础上，在程序运行期间给对象动态地添加职责。跟继承相比，饰者是一种更轻便灵活的做法

var a = function() {
  alert(1);
};
var _a = a;
a = function() {
  _a();
  alert(2);
};
a();

//用AOP 装饰函数
//f2.before(f1)()
Function.prototype.before = function(beforeFn) {
  let _self = this;
  return function() {
    beforeFn.apply(this, arguments);
    return _self.apply(this, arguments);
  };
};
Function.prototype.after = function(afterFn) {
  let _self = this;
  return function() {
    let ret = _self.apply(this, arguments);
    afterFn.apply(this, arguments);
    return ret;
  };
};

let before = function(fn, beforeFn) {
  return function() {
    beforeFn.apply(this, arguments);
    return fn.apply(this, arguments);
  };
};

//用AOP动态改变函数的参数
Function.prototype.before = function(beforefn) {
  let _self = this;
  return function() {
    beforefn.apply(this, arguments); // (1)
    return _self.apply(this, arguments); // (2)
  };
};
//从这段代码的(1)处和(2)处可以看到，beforefn 和原函数_self 共用一组参数列表arguments，当我们在beforefn 的函数体内改变arguments 的时候，原函_self 接收的参数列表自然也会变化。

//代理模式通常只有一层代理 本体的引用，而装饰者模式经常会形成一条长长的装饰链。
