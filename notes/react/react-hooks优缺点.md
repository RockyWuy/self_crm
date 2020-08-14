<!--
 * @Author: rockyWu
 * @Date: 2020-07-23 17:49:55
 * @Description: 
 * @LastEditors: rockyWu
 * @LastEditTime: 2020-07-25 11:41:56
--> 

[react hooks的优缺点](https://zhuanlan.zhihu.com/p/88593858)  

### react hooks 设计思想

首先一个组件需要 
  * state来存储逻辑状态
  * 可以访问并更改状态的方法函数

类组件就是一种很好的表现形式，要渲染的内容（state和props）放在类的属性里，用于处理交互回调函数和生命周期函数放在类的方法里。

然而类组件暴露出部分问题
    1、重复的逻辑放在不同的生命周期，componentDidMount 和 componentDidUpdate 处理相同的数据请求
    2、同一职责代码有可能需要被强行分拆到不同的生命周期，例如同一个事件的订阅与取消订阅；
    3、高阶组件或 render props 等模式引入了嵌套，复杂且不灵活，同时生成了不必要的节点，以及状态来源混乱

React hooks在一定程度上就是使用 闭包的方式来取代Class ：
    1、state 存储组件的状态，并可被渲染成 HTML DOM；
    2、用来处理用户操作事件的回调函数可以访问并变更 state，触发组件重新渲染；
    3、用来处理与组件外部交互（副作用）的函数可以访问并变更 state，触发组件重新渲染

1 2 点都很好做到，主要是第3点
确定要不要执行以及在什么时候执行。在 class 组件中，生命周期函数给开发者提供了这种控制能力

所以hooks 定义了useEffects，同时它的执行取决于依赖数组里的state，并且其会返回一个函数用来消除副作用


> 优点

复用代码更容易：hooks 是普通的 JavaScript 函数，所以开发者可以将内置的 hooks 组合到处理 state 逻辑的自定义 hooks中，这样复杂的问题可以转化一个单一职责的函数，并可以被整个应用或者 React 社区所使用；

使用组合方式更优雅：不同于 render props 或高阶组件等的模式，hooks 不会在组件树中引入不必要的嵌套，也不会受到 mixins 的负面影响；

更少的代码量：一个 useEffect 执行单一职责，可以干掉生命周期函数中的重复代码。避免将同一职责代码分拆在几个生命周期函数中，更好的复用能力可以帮助优秀的开发者最大限度降低代码量；

代码逻辑更清晰：hooks 帮助开发者将组件拆分为功能独立的函数单元，轻松做到“分离关注点”，代码逻辑更加清晰易懂；

单元测试：处理 state 逻辑的自定义 hooks 可以被独立进行单元测试，更加可靠；

> 缺点  
* 响应式的useEffect  
    你必须清楚代码中useEffect和useCallback等api的第二个参数“依赖项数组”的改变时机，并且掌握上下文的useEffect的触发时机。当逻辑较复杂的时候，useEffect触发的次数，可能会被你预想的多。  
    对比componentDidmount和componentDidUpdate，useEffect带来的心智负担更大 
    
* 状态不同步  
    (函数的运行是独立的，每个函数都有一份独立的作用域)  
    ```
    import { useEffect, useRef, useState } from "react";
        ​
        const useRefState = <T>(
            initialValue: T
        ): [T, React.MutableRefObject<T>, React.Dispatch<React.SetStateAction<T>>] => {
            const [state, setState] = useState<T>(initialValue);
            const stateRef = useRef(state);
            useEffect(() => {
                stateRef.current = state;
            }, [state]);
            return [state, stateRef, setState];
        };
        ​
    export default useRefState;
    ```
