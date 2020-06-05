/*
 * @Author: rockyWu
 * @Date: 2020-06-01 16:38:00
 * @Description:
 * @LastEditors: rockyWu
 * @LastEditTime: 2020-06-01 18:17:09
 */

const babel = require('@babel/core');
// const t = require('babel-types');

function a({ types: t }) {
  function BinaryExpression(path, state) {
    const node = path.node;
    let result;
    if (t.isNumericLiteral(node.left) && t.isNumericLiteral(node.right)) {
      // 根据不同操作符运算
      switch (node.operator) {
        case '+':
          result = node.left.value + node.right.value;
          break;
        case '-':
          result = node.left.value - node.right.value;
          break;
        case '*':
          result = node.left.value * node.right.value;
          break;
        case '/':
          result = node.left.value / node.right.value;
          break;
        case '**':
          let i = node.right.value;
          while (--i) {
            result = result || node.left.value;
            result = result * node.left.value;
          }
          break;
        default:
      }
    }
    // 如果上面的运算有结果的话
    if (result !== undefined) {
      // 把表达式节点替换成number字面量
      path.replaceWith(t.numericLiteral(result));
      // 向上遍历父级节点
      let parentPath = path.parentPath;
      parentPath && BinaryExpression(parentPath);
    }
  }
  return {
    visitor: {
      BinaryExpression,
    },
  };
}

const result = babel.transform('const result = 1 + 2 + 3 + 4 + 5;', {
  plugins: [a],
});

console.log(result.code); // const result = 3;

// https://juejin.im/post/5a9315e46fb9a0633a711f25
// https://juejin.im/post/5b14257ef265da6e5546b14b

class LazyMan {
  constructor(name) {
    this.quene = [];
    console.log(`i am ${name}`);
    setTimeout(() => {
      this.next();
    }, 0);
  }
  eat(value) {
    let fn = () => {
      console.log(`i am eating ${value}`);
      this.next();
    };
    this.quene.push(fn);
    return this;
  }
  sleepFirst(interval) {
    setTimeout(() => {
      this.next();
    }, interval * 1000);
    return this;
  }
  sleep(interval) {
    setTimeout(() => {}, interval * 1000);
    return this;
  }
  next() {
    let fn = this.quene.shift();
    fn && fn();
  }
}
