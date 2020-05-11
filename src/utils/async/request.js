import fetch from 'dva/fetch';
import { message } from 'antd';

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  //断网
  if (!window.navigator.onLine) {
    return message.error('请检查您的网络是否连接');
  }
  //浏览器不符合标准
  //	if(!window.BrowerFlag){
  //		return;
  //	}
  if (options && options.headers && !!options.headers.isLogin) {
    //登陆请求
    return fetch(url, options)
      .then(checkStatus)
      .then(parseJSON)
      .then(ret => {
        return { ret };
      })
      .catch(err => ({ err }));
  } else {
    let userInfo =
      (!!window.localStorage.getItem('userInfo') &&
        JSON.parse(window.localStorage.getItem('userInfo'))) ||
      {};
    let accessToken = userInfo.accessToken;
    let userId = userInfo.id;
    if (!accessToken) {
      message.error('登录失效, 请重新登陆');
      window.location = '/login';
    } else {
      options = {
        ...options,
        headers: {
          ...options.headers,
          'access-token': accessToken,
          userId,
        },
      };
      return fetch(url, options)
        .then(checkStatus)
        .then(parseJSON)
        .then(ret => {
          if (ret && ret.errorCode === 102) {
            window.location = '/login';
            return { ret: { errorCode: ret.errorCode, errorMessage: '登录失效，请重新登陆' } };
          }
          return { ret };
        })
        .catch(err => ({ err }));
    }
  }
}
