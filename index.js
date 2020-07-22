/*
 * @Author: rockyWu
 * @Date: 2020-07-04 13:56:39
 * @Description:
 * @LastEditors: rockyWu
 * @LastEditTime: 2020-07-04 14:02:22
 */
const buffer1 = Buffer.from('geekbang');
const buffer2 = Buffer.from([1, 2, 3]);

const buffer3 = Buffer.alloc(20);

console.log(buffer1);
console.log(buffer2);
console.log(buffer3);

buffer2.writeInt8(12, 1);
console.log(buffer2);
