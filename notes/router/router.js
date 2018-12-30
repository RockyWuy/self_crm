/*
* @author yhWu
* Date at 2018/07/31
* 路由配置
*/
import React, { Component } from 'react';
import { createBrowserHistory } from 'history';
//import { BrowserRouter as Router, HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import Bundle from '../utils/Bundle';

const history = createBrowserHistory();

import Layout from '../pages/layout/LayoutPage';                 //页面整体布局

/*****************route 页面*****************/
import RenderPropsPage from 'bundle-loader?lazy&name=app-[name]!../pages/react/RenderPropsPage';    //render props

const RenderPage = () => (
	<Bundle load = { RenderPropsPage }>
		{ ( RenderPage ) => <RenderPage /> }
	</Bundle>
)


let routers = {};
let listenEvents = [];

const Routers = [
	{ path : '#/login', menu : 'login', component : () => <div>login</div> },
	{ path : '#/about', menu : 'about', component : <div>about</div> }
]

listen(( pathname ) => {
	if( pathname === '#/login' ){
		console.log('login')
	}
})
listen(( pathname ) => {
	if( pathname === '#/about' ){
		console.log( 'about' );
	}
})
//监听全局
function listen( fn ){
	listenEvents.push( fn );
}

function callListens( path ){
	for( let i = 0; i < listenEvents.length; i++ ){
		listenEvents[i](path);
	}
}

//路由容器
function Router(props){
	let { className, children } = props;
	return (
		<div className = { className } >
			{ children }
		</div>
	)
}

//路由
class Route extends React.Component{
	constructor( props ){
		super( props );
		this.state = {
			renderItem : []
		}
	}

	componentDidMount(){
		this._init_route();
		window.addEventListener('load', () => this._change_route());
		window.addEventListener('hashchange', () => this._change_route())
	}

	_init_route(){
		let { path, component } = this.props;
		if( !routers[path] ){
			routers[path] = [];
		}
		routers[path].push( component );
	}

	_change_route(){
		let hash = window.location.hash;
		if( hash.indexOf('?') !== -1 ){
			hash.substring( hash, hash.indexOf('?') )
		}
		let { path } = this.props;
		//当前路由别选中时加载当前组件
		if( path === hash && !!routers[hash] && routers[hash].length > 0 ){
			let renderItem = [];
			for( let i = 0; i < routers[hash].length; i++ ){
				if( typeof routers[hash][i] === 'function' ){
					renderItem.push(routers[hash][i]());
				} else{
					renderItem.push(routers[hash][i])
				}
			}
			this.setState({ renderItem }, () => callListens( hash ) )
		} else{
			this.setState({ renderItem : [] })
		}
	}

	render(){
		let { renderItem } = this.state;
		return (
			<React.Fragment>
				{ renderItem }
			</React.Fragment>
		)
	}
}

function Menu( props ){
	let { routers } = props;
	return (
		<div>
			{ routers.length > 0 && routers.map(( item, index ) => {
				return (
					<div key = { item.path } style = {{ cursor : 'pointer' }} onClick = { () => window.location.href = item.path } >
						<a>{ item.menu }</a>
					</div>
				)
			})}
		</div>
	)
}

function MainLayout({ children }){
	return (
		<div>{ children }</div>
	)
}

class AppRouter extends Component{
	constructor( props ){
		super( props );
		this.state = {

		}
	}

	render(){
		return (
			<Router className = { 'router' }>
				<Menu routers = { Routers } />
				<MainLayout>
					{ Routers && Routers.map((item, index) => (<Route path = { item.path } component = { item.component }/>)) }
				</MainLayout>
			</Router>
		)
	}
}

export default AppRouter;

/*<Router history = { history } >
	<Switch>
		<Layout>
			<Route exact path = '/render_props' component = { RenderPage } />
		</Layout>
	</Switch>
</Router>*/
