/*策略模式的定义是：定义一系列的算法, 把它们一个个封装起来, 并且使它们可以相互替换*/
//一个基于策略模式的程序至少由两部分组成。
//第一个部分是一组策略类, 策略类封装了具体的算法, 并负责具体的计算过程。
//第二个部分是环境类Context, Context 接受客户的请求, 随后把请求委托给某一个策略类。
//*****基于传统面向对象语言的模仿*************/
function PerformanceS() {}
PerformanceS.prototype.calculate = function(salary) {
  return salary * 4;
};
function PerformanceA() {}
PerformanceA.prototype.calculate = function(salary) {
  return salary * 3;
};
function PerformanceB() {}
PerformanceB.prototype.calculate = function(salary) {
  return salary * 2;
};
/*奖金类*/
function Bonus(salary, stragety) {
  this.salary = salary;
  this.strategy = stragety;
}
//Bonus.prototype.setSalary( salary ){
//	this.salary = salary;
//}
//Bonus.prototype.setStrategy( stragety ){
//	this.stragety = stragety;
//}
Bonus.prototype.getBonus = function() {
  return this.strategy.calculate(this.salary);
};
//先创建一个bonus 对象, 并且给bonus 对象设置一些原始的数据, 比如员工的原始工资数额。
//接下来把某个计算奖金的策略对象也传入bonus 对象内部保存起来。
//当调用bonus.getBonus()来计算奖金的时候, bonus 对象本身并没有能力进行计算, 而是把请求委托给了之前保存好的策略对象
let bonus = new Bonus(10000, new performanceS());
//bonus.setSalary( 10000 );
//bonus.setStrategy( new performanceS() ); // 设置策略对象
console.log(bonus.getBonus()); // 输出：40000
bonus.setStrategy(new performanceA()); // 设置策略对象
console.log(bonus.getBonus()); // 输出：30000

/*JavaScript 版本的策略模式*/
//实际上在JavaScript 语言中, 函数也是对象, 所以更简单和直接的做法是把strategy直接定义为函数
let strageties = {
  S: function(salary) {
    return salary * 4;
  },
  A: function(salary) {
    return salary * 3;
  },
  B: function(salary) {
    return salary * 2;
  },
};
function calculateBonus(level, salary) {
  return strageties[level](salary);
}

/*策略模式重构表单校验*/
//校验逻辑封装成策略对象
var strategies = {
  isNonEmpty: function(value, errorMsg) {
    //不为空
    if (value === '') {
      return errorMsg;
    }
  },
  minLength: function(value, length, errorMsg) {
    //限制最小长度
    if (value.length < length) {
      return errorMsg;
    }
  },
  isMobile: function(value, errorMsg) {
    if (!/^1[3|5|7|8|9][0-9]{9}$/.test(value)) {
      //手机号码格式
      return errorMsg;
    }
  },
};
function Validator() {
  this.cache = [];
}
Validator.prototype.add = function(dom, rule, errorMsg) {
  var arg = rule.split(':'); //把strategy和参数分开
  this.cache.push(function() {
    var strategy = ary.shift(); //用户挑选的strategy
    arg.unshift(dom.value); //把input的value添进参数列表
    arg.push(errorMsg); //errorMsg 添进参数列表
    return strategies[strategy].apply(dom, args);
  });
};
Validator.prototype.start = function() {
  for (let i = 0, validatorFunc; (validatorFunc = this.cache[i++]); ) {
    var msg = validatorFunc(); // 开始校验，并取得校验后的返回信息
    if (msg) {
      // 如果有确切的返回值，说明校验没有通过
      return msg;
    }
  }
};
function validatorFunc() {
  let validator = new Validator();
  validator.add(dom, 'isNonEmpty', '用户名不能为空');
  validator.add(dom, 'minLength:6', '密码长度不能少于6位');
  validator.add(dom, 'isMobile', '手机号码格式不正确');

  let errorMsg = validator.start(); //获得校验结果
  return errorMsg;
}
