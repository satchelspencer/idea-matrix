import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import _ from 'lodash';
import { connect } from 'react-redux';
import ui from 'redux-ui';

import Editor from './editor';
import AddTopic from './addTopic';

const styles = StyleSheet.create({
	editor : {
		position : 'absolute',
		left : 0,
		width : '100%',
		height : '100%',
		overflow : 'hidden',
		fontFamily : 'sans-serif',
		background : 'hsla(0, 0%, 73%, 0.87)',
		transition : '0.3s all',
		display : 'flex',
		flexDirection : 'column',
		zIndex : 1000
	},
	head : {
		height : 100,
		display : 'flex',
		justifyContent : 'space-between',
		alignItems : 'center',
		fontSize : 25,
		background : 'white',
		paddingLeft : 50
	},
	close : {
		cursor : 'pointer',
		height : 100,
		fontSize : 50,
		lineHeight : '90px',
		textAlign : 'center',
		width : 100,
		':hover' : {
			color : 'grey'
		}
	},
	body : {
		flex : 1,
		padding : 30,
		display : 'flex',
		flexDirection : 'column',
		justifyContent : 'center'
	}
})

const Popup = ui({state : {
	value : null
}})(({
	ui, updateUI, resetUI,
	dispatch,
	state
}) => (
	<div 
		className={css(styles.editor)}
		style={{
			transform : `translateY(${state.open?0:'100%'})`
		}}
	>
		<div className={css(styles.head)}>
			<div>{state.params.head}</div>
			<div 
				className={css(styles.close)}
				onClick={() => dispatch({type : 'CLOSE_POPUP'}) && resetUI()}
			>&times;</div>
		</div>
		<div className={css(styles.body)}>
			{state.params.editor && <Editor params={state.params}/>}
			{state.params.addTopic && <AddTopic/>}
		</div>
	</div>
))
export default connect(
	state => ({
		state : state.popup
	})
)(Popup);
