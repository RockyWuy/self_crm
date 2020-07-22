<!--
 * @Author: rockyWu
 * @Date: 2020-07-05 12:42:59
 * @Description:
 * @LastEditors: rockyWu
 * @LastEditTime: 2020-07-05 15:06:34
-->

## redux

开发中我们往往会用到 react 框架，然而 虽然 react 能够做到状态管理，但如果碰到状态复杂的情况，往往力不从心；这个时候就轮到 redux 的出场了，redux 是 JavaScript 状态管理容器，提供可预测化的状态管理

### redux 三大原则

- 单一数据源 (整个应用的 state 存储在一个变量当中)
- state 是只读的 (通过触发 action 才能改变 state)
- 使用纯函数来执行修改

### redux middleware

redux 提供的基本功能只能处理同步代码；但我们开发的过程中经常会遇到 异步执行的情况，比如接口请求；

这个时候我们就需要用到 redux middleware，它提供的是位于 action 被发起之后，到达 reducer 之前的扩展点；

例如 redux-thunk 我们可以处理 action 为函数的情况，这个函数处理完副作用之后可以重新调用 reducer 更改 state；

想理解 redux 中的中间件机制，需要先理解一个方法: compose

```
    function compose(...funcs) {
        if (funcs.length === 0) {
            return arg => arg
        }
        if (funcs.length === 1) {
            return funcs[0]
        }
        return funcs.reduce((a, b) => (...args) => a(b(...args)))
    }
```

简单看来，就是将 funcs 里的函数依次执行，并将结果返回给上一个函数；实现了链式调用即可以完成函数的强化；

我们再来看一下 applyMiddleware 代码实现:

```
    export default function applyMiddleware(...middlewares) {
      return (createStore) => (reducer, preloadedState, enhancer) => {
        const store = createStore(reducer, preloadedState, enhancer)
        let dispatch = store.dispatch
        let chain = []

        const middlewareAPI = {
          getState: store.getState,
          dispatch: (action) => dispatch(action)
        }
        chain = middlewares.map(middleware => middleware(middlewareAPI))
        dispatch = compose(...chain)(store.dispatch)

        return {
          ...store,
          dispatch
        }
  }
}
```

中间件例子

```
    const testMiddleware = (store) => (next) => (action) => {
        next(action);
    }
```

通过 dispatch = compose(...chain)(store.dispatch)， 我们可以看出 applyMiddleware 的作用就是通过各中间件将 dispatch 不断强化之后返回；  
其中 middlewareAPI 可以让各中间件可以访问到 state 和 dispatch，同时由于 store 中的 dispatch 会变化，() => dispatch(action) 这种方式每次都可以访问到最新变化后的 dispatch；  
通过 compose 的实现，看出我们可以通过 next 访问到下个中间件，最后一个函数则访问初始 store.dispatch；

## koa

koa 的洋葱模型想必各位都听说过，这种灵活的中间件机制也让 koa 变得非常强大，下面我们来看下 koa 实现中间件的原理，首先是一张非常经典的图：

![](https://user-gold-cdn.xitu.io/2020/1/8/16f8325868c493bd?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

对应这张图来看，洋葱的每一个圈就是一个中间件，它可以控制请求进入，也可以控制响应返回。

它和 redux 的中间件机制有点类似，本质上都是高阶函数的嵌套，外层的中间件嵌套着内层的中间件，这种机制的好处是可以自己控制中间件的能

koa 中间件的用法:

```
const Koa = require('koa');

const app = new Koa();
app.use(middleware);
```

这里的 use 就是简单的将中间件推入到中间件的队列之中，在中间件当中调用 next 则可以执行下一个中间件；现在留给我们的问题是如何把这些中间件组合起来；同样是 compose 方法：

```
  this.middlewares = [fn1, fn2, fn3];

  function compose(middlewares) {
    return (ctx, next) => {
      let index = -1
      return dispatch(0)
      function dispatch (i) {
        index = i
        let fn = middlewares[i]
        if (i === middlewares.length) fn = next
        if (!fn) return Promise.resolve()
        try {
          return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
        } catch (err) {
          return Promise.reject(err)
        }
      }
    }
  }
```

通过上面的代码，我们可以发现 dispatch(n)对应着第 n 个中间件的执行，而 dispatch(n)又拥有执行 dispatch(n + 1)的权力；

所以在真正运行的时候，中间件并不是在平级的运行，而是嵌套的高阶函数；

其中比较经典的地方是通过 Promise.resolve 来处理异步，每个中间件执行返回一个 promise，则可以做到等待中间件执行完成之后才进行之后的逻辑；
