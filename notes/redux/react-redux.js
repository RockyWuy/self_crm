/*
 * @Author: rockyWu
 * @Date: 2018-12-30 11:32:00
 * @Description:
 * @LastEditors: rockyWu
 * @LastEditTime: 2020-05-19 17:01:48
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

//connect为高阶组件; 将组件与state结合
export function connect(mapStateToProps, mapDispatchToProps) {
  return WrappedComponent => {
    class Connect extends Component {
      // 声明需要使用的Context属性
      static contextTypes = {
        store: PropTypes.object,
      };

      constructor(props) {
        super(props);
        this.state = {
          allProps: {},
        };
      }

      componentWillMount() {
        const { store } = this.context;
        this._updateProps();
        store.subscribe(() => this._updateProps());
      }

      _updateProps() {
        const { store } = this.context;
        let stateProps = mapStateToProps ? mapStateToProps(store.getState(), this.props) : {};
        let dispatchProps = mapDispatchToProps
          ? mapDispatchToProps(store.dispatch, this.props)
          : {};
        this.setState({
          allProps: {
            ...stateProps,
            ...dispatchProps,
            ...this.Props,
          },
        });
      }

      render() {
        return <WrappedComponent {...this.state.allProps} />;
      }
    }

    return Connect;
  };
}

export class Provider extends Component {
  static propTypes = {
    store: PropTypes.object,
    children: PropTypes.any,
  };

  // 声明Context对象属性
  static childContextTypes = {
    store: PropTypes.object,
  };

  // 返回Context对象，方法名是约定好的
  getChildContext() {
    return {
      store: this.props.store,
    };
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}
