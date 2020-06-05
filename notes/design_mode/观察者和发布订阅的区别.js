/*
 * @Author: rockyWu
 * @Date: 2020-05-23 16:16:36
 * @Description:
 * @LastEditors: rockyWu
 * @LastEditTime: 2020-05-23 16:19:16
 */

// 观察者模式中主体和观察者是互相感知的，
// 发布-订阅模式是借助第三方来实现调度的，发布者和订阅者之间互不感知

// 发布 订阅模式
// dispatch -> store -> view
// store 负责接收发布事件， 并利用 subscription 将变化传递给 view

// 观察者模式
// mobx
