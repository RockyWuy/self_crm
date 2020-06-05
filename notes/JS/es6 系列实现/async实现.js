/*
 * @Author: rockyWu
 * @Date: 2020-05-21 10:54:28
 * @Description:
 * @LastEditors: rockyWu
 * @LastEditTime: 2020-05-21 17:54:08
 */

const getData = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('data');
    }, 1000);
  });

async function test() {
  const data = await getData();
  console.log('data', data);
  const data2 = await getData();
  console.log('data2', data2);
  return 'success';
}
test().then(res => console.log(res));

let gen = testG();
let dataPromsie = gen.next();
dataPromsie.then(value => {
  let dataPromise2 = gen.next(value);
  dataPromise2.then(value2 => {
    gen.next(value2);
  });
});
// 先转化为 generator 函数 非自动执行
// 执行 next 时，只是停在 yield 处，data 并无值，等到下次 next 传的参数会被作为上一个yield前面接受的值
function* testG() {
  const data = yield getData();
  console.log('data', data);
  const data2 = yield getData();
  console.log('data2', data2);
  return 'success';
}

// 具体实现
function asyncToGenerator(generatorFunc) {
  return function() {
    const gen = generatorFunc.apply(this, arguments);
    return new Promise((resolve, reject) => {
      function step(key, arg) {
        let generatorResult;
        try {
          generatorResult = gen[key](arg);
        } catch (e) {
          return reject(e);
        }
        const { value, done } = generatorResult;
        if (done) {
          return resolve(value);
        } else {
          // promise.resolve(value) 原封不动返回 value
          return Promise.resolve(value).then(
            val => {
              step('next', val);
            },
            err => {
              step('throw', err);
            }
          );
        }
      }
      step('next');
    });
  };
}
asyncToGenerator(testG)();
