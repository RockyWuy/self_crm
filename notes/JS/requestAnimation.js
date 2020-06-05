/*
 * @Author: rockyWu
 * @Date: 2020-05-28 09:40:44
 * @Description:
 * @LastEditors: rockyWu
 * @LastEditTime: 2020-05-28 09:50:20
 */

// requestAnimation 与 setTimeout 的区别?
// 1、 setTimeout 循环调用 会有 4ms 的延迟, 还有个最大值 为 2147483647
// 2、后台页签中， requestAnimationFrame 会自动停止，节省 cpu 资源； 而 setTimeout 会以不低于 1000ms 的频率执行
// 3、setTimeout 会出现掉帧现象，因为与 屏幕刷新频率不一致
// 4、setTimeout 与 requestAnimationFrame 都会出现延迟的现象， 只是 requestAnimation 的所有事件都会在一个刷新周期内全部执行
