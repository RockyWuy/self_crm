/*
 * @Author: rockyWu
 * @Date: 2020-07-20 18:49:34
 * @Description:
 * @LastEditors: rockyWu
 * @LastEditTime: 2020-07-20 18:49:58
 */
import React, { createContext, useState } from 'react';
import ReactDOM from 'react-dom';

const { Provider, Consumer } = createContext();

class AliveScope extends React.Component {
  nodes = {};
  state = {};

  keep = (id, children) => {
    return new Promise(resolve => {
      // if (this.state[id]) {
      //   resolve(this.nodes[id]);
      //   return;
      // }
      this.setState(
        {
          [id]: { id, children },
        },
        () => {
          resolve(this.nodes[id]);
        }
      );
    });
  };

  render() {
    return (
      <Provider value={this.keep}>
        {this.props.children}
        {Object.values(this.state).map(({ id, children }) => {
          return (
            <div
              key={id}
              ref={node => {
                this.nodes[id] = node;
              }}
            >
              {children}
            </div>
          );
        })}
      </Provider>
    );
  }
}

const withScope = WrappedComponent => props => {
  return <Consumer>{keep => <WrappedComponent {...props} keep={keep} />}</Consumer>;
};

// @withScope
class KeepAlive1 extends React.Component {
  constructor(props) {
    super(props);
    this.init(props);
  }

  init = async ({ id, children, keep }) => {
    const realContent = await keep(id, children);
    this.placeholder.appendChild(realContent); // 元素移动
  };

  render() {
    return (
      <div
        ref={node => {
          this.placeholder = node;
        }}
      />
    );
  }
}

const KeepAlive = withScope(KeepAlive1);

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      count: {count}
      <button onClick={() => setCount(count => count + 1)}>add</button>
    </div>
  );
}

function App() {
  const [show, setShow] = useState(true);
  return (
    <div>
      <button onClick={() => setShow(show => !show)}>Toggle</button>
      <p>无 KeepAlive</p>
      {show && <Counter />}
      <p>有 KeepAlive</p>
      {show && (
        <KeepAlive id="Test">
          <Counter />
        </KeepAlive>
      )}
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(
  <AliveScope>
    <App />
  </AliveScope>,
  rootElement
);
