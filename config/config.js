//配置文件
import pageRoutes from './router.config.js';

const plugins = [
    ['umi-plugin-react', {
		antd: true,
		dva: {
			hmr: true
		},
		dynamicImport: true,
		dll: true,
		routes: {
			exclude: [],
		},
		hardSource: true,
		title: 'self_crm',
    }],
]

export default {
	plugins,
	// 路由配置
	routes: pageRoutes,
	history: 'hash',
    proxy : {
		"/crm": {
			"target": "http://192.168.30.22:3000/",
			"changeOrigin": true,
			"pathRewrite": { "^/crm" : "" }
		}
	},
	"extraBabelPlugins": [
		[ "import", { "libraryName": "antd", "libraryDirectory": "es", "style": true } ]
	],
}
