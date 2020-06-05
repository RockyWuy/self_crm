/*
 * @Author: rockyWu
 * @Date: 2018-12-30 11:28:44
 * @Description:
 * @LastEditors: rockyWu
 * @LastEditTime: 2020-06-02 15:40:24
 */

/*代理模式是为一个对象提供一个代用品或占位符, 以便控制对它的访问*/
//当客户不方便直接访问一个对象或者不满足需要的时候, 提供一个替身对象来控制对这个对象的访问, 客户实际上访问的是替身对象。
//替身对象对请求做出一些处理之后, 再把请求转交给本体对象
function Flower() {}
var xiaoming = {
  sendFlower: function(target) {
    let flower = new Flower();
    target.receiveFlower(flower);
  },
};
var B = {
  receiveFlower: function(flower) {
    A.listenGoodMood(function() {
      A.receiveFlower(flower);
    });
  },
};
var A = {
  receiveFlower: function(flower) {
    console.log('收到花' + flower);
  },
  listenGoodMood: function(fn) {
    setTimeout(function() {
      fn();
    }, 10000);
  },
};
//保护代理和虚拟代理
//保护代理 ： 代理B 可以帮助A过滤掉一些请求, 比如送花的人中年龄太大的或者没有宝马的, 这种请求就可以直接在代理B处被拒绝掉
//虚拟代理 : 假设现实中的花价格不菲, 导致在程序世界里, new Flower 也是一个代价昂贵的操作,
//那么我们可以把new Flower 的操作交给代理B 去执行, 代理B 会选择在A 心情好时再执行newFlower, 这是代理模式的另一种形式
var B = {
  receiveFlower: function(flower) {
    A.listenGoodMood(function() {
      // 监听A 的好心情
      var flower = new Flower(); // 延迟创建flower 对象
      A.receiveFlower(flower);
    });
  },
};

let myImage = (function() {
  let imgNode = document.createElement('img');
  document.body.append(imgNode);
  return {
    setSrc: function(src) {
      imgNode.src = src;
    },
  };
})();
let proxyImage = function() {
  let img = new Image();
  img.onload = function() {
    //图片加载完之后执行
    myImage.setSrc(this.src);
  };
  return {
    setSrc: function(src) {
      myImage.setSrc('loading.gif');
      img.src = src;
    },
  };
};
/*缓存代理*/
//缓存代理的例子——计算乘积
function mult() {
  let a = 1;
  for (let i = 0; i < arguments.length; i++) {
    a = a * arguments[i];
  }
  return a;
}
var proxyMult = (function() {
  let cache = {};
  return function() {
    let args = Array.prototype.join.call(arguments, ',');
    if (args in cache) {
      return cache[args];
    }
    return (cache[args] = mult.apply(this, arguments));
  };
})();
//当我们第二次调用proxyMult( 1, 2, 3, 4 )的时候, 本体mult 函数并没有被计算, proxyMult直接返回了之前缓存好的计算结果
//通过增加缓存代理的方式, mult 函数可以继续专注于自身的职责——计算乘积, 缓存的功能是由代理对象实现的
