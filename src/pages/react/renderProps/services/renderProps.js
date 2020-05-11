import request from '../../../../utils/async/request';
import qs from 'qs';

export function GetAwardList(params) {
  return request(`${window.BASE_URL}/ac-cms/prize-info?${qs.stringify(params)}`, {
    method: 'get',
  });
}
