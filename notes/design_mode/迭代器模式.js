/*
 * @Author: rockyWu
 * @Date: 2018-12-30 11:28:44
 * @Description:
 * @LastEditors: rockyWu
 * @LastEditTime: 2020-06-02 14:59:04
 */

//迭代器模式是指提供一种方法顺序访问一个聚合对象中的各个元素, 而又不需要暴露该对象的内部表示。
//迭代器模式可以把迭代的过程从业务逻辑中分离出来, 在使用迭代器模式之后, 即使不关心对象的内部构造, 也可以按顺序访问其中的每个元素
//jquery中的迭代器
$.each([1, 2, 3], function(i, n) {
  console.log('当前下标:' + i);
  console.log('当前值为:' + n);
});
//实现each函数
function each(ary, callback) {
  for (let i = 0; i < ary.length; i++) {
    callback.call(ary[i], i, ary[i]);
  }
}
/*内部迭代器*/
//我们刚刚编写的each函数属于内部迭代器, each 函数的内部已经定义好了迭代规则, 它完全接手整个迭代过程, 外部只需要一次初始调用

/*外部迭代器*/
//外部迭代器必须显式地请求迭代下一个元素。
//外部迭代器增加了一些调用的复杂度, 但相对也增强了迭代器的灵活性, 我们可以手工控制迭代的过程或者顺序
function Iterator(obj) {
  let current = 0;
  function next() {
    current += 1;
  }
  function isDone() {
    return current >= obj.length;
  }
  function getCurrItem() {
    return obj[current];
  }
  return {
    next: next,
    isDone: isDone,
    getCurrItem: getCurrItem,
  };
}
function compare(iterator1, iterator2) {
  while (!iterator1.isDone() && !iterator2.isDone()) {
    if (iterator1.getCurrItem() !== iterator2.getCurrItem()) {
      throw new Error('iterator1和iterator2不相等');
    }
    iterator1.next();
    iterator2.next();
  }
  alert('iterator1和iterato相等');
}
let iterator1 = Iterator([1, 2, 3]);
let iterator2 = Iterator([1, 2, 3]);
compare(iterator1, iterator2);

/*迭代器模式应用举例*/
//为了得到一个upload 对象, 这个getUploadObj 函数里面充斥了try, catch以及if 条件分支。缺点是显而易见的。第一是很难阅读, 第二是严重违反开闭原则
function getUploadObj() {
  try {
    return new ActiveXObject('TXFTNActiveX.FTNUpload'); //IE 上传控件
  } catch (e) {
    if (supportFlash()) {
      // supportFlash 函数未提供
      let str = '<object type="application/x-shockwave-flash"></object>';
      return $(str).appendTo($('body'));
    } else {
      let str = '<input name="file" type="file"/>'; // 表单上传
      return $(str).appendTo($('body'));
    }
  }
}

/*重新 使用迭代器模式*/
function getActiveUploadObj() {
  try {
    return new ActiveXObject('TXFTNActiveX.FTNUpload'); //IE 上传控件
  } catch (e) {
    return false;
  }
}
function getFlashUploadObj() {
  if (supportFlash()) {
    var str = '<object type="application/x-shockwave-flash"></object>';
    return $(str).appendTo($('body'));
  }
  return false;
}
function getFormUpladObj() {
  var str = '<input name="file" type="file" class="ui-file"/>'; // 表单上传
  return $(str).appendTo($('body'));
}
function iteratorUploadObj() {
  for (let i = 0, fn; (fn = arguments[i++]); ) {
    let uploadObj = fn();
    if (uploadObj !== false) {
      return uploadObj;
    }
  }
}
let uploadObj = iteratorUploadObj(getActiveUploadObj, getFlashUploadObj, getFormUpladObj);
//重构代码之后, 我们可以看到, 获取不同上传对象的方法被隔离在各自的函数里互不干扰, try、catch 和if 分支不再纠缠在一起, 使得我们可以很方便地的维护和扩展代码
