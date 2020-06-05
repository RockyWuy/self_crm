/*
 * @Author: rockyWu
 * @Date: 2020-05-23 13:48:48
 * @Description:
 * @LastEditors: rockyWu
 * @LastEditTime: 2020-05-23 15:58:32
 */

// ['flower', 'flow', 'flight'] 输出 'fl'
// 公共指针法
let arrs = ['flower', 'flow', 'flight'];
function maxPrefix(arrs) {
  if (!arrs || !arrs.length) return '';

  let currentIndex = 0;

  while (currentIndex < arrs[0].length) {
    const refer = arrs[0][currentIndex];
    // 是否全部匹配
    const allMatch = arrs.reduce((pre, str) => {
      return pre && str[currentIndex] === refer;
    }, true);

    if (allMatch) {
      currentIndex++;
    } else {
      break;
    }
  }

  return arrs[0].slice(0, currentIndex);
}

// 获取最大字符串 最小字符串的公共前缀
function longestCommonPrefix(strs) {
  if (strs === null || strs.length === 0) return '';
  if (strs.length === 1) return strs[0];

  let min = 0;
  let max = 0;
  for (let i = 1; i < strs.length; i++) {
    if (strs[min] > strs[i]) min = i;
    if (strs[max] < strs[i]) max = i;
  }
  for (let j = 0; j < strs[min].length; j++) {
    if (strs[min].charAt(j) !== strs[max].charAt(j)) {
      console.log(strs[min].substring(0, j));
      return strs[min].substring(0, j);
    }
  }
  // 若最小字符串完全匹配
  return strs[min];
}

// 分治策略 归并思想
// 将一个复杂的问题，分成两个或多个相似的子问题；
// 求多个字符串的最长公共前缀可以简化为 求两个字符串最长公共前缀
function longestCommonPrefix(strs) {
  if (strs === null || strs.length === 0) return '';
  return ICPrefixRec(strs);
}

function ICPrefixRec(strs) {
  let length = strs.length;
  if (length === 1) return strs[0];
  let mid = Math.floor(length / 2);
  let left = strs.slice(0, mid);
  let right = strs.slice(mid, length);

  return ICPrefixTwo(ICPrefixRec(left), ICPrefixRec(right));
}

// 求 str1 与 str2 的最长公共前缀
function lCPrefixTwo(str1, str2) {
  let j = 0;
  for (; j < str1.length && j < str2.length; j++) {
    if (str1.charAt(j) !== str2.charAt(j)) {
      break;
    }
  }
  return str1.substring(0, j);
}

// function getPre(arr){
//     let n = 0;
//     let flag = true;
//     let res = '';
//     let length = arr.length;
//     while(n >= 0 && flag){
//         let buffer = [];
//         for(let i = 0; i < length; i++){
//             let now = arr[i].charAt(n);
// //                    let now = arr[i].split('')[n];
//             if(now && (buffer.length === 0 || buffer[0] === now)){
//                 buffer.push(now);
//             }else{
//                 flag = false;
//                 break;
//             }
//             if(i === length - 1){
//                 res += buffer[0];
//             }
//         }
//         n++;
//     }
//     return res;
// }

let arr = [];
let str = '';
let startTime = 0;
let endTime = 0;
let res = '';
for (let i = 0; i < 100; i++) {
  str += 's';
}
for (let i = 0; i < 1000; i++) {
  arr.push(str);
}
startTime = new Date().getTime();
// res = getPre(arr);
//    res = maxPrefix(arr);
res = longestCommonPrefix(arr);
endTime = new Date().getTime();
console.info(res);
console.info(startTime);
console.info(endTime);
console.info(endTime - startTime);
