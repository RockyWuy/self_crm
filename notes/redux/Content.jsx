/*
* @author yhWu
* Date at 2018/07/31
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ThemeSwitch from './ThemeSwitch';

class Content extends Component{
	static contextTypes = {
		store : PropTypes.object
	}

	constructor(props){
		super(props);
		this.state = {
			themeColor : ''
		}
	}

	componentWillMount(){
		const { store } = this.context;
		const state = store.getState();
		this.setState({ themeColor : state.themeColor })
	}

	componentDidMount(){

	}

	render(){
		return (
			<div>
				<p style = {{ color : this.state.themeColor }} >this is content</p>
				<ThemeSwitch />
			</div>
		)
	}
}

export default Content;
