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
		background : 'hsla(0, 0%, 100%, 0.93)',
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
		paddingLeft : 50,
		borderBottom : '1px solid #d6d6d6'
	},
	close : {
		cursor : 'pointer',
		height : 100,
		fontSize : 35,
		lineHeight : '90px',
		textAlign : 'center',
		':hover' : {
			color : 'grey'
		},
		marginRight : 40
	},
	body : {
		flex : 1,
		padding : 30,
		display : 'flex',
		flexDirection : 'column',
		justifyContent : 'center',
		overflow : 'scroll'
	}
})

const Popup = ui({state : {
	value : null,
	editorState : null
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
				onClick={() => {
					if(ui.editorState) dispatch({
						type : 'SET_IDEA',
						cell : ui.editorState.cell,
						value : ui.editorState.ideas
					});
					dispatch({type : 'CLOSE_POPUP'});
					resetUI();
				}}
			>{window.location.hash?'save':'close'}</div>
		</div>
		<div className={css(styles.body)}>
			{state.params.editor && <Editor params={state.params} onUpdate={state => updateUI({editorState : state})}/>}
			{state.params.addTopic && <AddTopic/>}
		</div>
	</div>
))
export default connect(
	state => ({
		state : state.popup
	})
)(Popup);
