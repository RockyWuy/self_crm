import React from 'react';

let routers = {};
let listenEvents = [];

export function Router(props) {
  let { className, style, children } = props;
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}

//执行所有的路由事件
function callListen(path) {
  if (listenEvents && listenEvents.length > 0) {
    for (let i = 0; i < listenEvents.length; i++) {
      listenEvents[i](path);
    }
  }
}

export class Route extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      returnItem: [],
      callback: [],
    };
  }
  componentDidMount() {
    this._initRouter();
    window.addEventListener('load', () => this._changeReturn());
    window.addEventListener('hashchange', () => this._changeReturn());
  }

  _initRouter() {
    let { path, component } = this.props;
    if (!routers[path]) {
      routers[path] = [];
    }
    routers[path].push(component);
  }

  _changeReturn() {
    let hash = window.location.hash;
    //防止url中有参数干扰监听
    if (hash.indexOf('?') > -1) {
      hash = hash.substring(0, hash.indexOf('?'));
    }
    let { path } = this.props;
    //当前路由是选中路由时加载当前组件
    if (hash === path && routers[hash] && routers[hash].length > 0) {
      let renderItem = [];
      for (let i = 0; i < routers[hash].length; i++) {
        //如果组件参数的方法，则执行并push
        //如果组件参数是DOM，则直接渲染
        if (typeof routers[hash][i] === 'function') {
          renderItem.push(routers[hash][i]());
        } else {
          renderItem.push(routers[hash][i]);
        }
      }
      this.setState({ renderItem }, () => callListen(path));
    } else {
      this.setState({ renderItem: [] });
    }
  }

  render() {
    let { renderItem } = this.state;
    return <React.Fragment>{renderItem}</React.Fragment>;
  }
}

export function dispatchRouter({ path = '', query = {} }) {
  let queryStr = [];
  for (let i in query) {
    queryStr.push(i + '=' + query[i]);
  }
  window.location.href = `${path}?${queryStr.join('&')}`;
}

export function listen(fn) {
  listenEvents.push(fn);
}

//使用方法 Menu 和 MainLayout 是外层布局
import {
  Router,
  Route,
  dispatchRouter,
  listen,
} from '../../common/component/router/easy-router/EasyRouter';
listen(pathname => {
  if (pathname === '#/login') {
    console.info('进入登陆页');
  }
});

listen(pathname => {
  if (pathname === '#/abort') {
    console.info('退出登录页');
  }
});

const Routers = [
  { path: '#/login', menu: 'login', component: () => Login({ bread: '#/login' }) },
  { path: '#/abort', menu: 'abort', component: <Abort bread={'#/abort'} /> },
];

function Menu({ routers }) {
  return (
    <div>
      {routers &&
        routers.map((item, index) => {
          let { path, menu, component } = item;
          return (
            <div
              key={path}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                window.location.href = path;
              }}
            >
              <a>{menu}</a>
            </div>
          );
        })}
    </div>
  );
}

function MainLayout({ children }) {
  return <div className={styles.mainLayout}>{children}</div>;
}

import React from 'react';

class EasyRouter extends React.Component {
  render() {
    return (
      <Router className={styles.router}>
        <Menu routers={Routers} />
        <MainLayout>
          {Routers &&
            Routers.map((item, index) => <Route path={item.path} component={item.component} />)}
        </MainLayout>
      </Router>
    );
  }
}

class Router extends React.Component {}
