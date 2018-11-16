/*
* @author Rocky wu
* Date by 2018/11/12
* 路由配置文件
*/

export default [
	{
		path : '/user',
		component : '../layouts/user/UserLayout',
	},{
		path : '/',
		component : '../layouts/basic/BasicLayout',
		routes : [
			{
                path : '/',
                component : './index'
            },{
                path : '/activity',
                routes : [
                    { path : '/activity/awardSet', component : './activity/awardSet/page' }
                ]
            }
		]
	}
]
