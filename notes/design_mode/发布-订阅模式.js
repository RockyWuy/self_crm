/*
 * @Author: rockyWu
 * @Date: 2018-12-30 11:28:44
 * @Description:
 * @LastEditors: rockyWu
 * @LastEditTime: 2020-06-02 14:59:16
 */

//发布—订阅模式又叫观察者模式, 它定义对象间的一种一对多的依赖关系, 当一个对象的状态发生改变时, 所有依赖于它的对象都将得到通知。
//在JavaScript 开发中, 我们一般用事件模型来替代传统的发布—订阅模式。

/*dom事件*/
//在这里需要监控用户点击document.body的动作, 但是我们没办法预知用户将在什么时候点击。
//所以我们订阅document.body 上的click 事件, 当body 节点被点击时, body 节点便会向订阅者发布这个消息
document.body.addEventListener('click', function() {
  console.log('1');
});
document.body.addEventListener('click', function() {
  console.log('2');
});
/*自定义事件*/
//首先要指定好谁充当发布者(比如售楼处)
//然后给发布者添加一个缓存列表, 用于存放回调函数以便通知订阅者(售楼处的花名册)
//最后发布消息的时候, 发布者会遍历这个缓存列表, 依次触发里面存放的订阅者回调函数(遍历花名册, 挨个发短信)

let saleOffices = {}; //定义售楼处
saleOffices.clientList = {}; //缓存列表, 存放订阅者的回调函数
saleOffices.listen = function(key, fn) {
  if (!this.clientList[key]) {
    // 如果还没有订阅过此类消息，给该类消息创建一个缓存列表
    this.clientList[key] = [];
  }
  this.clientList[key].push(fn); // 订阅的消息添加进消息缓存列表
};
saleOffices.remove = function(key, fn) {
  let fns = this.clientList[key];
  if (!fns) {
    // 如果key 对应的消息没有被人订阅, 则直接返回
    return false;
  }
  if (!fn) {
    //如果没有传入具体的回调函数, 表示需要取消key对应消息的所有订阅
    fns && fns.length === 0;
  } else {
    for (let l = fns.length - 1; l > 0; l--) {
      let _fn = fns[l];
      if (_fn === fn) {
        ///??????????????? 函数不可直接比较
        fns.splice(l, 1); //删除订阅者的回调函数
      }
    }
  }
};
saleOffices.trigger = function() {
  //发布消息
  let key = Array.prototype.shift.call(arguments); //取出消息类型
  let fns = this.clientList[key]; //取出该消息对应的回调函数集合
  if (!fns || fns.length === 0) {
    return false;
  }
  for (let i = 0, fn; (fn = fns[i++]); ) {
    fn.apply(this, arguments); //arguments是发布消息是附带的参数
  }
};
saleOffices.listen('squareMeter88', function(price) {
  // 小明订阅88 平方米房子的消息
  console.log('价格= ' + price); // 输出： 2000000
});
saleOffices.listen('squareMeter110', function(price) {
  // 小红订阅110 平方米房子的消息
  console.log('价格= ' + price); // 输出： 3000000
});
