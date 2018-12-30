/*
* @author yhWu
* Date at 2018/07/31
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from './react-redux'

class ThemeSwitch extends Component{
	static contextTypes = {
		store : PropTypes.object
	}

	constructor(props){
		super(props);
		this.state = {
			themeColor : ''
		}
//		this.handleSwitchColor = this.handleSwitchColor.bind( this );
	}

	/*componentWillMount(){
		const { store } = this.context;
		const state = store.getState();
		this.setState({ themeColor : state.themeColor })
	}

	componentDidMount(){

	}*/

	handleSwitchColor( color ){
		const { store } = this.context;
		this.props.dispatch({
			type : 'Change_color',
			themeColor : color
		})
	}

	render(){
		return (
			<div>
				<button
					style = {{ color : this.state.themeColor }}
					onClick = { () => this.handleSwitchColor( 'red' ) }
			 	>
					red
				</button>
				<button
					style = {{ color : this.state.themeColor }}
					onClick = { () => this.handleSwitchColor( 'blue' ) }
				>
					blue
				</button>
			</div>
		)
	}
}

const mapStateToProps = ( state ) => {
	return {
		themeColor: state.themeColor
	}
}
const mapDispatchToProps = ( dispatch ) => {
	return {
		dispatch
	}
}

ThemeSwitch = connect(mapStateToProps, mapDispatchToProps)(ThemeSwitch)

export default ThemeSwitch;
