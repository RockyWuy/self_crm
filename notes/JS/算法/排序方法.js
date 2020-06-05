/*二分查找法*/
let list = [];
for (let i = 0; i < 100; i++) {
  list.push(i);
}

function binarySearch(list, item) {
  let low = 0;
  let high = list.length - 1;
  while (low <= high) {
    let mid = parseInt((low + high) / 2);
    //let mid = Math.floor(( low + high ) / 2);
    let guess = list[mid];
    if (guess === item) {
      return mid;
    }
    if (guess > item) {
      high = --mid;
    } else {
      low = ++mid;
    }
  }
  return null;
}

binarySearch(list, 1);

/*选择排序法*/
//双重循环 O(n*n)

/*递归*/
//递归的方法 给数组求和
function sumLoop(arrs) {
  //栈溢出
  if (arrs.length === 0) {
    return 0;
  }
  let first = arrs.shift();
  return first + sumLoop(arrs);
}
//循环的方法 给数组求和
function sum(arrs) {
  let total = 0;
  for (let i = 0, length = arrs.length; i < length; i++) {
    total += arrs[i];
  }
  return total;
}
//函数调用栈, 首先一个个压入调用栈, 之后一个个调用弹出

/*快速排序*/
//O(nlogn)
let arrs = [32, 53, 1, 243, 634, 21, 34, 67, 87, 5, 3];
function quickSort(arrs) {
  if (arrs.length < 2) {
    return arrs;
  }
  let pivot = arrs.shift();
  let less = [],
    greater = [];
  for (let i = 0; i < arrs.length; i++) {
    if (pivot > arrs[i]) {
      less.push(arrs[i]);
    } else {
      greater.push(arrs[i]);
    }
  }
  return [...quickSort(less), pivot, ...quickSort(greater)]; // quickSort(less).concat(pivot).concat(quickSort(greater))
}
console.log(quickSort(arrs));

//队列 : 先进先出; 栈 : 先进后出
//散列表 : 键值对, 使用散列函数; 输入想同的值总是得到固定的数字, 随即存到数组中; 即可快速查出结果
//js中的对象即是散列表实现的一种; hash数组

//广度优先搜索
//查找A到B的路径, 而且找到的是最短路径
let graph = {};
graph['you'] = ['alice', 'bob', 'claire'];
graph['bob'] = ['anuj', 'peggy'];
graph['alice'] = ['peggy'];
graph['claire'] = ['thom', 'jonny'];
graph['anuj'] = [];
graph['peggy'] = [];
graph['thom'] = [];
graph['jonny'] = [];

function person_is_seller(name) {
  if (name === 'anuj') {
    return true;
  }
  return false;
}

function search(name) {
  let search_queue = [];
  let searched = [];
  search_queue = graph[name];
  while (search_queue.length > 0) {
    let person = search_queue.shift();
    if (searched.indexOf(person) == -1) {
      if (person_is_seller(person)) {
        console.log(person + ' is a mango seller');
      } else {
        search_queue = [...search_queue, ...graph[person]];
        searched.push(person);
      }
    }
  }
}

//[1,1,1,2,2,2,3,3] => [{1,2,3},{1,2,3},{1,2}]
let totalWeekData = [];
for (let i = 0, length = dataList.length; i < length; i++) {
  //将后台数据 封装周模式
  let dataItem = dataList[i];
  let count = 0;
  for (let j = 0; j < count + 1; j++) {
    if (!totalWeekData[count]) {
      //每次循环 数组内所有元素 存在着跳过, 不存在则新建
      totalWeekData[count] = {};
    }
    if (!totalWeekData[j][dataItem]) {
      totalWeekData[count][dataItem] = dataItem;
      break;
    } else {
      count++;
    }
  }
}
