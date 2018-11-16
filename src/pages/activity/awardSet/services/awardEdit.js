import request from '../../../../utils/async/request';
//import qs from 'qs';

export function Submit( params ) {
	return request(`${window.BASE_URL}/ac-cms/prize-info/${params.id}`, {
		method : 'PUT',
		headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
	});
}
