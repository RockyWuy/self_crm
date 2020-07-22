/*
 * @Author: rockyWu
 * @Date: 2020-06-17 15:40:14
 * @Description:
 * @LastEditors: rockyWu
 * @LastEditTime: 2020-07-10 14:59:44
 */
// 给定两个数组，编写一个函数来计算交集
let nums1 = [1, 2, 2, 1];
let nums2 = [2, 2];

function intersection(nums1, nums2) {
  return [...new Set(nums1.filter(item => nums2.includes(item)))];
}

function intersection(nums1, nums2) {
  let map1 = makeCountMap(nums1);
  let map2 = makeCountMap(nums2);
  let res = [];
  for (let num of map1.keys()) {
    const count1 = map1.get(num);
    const count2 = map2.get(num);

    if (count2) {
      const pushCount = Math.max(count1, count2);
      for (let i = 0; i < pushCount; i++) {
        res.push(num);
      }
    }
  }
  return res;
}

function makeCountMap(nums) {
  let map = new Map();
  for (let i = 0; i < nums.length; i++) {
    let num = nums[i];
    let count = map.get(num);
    if (count) {
      map.set(num, count + 1);
    } else {
      map.set(num, 1);
    }
  }
  return map;
}

intersection(nums1, nums2);

//设计和实现一个LRU（最近最少使用）缓存机制
function LRUCache(capacity) {
  this.cache = new Map();
  this.capacity = capacity;
}

LRUCache.prototype.get = function(key) {
  if (this.cache.has(key)) {
    // 存在即更新
    let temp = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, temp);
    return temp;
  }
  return -1;
};

LRUCache.prototype.put = function(key, value) {
  if (this.cache.has(key)) {
    // 存在即更新 删除后加入
    this.cache.delete(key);
  } else if (this.cache.size >= this.capacity) {
    // 不存在即加入
    // 缓存超过最大值，则移除最近没使用的
    this.cache.delete(this.cache.keys().next().value);
  }
  this.cache.set(key, value);
};

// 编写一个函数计算多个数组的交集
function intersection(...args) {
  if (args.length === 0) {
    return [];
  }
  if (args.length === 1) {
    return args[0];
  }
  return [
    ...new Set(
      args.reduce((result, arg) => {
        return result.filter(item => arg.includes(item));
      })
    ),
  ];
}
let arrs1 = [1, 2, 3, 4];
let arrs2 = [2, 4, 5];
let arrs3 = [3, 4, 6];
intersection(arrs1, arrs2, arrs3);

// 判断一个单链表是否有环
head = [3, 2, 0, -4];

// 标志法
// 给每个已遍历过的节点加标志位，遍历链表，当出现下一个节点已被标志时，则证明单链表有环
function hasCycle(head) {
  while (head) {
    if (head.flag) return true;
    head.flag = true;
    head = head.next;
  }
  return false;
}

// 利用 JSON.stringify() 不能序列化含有循环引用的结构
function hasCycle(head) {
  try {
    JSON.stringify(head);
    return false;
  } catch (err) {
    return true;
  }
}

// 快慢指针（双指针法）
// 设置快慢两个指针，遍历单链表，快指针一次走两步，慢指针一次走一步，如果单链表中存在环，则快慢指针终会指向同一个节点，否则直到快指针指向 null 时，快慢指针都不可能相遇
function hasCycle(head) {
  if (!head || !head.next) {
    return false;
  }
  let fast = head.next.next;
  let slow = head;
  while (fast !== slow) {
    if (!fast || !fast.next) return false;
    fast = fast.next.next;
    slow = slow.next;
  }
  return true;
}

// 有效的括号
// 给定一个只包括 '(' ，')' ，'{' ，'}' ，'[' ，']' 的字符串，判断字符串是否有效
// 有效字符串需满足：

// 左括号必须用相同类型的右括号闭合。
// 左括号必须以正确的顺序闭合。
// 注意空字符串可被认为是有效字符串
function isValid(s) {
  let map = {
    '[': ']',
    '(': ')',
    '{': '}',
  };
  let stack = [];
  for (let i = 0; i < s.length; i++) {
    if (map[s[i]]) {
      stack.push(s[i]);
    } else if (s[i] !== map[stack.pop()]) {
      return false;
    }
  }
  return stack.length === 0;
}

// 删除字符串中的所有相邻重复项
function removeDuplicates(S) {
  let stack = [];
  for (c of S) {
    let prev = stack.pop();
    if (prev !== c) {
      stack.push(prev);
      stack.push(c);
    }
  }
  return stack.join('');
}

// 斐波那契数列
function fibonacci(n) {
  let n1 = 1;
  let n2 = 1;
  for (let i = 2; i < n; i++) {
    [n1, n2] = [n2, n1 + n2];
  }
  return n2;
}

function fibonacci(n) {
  let obj = { 1: 1, 2: 1 };
  for (let i = 3; i <= n; i++) {
    obj[i] = obj[i - 1] + obj[i - 2];
  }
  return obj[n];
}

function fibonacci(n) {
  let n1 = 1;
  let n2 = 1;
  let sum;
  for (let i = 2; i < n; i++) {
    sum = n1 + n2;
    n1 = n2;
    n2 = sum;
  }
  return sum;
}

// 1.给定一个数组[{key: 1, name: 'a'}, { key: 1, name: 'b' }, { key: 2, name: 'c'}]
// 删除其中 key 为1 的元素

// 2.写一个函数，可以同时实现这四种，如果没法同时实现四种，看看最多可以同时实现几种
CodingMan('Peter'); //'Hi this is Peter'
CodingMan('Peter')
  .sleep(3)
  .eat('dinner'); //'Hi this is Peter' 等待3秒 'Eat dinner'
CodingMan('Peter')
  .eat('dinner')
  .eat('supper'); //'Hi this is Peter' 'dinner' 'Eat sipper'
CodingMan('Peter')
  .sleepFirst(5)
  .eat('supper'); //等待5秒 'Wake up after 5s' 'Hi this is Peter' 'Eat supper'

function Person(name) {
  let queue = [];

  let obj = {
    next: function() {
      let fn = queue.shift();
      !!fn && fn();
    },

    eat: function(food) {
      queue.push(() => {
        console.log(`I like eat ${food}`);
        this.next();
      });
      return this;
    },

    sleep: function(interval) {
      queue.push(() => {
        console.log(`sleep ${interval}s`);
        setTimeout(() => {
          this.next();
        }, 1000 * interval);
      });

      return this;
    },
  };

  setTimeout(() => {
    console.log(`I am ${name}`);
    obj.next();
  }, 0);

  return obj;
}

Person('rocky')
  .eat('tomato')
  .sleep(2)
  .eat('noodle');

// 无重复字符的最长子串
// 给定一个字符串，请你找出其中不含有重复字符的，最长子串的长度
let lengthOfLongestSubstring = function(str) {
  let n = str.length;
  // 滑动窗口为s[left...right]
  let left = 0;
  let right = -1;
  let freqMap = {}; // 记录当前子串中下标对应的出现频率
  let max = 0; // 找到的满足条件子串的最长长度

  while (left < n) {
    let nextLetter = str[right + 1];
    if (!freqMap[nextLetter] && nextLetter !== undefined) {
      freqMap[nextLetter] = 1;
      right++;
    } else {
      freqMap[str[left]] = 0;
      left++;
    }
    max = Math.max(max, right - left + 1);
  }

  return max;
};

// 深度遍历
var root = {
  val: 1,
  left: {
    val: 2,
    left: {
      val: 4,
    },
    right: {
      val: 5,
    },
  },
  right: {
    val: 3,
  },
};

function binaryTreePaths(root) {
  var res = [];
  if (!root) return res;

  if (!root.left && !root.right) {
    return [`${root.val}`];
  }

  let leftPaths = binaryTreePaths(root.left);
  let rightPaths = binaryTreePaths(root.right);

  leftPaths.forEach(leftPath => {
    res.push(`${root.val}-${leftPath}`);
  });

  rightPaths.forEach(rightPath => {
    res.push(`${root.val}-${rightPath}`);
  });

  return res;
}

binaryTreePaths(root); // ["1-2-4", "1-2-5", "1-3"]

// 排列组合是一个很经典的算法，也是对递归回溯法的一个实践运用
var names = ['iPhone X', 'iPhone XS', 'sss', 'aaa'];

var colors = ['黑色', '白色'];

var storages = ['64g', '256g'];

function combine(...args) {
  let res = [];
  let length = args.length;

  function helper(chunkIndex, prev) {
    let chunk = args[chunkIndex];
    let isLast = chunkIndex === args.length - 1;

    for (let val of chunk) {
      console.log('val', prev, val);
      let cur = prev.concat(val);
      if (isLast) {
        res.push(cur);
      } else {
        helper(chunkIndex + 1, cur);
      }
    }
  }

  helper(0, []);
  console.log('res', res);
  return res;
}

combine(names, colors, storages);
