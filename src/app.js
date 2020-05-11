/*
 * @Author: rockyWu
 * @Date: 2018-11-12 12:02:05
 * @Description:
 * @LastEditors: rockyWu
 * @LastEditTime: 2020-05-11 17:54:15
 */
export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
      console.error(err.message);
    },
  },
};
