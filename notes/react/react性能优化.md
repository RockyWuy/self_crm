<!--
 * @Author: rockyWu
 * @Date: 2020-07-23 11:34:50
 * @Description: 
 * @LastEditors: rockyWu
 * @LastEditTime: 2020-08-12 13:54:17
--> 
[浅谈React性能优化的方向](https://zhuanlan.zhihu.com/p/74229420)

* 减少渲染的节点/降低渲染计算量(复杂度)  
    1、不要在渲染函数都进行不必要的计算：  
    比如不要在渲染函数(render)中进行数组排序、数据转换、订阅事件、创建事件处理器等等. 渲染函数中不应该放置太多副作用  
    
    2、减少不必要的嵌套：  
    一般不必要的节点嵌套都是滥用高阶组件/RenderProps 导致的。所以还是那句话‘只有在必要时才使用 xxx’。 有很多种方式来代替高阶组件/RenderProps，例如优先使用 props、React Hooks

* 虚拟列表  
    [再谈前端虚拟列表的实现](https://zhuanlan.zhihu.com/p/34585166)


* 惰性渲染  
    惰性渲染的初衷本质上和虚表一样，也就是说我们只在必要时才去渲染对应的节点。  
    举个典型的例子，我们常用 Tab 组件，我们没有必要一开始就将所有 Tab 的 panel 都渲染出来，而是等到该 Tab 被激活时才去惰性渲染。

* 避免重新渲染  
    1、shouldComponentUpdate  
    2、PrueComponent  
    3、React.memo  

* 简化 props   
    1、如果一个组件的 props 太复杂一般意味着这个组件已经违背了‘单一职责’，首先应该尝试对组件进行拆解  
    2、另外复杂的 props 也会变得难以维护, 比如会影响shallowCompare效率, 还会让组件的变动变得难以预测和调试

* 不变的事件处理器   
    1、避免使用箭头函数形式的事件处理器  
    2、即使现在使用hooks，我依然会使用useCallback来包装事件处理器  
    3、设计更方便处理的 Event Props  


* 简化 state  
    不是所有状态都应该放在组件的 state 中. 例如缓存数据。按照我的原则是：如果需要组件响应它的变动, 或者需要渲染到视图中的数据才应该放到 state 中。这样可以避免不必要的数据变动导致组件重新渲染.
    
* 不要滥用 Context  
    首先要理解 Context API 的更新特点，它是可以穿透React.memo或者shouldComponentUpdate的比对的，也就是说，一旦 Context 的 Value 变动，所有依赖该 Context 的组件会全部 forceUpdate