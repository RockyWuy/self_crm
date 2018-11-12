const plugins = [
	// ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
		antd: true,
		dva: true,
		dynamicImport: true,
		title: 'self_project',
		dll: true,
		routes: {
			exclude: [],
		},
		hardSource: true,
    }],
]

export default {
	plugins,
	history: 'hash',
}
