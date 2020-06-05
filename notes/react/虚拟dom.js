// DOM操作成本高在哪?
/*
    1、访问DOM
    2、修改DOM之后发生的事( 回流reflow 和 重绘repaint )
    
    浏览器渲染过程：
    1、解析html，构建DOM树(DOM Tree)
    2、解析css，生成css规则树(CSS Rule Tree)
    3、将DOM和CSSOM合并为渲染树(Render tree)
    4、有了Render Tree，浏览器已经能知道网页中有哪些节点、各个节点的CSS定义以及他们的从属关系，从而去计算出每个节点在屏幕中的位置
    5、按照算出来的规则，通过显卡，把内容画到屏幕上
*/

// Virtual DOM 是什么?
// 首先打印一个空元素(DOM对象)的第一层元素，可以看到标准让元素实现的东西太多了, 因此重新生成新的元素对性能是巨大的浪费。
let div = document.createElement('div');
for (let key in div) {
  console.log(key);
}
// Virtual DOM就是通过JS对象模拟dom中的真实节点对象，保留了Element之间的层次关系和一些基本属性, 再通过特定的render方法将其渲染成真实的DOM节点

// react 为什么采用Virtual DOM
/*
    1、创建真实DOM的代价高：真实的 DOM 节点 node 实现的属性很多，而 vnode 仅仅实现一些必要的属性，相比起来，创建一个 vnode 的成本比较低。
    2、触发多次浏览器重绘及回流：使用 vnode ，相当于加了一个缓冲，让一次数据变动所带来的所有 node 变化，先在 vnode 中进行修改，然后 diff 之后对所有产生差异的节点集中一次对 DOM tree 进行修改，以减少浏览器的重绘及回流
    3、抽象: 它抽象了DOM的具体实现, 在浏览器中，Virtual DOM最终编译成了DOM，但是在 iOS中，Virtual DOM却完全可以编译成 oc 中的组件，甚至在安卓、windows、mac osx 中都完全可以编译成对应的UI组件
    
    React: re-render all机制， 即对于React而言，任何一点的变化都需要重新渲染整个应用
    设计: 不需要我们来操作DOM的; 我们只关心数据，React会根据我们提供的数据渲染出对应的页面
    实现: 数据变化时，直接卸载原来的DOM，然后把最新数据的DOM替换上去
*/

// 操作DOM成本高，那React采用了虚拟DOM，比直接原生操作DOM更快么？
/* 
    https://www.zhihu.com/question/31809713/answer/53544875
    
    React 从来没有说过 “React 比原生操作 DOM 快”。
    React 的基本思维模式是每次有变动就整个重新渲染整个应用。
    如果没有 Virtual DOM，简单来想就是直接重置 innerHTML。很多人都没有意识到，在一个大型列表所有数据都变了的情况下，重置 innerHTML 其实是一个还算合理的操作... 真正的问题是在 “全部重新渲染” 的思维模式下，即使只有一行数据变了，它也需要重置整个 innerHTML，这时候显然就有大量的浪费。
    我们可以比较一下 
        innerHTML vs. Virtual DOM 的重绘性能消耗：
            innerHTML:  render html string O(template size) + 重新创建所有 DOM 元素 O(DOM size)
            Virtual DOM: render Virtual DOM + diff O(template size) + 必要的 DOM 更新 O(DOM change)
            Virtual DOM render + diff 显然比渲染 html 字符串要慢，但是！它依然是纯 js 层面的计算，比起后面的 DOM 操作来说，依然便宜了太多。可以看到，innerHTML 的总计算量不管是 js 计算还是 DOM 操作都是和整个界面的大小相关，但 Virtual DOM 的计算量里面，只有 js 计算和界面大小相关，DOM 操作是和数据的变动量相关的。前面说了，和 DOM 操作比起来，js 计算是极其便宜的。这才是为什么要有 Virtual DOM：它保证了 1）不管你的数据变化多少，每次重绘的性能都可以接受；2) 你依然可以用类似 innerHTML 的思路去写你的应用。
*/

// Virtual Dom 算法简述
// https://github.com/facebook/react/blob/v15.0.0/src/renderers/shared/reconciler/ReactMultiChild.js
/*  
    传统diff算法复杂度 为 O(n^3), react做了三种优化来降低复杂度：
    假设前端很少跨层移动DOM元素, 只比较同一层级元素
    1、如果父节点不同，放弃对子节点的比较，直接删除旧节点然后添加新的节点重新渲染
    2、如果子节点有变化，Virtual DOM不会计算变化的是什么，而是重新渲染
    3、通过唯一的key策略
    
    1、Web UI 中 DOM 节点跨层级的移动操作特别少，可以忽略不计。
    2、拥有相同类的两个组件将会生成相似的树形结构，拥有不同类的两个组件将会生成不同的树形结构。
    3、对于同一层级的一组子节点，它们可以通过唯一 id 进行区分
*/
let oldDomNode = Element('div', { id: 'oldNode' }, ['text', Element('p', 'content')]);
let newDomNode = Element('div', { id: 'newNode' }, ['text', Element('span', 'content')]);
function isType(obj) {
  return Object.prototype.toString.call(obj).replace(/\[object\s|\]/g, '');
}
// 创建虚拟dom节点
function Element(tagName, props, children) {
  if (!(this instanceof Element)) {
    if (!(isType(children) === 'Array') && children !== '') {
      children = Array.prototype.slice.call(arguments, 2);
    }
    return new Element(tagName, props, children);
  }
  if (isType(props) === 'Array') {
    // 未传props, 则第二个参数为children
    children = props;
    props = {};
  }
  this.tagName = tagName;
  this.props = props || {};
  this.children = children || [];
  this.key = props ? props.key : undefined;

  let count = 0;
  this.children.forEach((child, index) => {
    if (child instanceof Element) {
      count += child.count; // 加上子节点所有的子节点数量
    } else {
      children[index] = '' + child;
    }
    count++;
  });
  this.count = count; // 当前节点所拥有的子节点数
}
// 渲染至页面， 与react render 方法不一样
Element.prototype.render = function() {
  let el = document.createElement(this.tagName);
  let props = this.props;
  setAttrs(el, props); // 设置属性
  this.children.forEach(child => {
    let childEl = child instanceof Element ? child.render() : document.createTextNode(child);
    el.appendChild(childEl);
  });
  return el;
};
function setAttrs(dom, props) {
  for (let [propName, propValue] in Object.keys(props)) {
    el.setAttribute(propName, propValue); // 通过setAttribute设置元素属性
    let v = props[k];
    if (propName === 'className') {
      dom.setAttribute('class', propValue);
      return;
    }
    if (propName === 'style') {
      if (typeof propValue === 'object') {
        for (let i in propValue) {
          dom.style[i] = propValue[i];
        }
      }
      if (typeof propValue === 'string') {
        dom.style.cssText = propValue;
      }
      return;
    }
    if (propName.startsWith('on')) {
      let capture = propName.indexOf('Capture') !== -1; // 是否在冒泡或捕获阶段执行
      dom.addEventListener(propName.substring(2).toLowerCase(), propValue, capture);
      return;
    }
    dom.setAttribute(propName, propValue);
  }
}

// 在实际的代码中，会对新旧两棵树进行一个深度优先的遍历，这样每一个节点就会有一个唯一的标记
// 在深度优先遍历的时候，每遍历到一个节点就把该节点和新的树进行对比，如果有差异的话就记录到一个对象里面
function diff(oldDomTree, newDomTree) {
  let index = 0; // 深度优先遍历时，每个节点都有一个index
  let patches = {}; // 记录差异，遍历到每个节点都需要对比，找到差异则记录
  dfs(oldDomTree, newDomTree, index, patches); // 开始深度优先遍历
  return patches; // 最终diff算法返回的是一个两棵树的差异
}

// 对两颗树进行深度优先遍历
function dfs(oldNode, newNode, index, patches) {
  let currentPatch = []; // 当前节点差异
  if (newNode === null) {
    // 节点被移除
  } else if (isType(oldNode) === 'String' && isType(newNode) === 'String') {
    // 文本节点
    if (newNode !== oldNode) {
      // 文本不同的情况
      currentPatch.push({ type: 'text', content: newNode });
    }
  } else if (oldNode.tagName === newNode.tagName && oldNode.key === newNode.key) {
    // 节点类型相同
    let props = diffProps(oldNode.props, newNode.props);
    if (props) {
      // 属性有变化
      currentPatch.push({ type: 'props', props: props });
    }
    // 比较子节点
    diffChildren(oldNode.children, newNode.children, index, patches, currentPatch);
  } else {
    // 节点类型不同则直接替换
    currentPatch.push({ type: 'replace', node: newNode });
  }
  currentPatch.length ? (patches[index] = currentPatch) : null;
}
// 比较子节点
function diffChildren(oldChildren, newChildren, index, patches, currentPatch) {
  let diffs = reorder(oldChildren, newChildren);
  let moves = diffs.moves;
  newChildren = diffs.children;
  if (moves.length > 0) {
    // 子节点有变化
    currentPatch.push({ type: 'reorder', moves: diffs.moves });
  }
  let leftNode = null;
  let currentNodeIndex = index;
  oldChildren.forEach((child, index) => {
    // 深度优先遍历时给节点 唯一编号
    let newChild = newChildren[index];
    currentNodeIndex =
      leftNode && leftNode.count ? currentNodeIndex + leftNode.count + 1 : currentNodeIndex + 1;
    dfs(child, newChild, currentNodeIndex, patches);
    leftNode = child;
  });
}
// 比较属性
function diffProps(oldProps, newProps) {
  let patch = {};
  let count = 0;
  // 先遍历oldProps 查看是否存在删除的属性
  for (let key in oldProps) {
    if (oldProps[key] !== newProps[key]) {
      patch[key] = newProps[key]; // 有可能是undefined => 新节点删除了该属性
      count++;
    }
  }
  for (let key in newProps) {
    if (!oldProps.hasOwnProperty(key)) {
      patch[key] = newProps[key];
      count++;
    }
  }

  if (count === 0) return null;
  return patch;
}
// 更新dom
function patch(node, patches) {
  let index = 0;
  dfsDom(node, index, patches);
}
function dfsDom(node, index, patches) {
  let currentPatch = patches[index];
  node.childNodes &&
    dom.childNodes.forEach((child, index) => {
      dfsDom(child, ++index, patches);
    });
  if (currentPatch.length > 0) {
    // 当前节点有变化
    doPatch(node, currentPatch);
  }
}
function doPatch(node, currentPatches) {
  currentPatches.forEach(patch => {
    switch (patch.type) {
      case 'props':
        setProps(node, patch.props);
        break;
      case 'text':
        node.textContent = patch.content;
        break;
      case 'replace':
        let newNode =
          patch.node instanceof Element
            ? patch.newNode.render()
            : document.createTextNode(patch.newNode);
        node.parentNode.replaceChild(newNode, node);
        break;
      case 'reorder':
        reorderChildren(node, currentPatches.moves);
        break;
      default:
        throw new Error(`UnKnow patch type ${patch.type}`);
    }
  });
}
// 更新属性
function setProps(node, props) {
  for (let key in props) {
    if (!props[key]) {
      // 删除属性
      node.removeAttribute(key);
      Reflect.deleteProperty(props, key);
    }
  }
  setAttrs(node, props);
}

function reorderChildren(node, moves) {
  let nodeList = Array.prototype.slice.call(node.childNodes, 0);
  let maps = {};
  nodeList.forEach(child => {
    if (child.nodeType === 1) {
      // 元素节点
      let key = child.getAttribute('key');
      if (key) {
        maps[key] = key;
      }
    }
  });
  moves.forEach(move => {
    let index = move.index;
    if (move.type === 0) {
      // 删除
      if (nodeList[index] === node.childNodes[index]) {
        // 可能插入时已被删除
        node.removeChild(node.childNodes[index]);
      }
      nodeList.splice(index, 1);
    } else if (move.type === 1) {
      // 插入
      let insertNode = maps[move.item.key]
        ? maps[move.item.key] // 重用node
        : typeof move.item === 'object'
        ? move.item.render()
        : document.createTextNode(move.item);
      nodeList.splice(index, 0, insertNode);
      node.insertBefore(insertNode, node.childNodes[index] || null); // 若引用的节点为文档中现有的节点，则会移动
    }
  });
}

// list-diff算法
// https://github.com/livoras/list-diff/blob/master/lib/diff.js
var oldList = [{ key: 'a' }, { key: 'b' }, { key: 'c' }, { key: 'd' }, { key: 'e' }];
var newList = [{ key: 'c' }, { key: 'a' }, { key: 'b' }, { key: 'e' }, { key: 'f' }];
//            [{key: 'a'},{key: 'b'},{key: 'c'}, null, {key: 'e'}]
// c , a, b, c? e, f
// type 0 表示移除, type 1 表示插入
//moves: [
//    {index: 3, type: 0},
//    {index: 0, type: 1, item: {id: "c"}},
//    {index: 3, type: 0},
//    {index: 4, type: 1, item: {id: "f"}}
//]

function reorder(oldList, newList) {
  let newIndexs = keyIndex(newList);
  let newKeys = newIndexs.keys; // { c: 0, a: 1, e: 3, f: 4 }
  let newFree = newIndexs.free; // [2]
  if (newFree.length === newList.length) {
    // 所有新增元素均未设置key
    return {
      children: newList,
      moves: [],
    };
  }
  let oldIndexs = keyIndex(oldList);
  let oldKeys = oldIndexs.keys; // { a: 0, b: 1, c: 2, e: 4 }
  let oldFree = oldIndexs.free; // [3]
  if (oldFree.length === oldList.length) {
    // 所有旧元素均未设置key
    return {
      children: newList,
      moves: [],
    };
  }
  let children = [];
  let freeIndex = 0;
  let freeCount = newFree.length;

  for (let i = 0; i < oldList.length; i++) {
    let oldItem = oldList[i]; // { key: a } {key: "b"}, {}
    let itemIndex;
    if (oldItem.key) {
      if (newKeys.hasOwnProperty(oldItem.key)) {
        // 新列表中存在
        itemIndex = newKeys[oldItem.key]; // 1
        children.push(newList[itemIndex]); // [{ key: 'a' },{key: 'b'}, { key: 'c' }, null, { key: 'e' }, { key: 'f' }]
      } else {
        // 删除
        children.push(null);
      }
    } else {
      if (freeIndex < freeCount) {
        itemIndex = newFree[freeIndex++];
        children.push(newList[itemIndex]); // [{ key: 'a' }, { key: 'b' }, { key: 'c' }, {}]
      } else {
        newChildren.push(null);
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

  let simulateList = children.slice();
  let simulateIndex = 0;
  let simulateItem;
  let moves = [];

  let i = 0;
  // 删除null节点
  while (i < simulateList.length) {
    if (simulateList[i] === null) {
      remove(i);
      removeSimulate(i);
    } else {
      i++;
    }
  }
  let j = 0;
  let k = 0;
  for (; j < newList.length; ) {
    let item = newList[j]; // {key: c} { key: a}
    let simulateItem = simulateList[k]; // {key: a} { key: b } {key: c}

    if (simulateItem) {
      // 如果存在则比较
      if (item.key === simulateItem.key) {
        // 相同则直接跳过比较下一个节点
        k++;
      } else {
        if (!oldKeys.hasOwnProperty(item.key)) {
          // 如果不存在则直接插入
          insert(j, item);
        } else {
          let nextKey = (simulateList[k + 1] && simulateList[k + 1].key) || undefined;
          if (nextKey === item.key) {
            remove(j);
            removeSimulate(k);
            k++;
          } else {
            insert(j, item);
          }
        }
      }
    } else {
      insert(j, item);
    }
    j++;
  }
  let len = simulateList.length - k;
  while (k++ < simulateList.length) {
    len--;
    remove(j + len);
  }

  // 删除节点
  function remove(index) {
    moves.push({ index, type: 0 });
  }
  function removeSimulate(index) {
    simulateList.splice(index, 1);
  }
  // 添加 插入操作
  function insert(index, item) {
    moves.push({ type: 1, item, index });
  }

  // 获取各元素对应的位置
  function keyIndex(list) {
    let keys = {};
    let free = [];
    for (let i = 0, len = list.length; i < len; i++) {
      let child = list[i];
      if (child.key) {
        keys[child.key] = i;
      } else {
        free.push(i);
      }
    }
    return {
      keys,
      free,
    };
  }
  return {
    moves,
    children,
  };
}

/*
React 和 Vue 的 diff 时间复杂度从 O(n^3) 优化到 O(n) ，那么 O(n^3) 和 O(n) 是如何计算出来的？
首先明白O(n^3) 是怎么来的，
关于Edit Distance(最小编辑距离)：
    指两个字符串之间，由一个转成另一个所需 的最少编辑次数，允许的编辑操作包括将一个字符替换成另一个字符，插入一个字符，删除一个字符。
*/
/*
假设要求s3与s4两个字符串之间的最小编辑距离，有下面两种情况：

如果s3与s4的结尾字符相同，那么答案等于s3与s4都去掉结尾字符以后的最小编辑距离（子问题）
如果s3与s4的结尾字符不同，那么先不管前面的那些字符，如何编辑s3使得两个字符串的结尾字符相同呢？测试几个例子能知道，结尾字符最终相同只能有以下3种原因：

向s3后面拼接s4的结尾字符。此时，原始s3与s4的最小编辑距离=1+拼接以后的最小编辑距离

删除s3的结尾字符（可能删除以后结尾字符还是不同，不过没关系，这是子问题要处理的事情）。此时，原始s3与s4的最小编辑距离=1+删除以后的最小编辑距离

将s3的结尾字符替换成了s4的结尾字符。此时，原始s3与s4的最小编辑距离=1+替换以后的最小编辑距离
除了以上三种手段以外，不管你如何对s3的前面字符如何增加、删除、替换，都不能让结尾字符相同。
*/
/**
 * @param {string} word1
 * @param {string} word2
 * @return {number}
 */
var minDistance = function(word1, word2) {
  let n = word1.length;
  let m = word2.length;
  if (n * m === 0) {
    return n + m;
  }
  let d = Array.from({ length: n + 1 }, () => new Array(m + 1)); // 新建二维数组
  for (let i = 0; i <= n; i++) {
    d[i][0] = i;
  }
  for (let j = 0; j <= m; j++) {
    d[0][j] = j;
  }
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        d[i][j] = d[i - 1][j - 1];
      } else {
        let n1 = d[i][j - 1] + 1; // 往word1后拼接word2中最后的字符
        let n2 = d[i - 1][j - 1] + 1; // 将word1最后的字符替换为word2中最后的字符
        let n3 = d[i - 1][j] + 1; // 删除word1最后的字符
        d[i][j] = Math.min(n1, n2, n3);
      }
    }
  }
  return d[n][m];
};

// https://zhuanlan.zhihu.com/p/20346379    --React 源码剖析系列 － 不可思议的 react diff
// https://github.com/livoras/blog/issues/13
// https://www.infoq.cn/article/react-dom-diff/  --虚拟 DOM Diff 算法解析
