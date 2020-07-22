/*
 * @Author: rockyWu
 * @Date: 2020-07-22 10:31:04
 * @Description:
 * @LastEditors: rockyWu
 * @LastEditTime: 2020-07-22 10:47:20
 */
function shuffle(arrs) {
  if (arrs.length <= 0) return;
  for (let i = arrs.length - 1; i >= 0; i--) {
    let randomIndex = Math.floor(Math.random() * (i + 1));
    let randomItem = arrs[randomIndex];
    arrs[randomIndex] = arrs[i];
    arrs[i] = randomItem;
  }
  return arrs;
}
