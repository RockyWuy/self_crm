/************数组合并的方法******************/
//1、concat方法 js的Array对象提供了一个叫concat()方法, 连接两个或更多的数组, 并返回结果
//concat方法连接a、b两个数组后, a、b两个数组的数据不变, 同时会返回一个新的数组。这样当我们需要进行多次的数组合并时, 会造成很大的内存浪费
let a = [], b = [];
var c = a.concat(b);

//2、for循环 遍历其中一个数组, 把该数组中的所有元素依次添加到另外一个数组中
for( var i in b ){
	a.push(b[i]);
}

//3、函数的apply方法有一个特性, 那就是func.apply(obj,argv), argv是一个数组
[].push.apply( a, b );

//1) 以上3种合并方法并没有考虑过a、b两个数组谁的长度更小。
//所以好的做法是预先判断a、b两个数组哪个更大，然后使用大数组合并小数组, 这样就减少了数组元素操作的次数！
//2) 有时候我们不希望原数组（a、b）改变, 这时就只能使用concat了


/************数组去重******************/
//方法一：
//双层循环, 外层循环元素, 内层循环时比较值
//如果有相同的值则跳过, 不相同则push进数组
Array.prototype.disinct = function(){
    var arr = this;
    var result = [];
    var len = arr.length;
    for( var i = 0; i < len; i++ ){
        console.log( 'i', i )
        for( var j = i + 1; j < len; j++ ){
            console.log( i, j, 'ssssss' )
            if( arr[i] === arr[j] ){
                j = ++i;
            }
        }
        console.log( arr[i], 'lll' );
        result.push( arr[i] );
    }
    return result;
}

//方法二：利用splice直接在原数组进行操作
Array.prototype.disinct = function(){
    var arr = this;
    var result = [];
    var len = arr.length;
    for( var i = 0; i < len; i++ ){
        for( var j = i + 1; j < len; j++ ){
            if( arr[i] === arr[j] ){
                arr.splice( j, 1 );
                len--;
                j--;
            }
        }
    }
    return arr;
}

//方法三：利用对象的属性不能相同的特点进行去重
Array.prototype.disinct = function(){
    var arr = this;
    var result = [];
    var len = arr.length;
    var obj = {};
    for( var i = 0; i < len; i++ ){
        if( !obj[arr[i]] ){
            obj[arr[i]] = 1;
            result.push( arr[i] );
        }
    }
    return result;
}

//方法四：利用ES6的set
function dedupe(array){
 return Array.from(new Set(array));
}
//var arr = [2, 1, 3, 1, 2, 4];
//console.log( arr.disinct(), arr.disinct().toString() );


/*实现bind*/
Function.prototype.bind = function( context ){
  let self = this;
  let outArrs = Array.prototype.slice.call( arguments, 1 );
  return function(){
    let innerArrs = Array.prototype.slice.call( arguments );
    let finalArrs = outArrs.concat(innerArrs);
    return self.apply( context, finalArrs );
  }
}
