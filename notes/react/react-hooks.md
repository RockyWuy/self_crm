# React Hooks

### React Hooks 是什么

- 众所周知 React 中分为函数式组件和类组件，其中函数组件也叫做 Stateless Component，因为在函数组件没有实例，没有生命周期函数；如果需要使用 state 或其他一些功能时，只能使用类组件
- React hooks 是 React 在 16.8 版本新增特性；它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。
- React 定义凡是 use 开头的 API 都是 hooks

### React Hooks 的动机

官方文档中列了三点：

1. 在组件之间复用状态逻辑很难；
2. 复杂组件变得难以理解；
3. 难以理解的 class；

关于动机 [官方文档](https://zh-hans.reactjs.org/docs/hooks-intro.html#motivation) 里也有更详细的解释，不用细说；  
React Hooks 可以胜任 class 几乎所有的能力；反过来说 class 也能完成所有的功能，不管是利用 render props 或是高阶组件； 但是 Hooks 优化了上述的三个问题。  
对我来说尤其 _复杂组件变得难以理解_ 确实是遇到的问题，相互关联的代码需要分布在不同的生命周期函数中，而不相关的功能确在一个周期函数中；而使用 Hooks 的 useEffect 就能很容易的将代码拆成更小的函数来维护，并且相互关联的代码能写一起，所以值得我们去探究一番。

### React Hooks API

基本的用法和例子就不细说，都可以通过相应的链接到官方文档了解更详细的内容：

- 基础 Hook
  - [useState](https://zh-hans.reactjs.org/docs/hooks-reference.html#usestate)
  - [useEffect](https://zh-hans.reactjs.org/docs/hooks-reference.html#useeffect)
  - [useContext](https://zh-hans.reactjs.org/docs/hooks-reference.html#usecontext)
- 额外的 Hook
  - [useReducer](https://zh-hans.reactjs.org/docs/hooks-reference.html#usereducer)
  - [useCallback](https://zh-hans.reactjs.org/docs/hooks-reference.html#usecallback)
  - [useMemo](https://zh-hans.reactjs.org/docs/hooks-reference.html#usememo)
  - [useRef](https://zh-hans.reactjs.org/docs/hooks-reference.html#useref)
  - [useImperativeHandle](https://zh-hans.reactjs.org/docs/hooks-reference.html#useimperativehandle)
  - [useLayoutEffect](https://zh-hans.reactjs.org/docs/hooks-reference.html#uselayouteffect)
  - [useDebugValue](https://zh-hans.reactjs.org/docs/hooks-reference.html#usedebugvalue)

### 自定义 Hooks
> 自定义Hooks 即是 Hooks 实现代码复用的关键
- 自定义 Hook 更像是一种约定，而不是一种功能。如果函数的名字以 use 开头，并且调用了其他的 Hook，则就称其为一个自定义 Hook
- 我们有时候会想要在组件之间重用一些状态逻辑，之前要么用 render props ，要么用高阶组件，要么使用 redux
- 自定义 Hook 可以让你在不增加组件的情况下达到同样的目的
- Hook 是一种复用状态逻辑的方式，它不复用 state 本身，每次调用都有一个完全独立的 state
```javascript
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

function useCount(){
  let [count, setCount] = useState(0);

  useEffect(()=>{
    setInterval(()=>{
      setCount(count => count + 1);
    },1000);
  },[]);

  return [count];
}

// 每个组件调用同一个 hook，只是复用 hook 的状态逻辑，并不会共用一个状态
function Count1(){
  let [count] = useCount();
  return (
    <div>{count}</div>
  )
}

function Count2(){
  let [count] = useCount();
  return (
    <div>{count}</div>
  )
}

```

### 实例

#### 验证码功能
前面的基础用法都可以从官方文档了解，后面列举一个平常遇到的实际情况
- 在页面中按钮点击触发定时器，首先我们写如下代码实现功能

```javascript
import React, { useState } from "react";

export default function Code({ history }) {
  const [second, setSecond] = useState(60);

  function getVerCode() {
    let timer = setInterval(() => {
      if (second <= 0) {
        clearInterval(timer);
        return;
      }
      setSecond(second - 1);
    }, 1000);
  }
  
  return (
    <div>
      <div onClick={getVerCode}>获取验证码</div>
      <div onClick={getVerCode}>{second}s</div>
    </div>
  );
}
```

看似这段代码没有问题：点击按钮之后触发函数生成一个定时器，然后每隔一秒执行一次，然后当定时器执行到 0 时，清除定时器；  
但是实际情况是定时器中每次取到 second 值都为 60，然后一直执行 60 - 1 的操作，这是因为 hooks 中每次 render 都有自己的 state 和 props，所以你在第一次生成的定时器中取到一直取得第一次的state，也就是初始的 second 值；我们可以使用下面的方法更改：

```javascript
  setSecond(second => {
    if (second <= 0) {
      clearInterval(timer);
        return;
      }
      return second - 1;
  });
```

setState 中接收一个回调函数，而回调函数的参数就是最新的 state 值，这样改完之后，我们的功能就正常了，但是其中还会有两个问题：

- 每次定时器执行都会生成一个新的函数，性能消耗
- 如果定时器未执行完成页面跳转了，定时器此时并未清除，会造成内存泄漏

对于这两个问题，Hooks 都有方法来解决；  
对于第一个问题，我们可以使用 useCallback 来解决，useCallback 只有依赖项变化时才会更新，而下面这个方法中 second 也是直接从回调函数中获取，并未有依赖项；这样我们将 依赖项设为空数组；则只会在初始化时生成函数，而之后渲染都不会更新，解决了每次渲染重新生成函数的问题

```javascript
const getVerCode = useCallback(() => {
  let timer = setInterval(() => {});
  }, 1000);
}, []);
```
而对于第二个问题，则需要用到 useRef，因为需要将定时器的值保存下来才能清除，而在 Hooks 中只有 useRef 返回的 ref 对象可以一直引用到固定的值而不会随着重现渲染而变化，因此我们可以使用 useRef 来保存定时器值，不管怎么渲染都不会变化； 
这里我们还使用到 useEffect，effect 默认每轮渲染结束后执行，同时 useEffect 返回一个清除函数，为防止内存泄漏，清除函数会在组件销毁时执行，因此可以最终清除定时器
```
const timerRef = useRef(null);
useEffect(() => {
    return () => clearInterval(timerRef.current)
}, [timerRef])
let timer = setInterval(() => {}, 1000);
timerRef.current = timer;
```
最终完整代码：
```javascript
import React, { useState, useRef, useEffect, useCallback } from "react";

export default function Code({ history }) {
  const timerRef = useRef();
  const [second, setSecond] = useState(60);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, [timerRef]);

  const getVerCode = useCallback(() => {
    let timer = setInterval(() => {
      setSecond(second => {
        if (second <= 0) {
          clearInterval(timer);
          return;
        }
        return second - 1;
      });
    }, 1000);
    timerRef.current = timer;
  }, []);

  return (
    <div>
      <div onClick={getVerCode}>获取验证码</div>
      <div onClick={getVerCode}>{second}s</div>
    </div>
  );
}
  
```