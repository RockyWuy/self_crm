# 浅谈 React 虚拟 DOM
> React 中最令人神奇的部分莫过于虚拟 DOM 以及其高效的 Diff算法。使用React，我们可以放弃之前直接对原生 DOM 操作的方式；我们也不需要关心虚拟 DOM 是如何运作的，只需关心数据，React会根据我们提供的数据的去渲染对应的页面。然而虚拟 DOM 也并非React 中才首次提出；为什么能掀起如此风波呢？因此我们可以稍微探究其中的原理

### Virtual DOM 是什么?
Virtual DOM 就是通过 JS 对象模拟 DOM 中的真实节点对象，保留了 Element 之间的层次关系和一些基本属性, 再通过特定的 render 方法将其渲染成真实的DOM节点

### React 为什么采用 Virtual DOM？  
首先我们可以打印一个 DOM 元素的第一层属性，可以看到 DOM 元素上实现的属性是如此之多，因此重新生成新的元素已经是对性能的巨大浪费
```
let dom = document.createElement('div');
for (let prop in dom) {
    console.log(prop)
}
```
 
其次我们的知道 React 采用 re-render all 机制，即对于 React 而言，任何一点的变化都需要重新渲染整个应用；在这个前提之下，如果没有 Virtual DOM 作为缓冲，可以想象其中的开销之大，每次都需要生成所有的 DOM 元素来更新页面。  

可以得出 React 采用 Virtual DOM 的原因如下：
* 创建真实DOM的代价高：真实的 DOM 节点 node 实现的属性很多，而 vnode 仅仅实现一些必要的属性，相比起来，创建一个 vnode 的成本比较低
* 触发多次浏览器重绘及回流：使用 vnode，相当于加了一个缓冲，让一次数据变动所带来的所有 node 变化，先在 vnode 中进行修改，然后 diff 之后对所有产生差异的节点集中一次对 DOM tree 进行修改，以减少浏览器的重绘及回流
* 抽象：它抽象了DOM的具体实现，在浏览器中，Virtual DOM最终编译成了DOM，但是在 iOS中，Vitual DOM却完全可以编译成 oc 中的组件，甚至在安卓、windows、mac osx 中都完全可以编译成对应的UI组件  

接下来我们介绍 跟 Virtual DOM 息息相关的 Diff 算法；  
不过在此之前有一个问题，都说 DOM 操作的成本高，那现在 React 采用了 Virtual DOM 之后，它会比原生 DOM 操作快么，可以参考下面的链接进行学习  
[React 框架是否比原生 DOM 操作快](https://www.zhihu.com/question/31809713/answer/53544875)

## Diff 算法
传统的 Diff 算法复杂度为 O(n^3)，这显然无法满足性能要求。因而 React 做了三种假设：
1. Web UI 中 DOM 节点跨层级的移动操作特别少，可以忽略不计。
2. 两个相同组件产生类似的 DOM 结构，不同的组件产生不同的 DOM 结构。
3. 对于同一层级的一组子节点，它们可以通过唯一 id 进行区分。 
***
在这三种假设之下，React 在进行 Diff 算法时，进行了如下选择从而达到了 O(n) 的复杂度
1. 如果父节点不同，放弃对子节点的比较，直接删除旧节点然后添加新的节点重新渲染
2. 如果子节点类型有变化，Virtual DOM 不会再去计算变化的是什么，而是直接重新渲染
3. 通过唯一的key策略 
***
Diff 算法即虚拟 DOM 树之间的比较， 在 React 中，根据上面的描述；树的算法非常简单，如下图两棵虚拟 DOM 树只会对同一层次的节点进行比较：
![alt](https://oss.aircourses.com/20190829/18d28d20-cff9-432d-9174-bac399115fd5.png '')
React 只会对相同颜色方框内的 DOM 节点进行比较，即同一个父节点下的所有子节点。当发现节点已经不存在，则该节点及其子节点会被完全删除掉，不会用于进一步的比较。这样只需要对树进行一次遍历，便能完成整个 DOM 树的比较。

### 算法实现
```
// 工具函数 判断变量类型
function isType (obj) {
    return Object.prototype.toString.call(obj).replace(/\[object\s|\]/g, '')
}
let oldDomNode = Element(
    'div',
    { id: 'oldNode' },
    ['text', Element('p', 'content')]
)
let newDomNode = Element(
    'div',
    { id: 'newNode' },
    ['text', Element('span', 'content')]
)
// 创建虚拟 DOM 节点方法
function Element(tagName, props, children) {
    if(!(this instanceof Element)) {
        if(!(isType(children) === 'Array') && children !== '') {
            children = Array.prototype.slice.call(arguments, 2);
        }
        return new Element(tagName, props, children)
    }
    if(isType(props) === 'Array') { // 未传props, 则第二个参数为children
        children = props
        props = {}
    }
    this.tagName = tagName
    this.props = props || {}
    this.children = children || []
    this.key = props ? props.key : undefined
    
    let count = 0
    this.children.forEach((child, index) => {
        if(child instanceof Element) {
          count += child.count // 加上子节点所有的子节点数量
        } else {
          children[index] = '' + child
        }
        count++
    })
    this.count = count // 当前节点所拥有的子节点数
}

// 渲染至页面
Element.prototype.render = function() {
    let el = document.createElement(this.tagName)
    let props = this.props
    setAttrs(el, props) // 设置属性
    this.children.forEach(child => {
        let childEl = child instanceof Element ? child.render() : document.createTextNode(child)
        el.appendChild(childEl)
    })
    return el
}
// 给 DOM 元素设置属性
function setAttrs(dom, props) {
    for (let [propName, propValue] in Object.keys(props)) {
        el.setAttribute(propName, propValue) // 通过setAttribute设置元素属性
        let v = props[k]
        if(propName === 'className') {
            dom.setAttribute('class', propValue)
            return
        }
        if(propName === 'style') {
            if(typeof propValue === 'object') {
                for(let i in propValue) {
                    dom.style[i] = propValue[i]
                }
            }
            if(typeof propValue === 'string') {
                dom.style.cssText = propValue
            }
            return
        }
        if(propName.startsWith('on')) {
            let capture = (propName.indexOf('Capture') !== -1) // 是否在冒泡或捕获阶段执行
            dom.addEventListener(propName.substring(2).toLowerCase(), propValue, capture)
            return
        }
        dom.setAttribute(propName, propValue)
    }
}

// 在实际的代码中，会对新旧两棵树进行一个深度优先的遍历，这样每一个节点就会有一个唯一的标记
// 在深度优先遍历的时候，每遍历到一个节点就把该节点和新的树进行对比，如果有差异的话就记录到一个对象里面
function diff(oldDomTree, newDomTree) {
    let index = 0 // 深度优先遍历时，每个节点都有一个index
    let patches = {} // 记录差异，遍历到每个节点都需要对比，找到差异则记录
    dfs(oldDomTree, newDomTree, index, patches) // 开始深度优先遍历
    return patches // 最终diff算法返回的是一个两棵树的差异
}

// 对两颗树进行深度优先遍历
function dfs(oldNode, newNode, index, patches) {
    let currentPatch = [] // 当前节点差异
    if(newNode === null) { // 节点被移除
    } else if(isType(oldNode) === 'String' && isType(newNode) === 'String') { // 文本节点
        if(newNode !== oldNode) { // 文本不同的情况
            currentPatch.push({ type: 'text', content: newNode })
        }
    } else if(oldNode.tagName === newNode.tagName && oldNode.key === newNode.key) { // 节点类型相同
        let props = diffProps(oldNode.props, newNode.props)
        if(props) { // 属性有变化
            currentPatch.push({ type: 'props', props: props })
        }
        // 比较子节点
        diffChildren(oldNode.children, newNode.children, index, patches, currentPatch)
    } else { // 节点类型不同则直接替换
        currentPatch.push({ type: 'replace', node: newNode })
    }
    currentPatch.length ? patches[index] = currentPatch : null
}
// 比较子节点
function diffChildren(oldChildren, newChildren, index, patches, currentPatch) {
    let diffs = reorder(oldChildren, newChildren)
    let moves = diffs.moves
    newChildren = diffs.children
    if(moves.length > 0) { // 子节点有变化
        currentPatch.push({ type: 'reorder', moves: diffs.moves })
    }
    let leftNode = null
    let currentNodeIndex = index
    oldChildren.forEach((child, index) => { // 深度优先遍历时给节点 唯一编号
		let newChild = newChildren[index]
		currentNodeIndex = (leftNode && leftNode.count) 
							? currentNodeIndex + leftNode.count + 1 
							: currentNodeIndex + 1
		dfs(child, newChild, currentNodeIndex, patches)
		leftNode = child
    })
}
// 比较属性
function diffProps(oldProps, newProps) {
    let patch = {}
    let count = 0
    // 先遍历oldProps 查看是否存在删除的属性
    for(let key in oldProps) {
        if(oldProps[key] !== newProps[key]) {
            patch[key] = newProps[key] // 有可能是undefined => 新节点删除了该属性
            count++
        }
    }
    for(let key in newProps) {
        if(!oldProps.hasOwnProperty(key)) {
            patch[key] = newProps[key]
            count++
        }
    }
    
    if(count === 0) return null
    return patch
}

// 更新dom
function patch(node, patches) {
	let index = 0
    dfsDom(node, index, patches)
}
function dfsDom(node, index, patches) {
	let currentPatch = patches[index]
	node.childNodes && dom.childNodes.forEach((child, index) => {
		dfsDom(child, ++index, patches)
	})
	if(currentPatch.length > 0) { // 当前节点有变化
		doPatch(node, currentPatch)
	}
}
function doPatch(node, currentPatches) {
    currentPatches.forEach(patch => {
        switch(patch.type) {
            case 'props':
                setProps(node, patch.props)
                break
            case 'text':
                node.textContent = patch.content
                break
            case 'replace':
				let newNode = patch.node instanceof Element 
							? patch.newNode.render() 
							: document.createTextNode(patch.newNode)
                node.parentNode.replaceChild(newNode, node)
                break
            case 'reorder':
                reorderChildren(node, currentPatches.moves)
				break
			default: 
				throw new Error(`UnKnow patch type ${patch.type}`)
        }
    })
}
// 更新属性
function setProps(node, props) {
	for(let key in props) {
		if(!props[key]) { // 删除属性
			node.removeAttribute(key)
			Reflect.deleteProperty(props, key)
		}
	}
	setAttrs(node, props)
}
// 处理子节点
function reorderChildren(node, moves) {
	let nodeList = Array.prototype.slice.call(node.childNodes, 0)
	let maps = {}
	nodeList.forEach(child => {
		if(child.nodeType === 1) { // 元素节点
			let key = child.getAttribute('key')
			if(key) {
				maps[key] = key
			}
		}
	})
	moves.forEach(move => {
		let index = move.index
		if(move.type === 0) { // 删除
			if(nodeList[index] === node.childNodes[index]) { // 可能插入时已被删除
				node.removeChild(node.childNodes[index])
			}
			nodeList.splice(index, 1)
		} else if(move.type === 1) { // 插入
			let insertNode = maps[move.item.key]
							? maps[move.item.key] // 重用node
							: (typeof move.item === 'object')
								? move.item.render()
								: document.createTextNode(move.item)
			nodeList.splice(index, 0, insertNode)
			node.insertBefore(insertNode, node.childNodes[index] || null) // 若引用的节点为文档中现有的节点，则会移动
		}
	})
}

// 比较子节点 
function reorder(oldList, newList) {
    let newIndexs = keyIndex(newList)
    let newKeys = newIndexs.keys // { c: 0, a: 1, e: 3, f: 4 }
    let newFree = newIndexs.free // [2]
    if(newFree.length === newList.length) { // 所有新增元素均未设置key
        return {
            children: newList,
            moves: []
        }
    }
    let oldIndexs = keyIndex(oldList)
    let oldKeys = oldIndexs.keys // { a: 0, b: 1, c: 2, e: 4 }
    let oldFree = oldIndexs.free // [3]
    if(oldFree.length === oldList.length) { // 所有旧元素均未设置key
        return {
            children: newList,
            moves: []
        }
    }
    let children = []
    let freeIndex = 0
    let freeCount = newFree.length
    
    for(let i = 0; i < oldList.length; i++) {
        let oldItem = oldList[i] // { key: a } {key: "b"}, {}
        let itemIndex
        if(oldItem.key) {
            if(newKeys.hasOwnProperty(oldItem.key)) { // 新列表中存在
                itemIndex = newKeys[oldItem.key] // 1
                children.push(newList[itemIndex]) // [{ key: 'a' },{key: 'b'}, { key: 'c' }, null, { key: 'e' }, { key: 'f' }]
            } else { // 删除
                children.push(null)
            }
        } else {
            if(freeIndex < freeCount) {
                itemIndex = newFree[freeIndex++]
                children.push(newList[itemIndex]) // [{ key: 'a' }, { key: 'b' }, { key: 'c' }, {}]
            } else {
                newChildren.push(null)
            }
        }
    }
    
    // let lastFreeIndex = freeIndex >= newFree.length ? oldList.length : newFree[freeIndex]
    // for(let j = 0; j < newList.length; j++) {
    //     let newItem = newList[j]
    //     if(newItem.key) {
    //         if(!oldKeys.hasOwnProperty(newItem.key)) {
    //             children.push(newItem)
    //         }
    //     } else if(j >= lastFreeIndex) {
    //         children.push(newItem)
    //     }
    // }
    
    let simulateList = children.slice()
    let simulateIndex = 0
    let simulateItem
    let moves = []
    
    let i = 0
    // 删除null节点
    while (i < simulateList.length) {
        if (simulateList[i] === null) {
            remove(i)
            removeSimulate(i)
        } else {
            i++
        }
    }
    let j = 0;
    let k = 0;
    for(; j < newList.length;) {
        let item = newList[j] // {key: c} { key: a} 
        let simulateItem = simulateList[k] // {key: a} { key: b } {key: c}

        if(simulateItem) { // 如果存在则比较
            if(item.key === simulateItem.key) { // 相同则直接跳过比较下一个节点
                k++
            } else {
                if(!oldKeys.hasOwnProperty(item.key)) { // 如果不存在则直接插入
                    insert(j, item)
                } else {
                    let nextKey = simulateList[k + 1] && simulateList[k + 1].key || undefined
                    if(nextKey === item.key) {
                        remove(j)
                        removeSimulate(k)
                        k++
                    } else {
                        insert(j, item)
                    }
                }
            }
        } else {
            insert(j, item)
        }
        j++
    }
    let len = simulateList.length - k
    while( k++ < simulateList.length ) {
        len--
        remove(j + len)
    }
    
    // 删除节点
    function remove(index) {
        moves.push({ index, type: 0 })
    }
    function removeSimulate(index) {
        simulateList.splice(index, 1)
    }
    // 添加 插入操作
    function insert(index, item) {
        moves.push({ type: 1, item, index })
    }
    
    // 获取各元素对应的位置
    function keyIndex(list) {
        let keys = {}
        let free = []
        for(let i = 0, len = list.length; i < len; i++) {
            let child = list[i]
            if(child.key) {
                keys[child.key] = i
            } else {
                free.push(i)
            }
        }
        return {
            keys,
            free
        }
    }
    return  {
        moves,
        children
    }
}
```

### 参考资料
[React 源码剖析系列 － 不可思议的 react diff](https://zhuanlan.zhihu.com/p/20346379)  
[虚拟 DOM Diff 算法解析](https://www.infoq.cn/article/react-dom-diff)  
[如何实现一个 Virtual DOM 算法](https://github.com/livoras/blog/issues/13)
