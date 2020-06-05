/*
 * @Author: rockyWu
 * @Date: 2020-05-22 13:48:06
 * @Description:
 * @LastEditors: rockyWu
 * @LastEditTime: 2020-05-25 12:41:36
 */

// es6 如何实现继承
// class son extends super {
// }

class Parent {
  static height = 12;
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  speakSomething() {
    console.log('I can speak chinese');
  }
}

class Child extends Parent {
  static width = 18;
  constructor(name, age) {
    super(name, age);
  }
  coding() {
    console.log('I can code Js');
  }
}

// 转换实现
('use strict');

var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === 'object' || typeof call === 'function') ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError(
      'Super expression must either be null or a function, not ' + typeof superClass
    );
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true,
    },
  });
  // class A{}
  // class B extends A{}
  // B.__proto__ === A // true
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

var Parent = (function() {
  function Parent(name, age) {
    _classCallCheck(this, Parent);

    this.name = name;
    this.age = age;
  }

  _createClass(Parent, [
    {
      key: 'speakSomething',
      value: function speakSomething() {
        console.log('I can speek chinese');
      },
    },
  ]);

  return Parent;
})();

Parent.height = 12;

Parent.prototype.color = 'yellow';

//定义子类，继承父类

var Child = (function(_Parent) {
  _inherits(Child, _Parent);

  function Child(name, age) {
    _classCallCheck(this, Child);

    return _possibleConstructorReturn(
      this,
      (Child.__proto__ || Object.getPrototypeOf(Child)).call(this, name, age)
    );
  }

  _createClass(Child, [
    {
      key: 'coding',
      value: function coding() {
        console.log('I can code JS');
      },
    },
  ]);

  return Child;
})(Parent);

Child.width = 18;

var c = new Child('job', 30);
c.coding();

var __extends =
  (this && this.__extends) ||
  function(d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
  };
var Animal = (function() {
  function Animal(name) {
    this.name = name;
  }
  return Animal;
})();
var Cat = (function(_super) {
  __extends(Cat, _super);
  function Cat() {
    _super.apply(this, arguments);
  }
  Cat.prototype.sayHi = function() {
    console.log('Meow, My name is ' + this.name);
  };
  return Cat;
})(Animal);
var cat = new Cat('Tom');
