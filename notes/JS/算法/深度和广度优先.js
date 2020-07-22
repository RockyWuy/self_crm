/*
 * @Author: rockyWu
 * @Date: 2020-05-23 15:09:24
 * @Description:
 * @LastEditors: rockyWu
 * @LastEditTime: 2020-07-10 14:07:47
 */

// 1、写react/vue项目时为什么要在组件中写key，作用是什么？

// 2、['1', '2', '3'].map(parseInt)
['1', '2', '3'].map(function(item, index) {
  return parseInt(item, index);
});
// [1, NaN, NaN]

// 3、深度优先遍历和广度优先遍历
// 深度优先遍历是指从某个顶点出发，首先访问这个顶点，然后找出刚访问这个节点的第一个未被访问的邻结点，然后再以此邻结点为顶点，继续找它的邻结点进行访问，重复此步骤，直至所有结点都被访问完为止
// 广度优先遍历是指从某个顶点出发，首先访问这个顶点，然后找出刚访问这个节点所有未被访问的邻结点，访问完后再访问这些结点中第一个邻结点的所有结点，重复此方法，直到所有结点都被访问完为止

// 深度优先遍历的递归写法
function deepTraversal(node, nodeList = []) {
  if (node !== null) {
    nodeList.push(node);
    let childrens = node.children;
    for (let i = 0; i < childrens.length; i++) {
      deepTraversal(childrens[i], nodeList);
    }
  }
  return nodeList;
}

// 深度优先遍历的非递归写法
function deepTraversal(node) {
  let nodes = [];
  if (node !== null) {
    let stack = []; // 同时存放将来要访问的节点
    stack.push(node);
    while (stack.length !== 0) {
      let item = stack.pop(); // 正在访问的节点
      nodes.push(item);
      let childrens = item.children;
      for (let i = childrens.length - 1; i >= 0; i--) {
        // 将现在正在访问的节点的子节点存入stack, 供将来访问
        stack.push(childrens[i]);
      }
    }
  }
  return nodes;
}

// 广度优先遍历的递归写法 (栈溢出)
function wideTraversal(node) {
  let nodes = [];
  let i = 0;
  if (node !== null) {
    nodes.push(node);
    wideTraversal(node.nextElementSibling);
    node = nodes[i++];
    wideTraversal(node.firstElementChild);
  }
  return nodes;
}

// 广度优先遍历的非递归写法
function wideTraversal(node) {
  let nodes = [];
  if (node !== null) {
    let queue = [];
    queue.unshift(node);
    while (queue.length !== 0) {
      let item = queue.shift();
      nodes.push(item);
      let childrens = item.children;
      for (let i = 0; i < childrens.length; i++) {
        queue.push(childrens[i]);
      }
    }
  }
  return nodes;
}
