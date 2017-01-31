import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import _ from 'lodash';
import { connect } from 'react-redux';
import ui from 'redux-ui';

const styles = StyleSheet.create({
	wrapper : {
		display : 'flex',
		flexDirection : 'column'
	},
	input : {
		flex : 1,
		border : 'none',
		fontSize : 30,
		borderRadius : 20,
		padding : 20,
		height : 64
	},
	save : {
		height : 100,
		marginTop : 30,
		background : '#e6ffec',
		color : '#848484',
		display : 'flex',
		alignItems : 'center',
		justifyContent : 'center',
		borderRadius : 20,
		fontSize : 60,
		cursor : 'pointer'
	}
})

const AddTopic = ui({state : {
	value : null
}})(({
	ui, updateUI, resetUI,
	dispatch,
	categories,
	ideas,
	params
}) => (
	<div className={css(styles.wrapper)}>
		<input 
			className={css(styles.input)} 
			value={ui.value||''}
			onChange={e => updateUI({value : e.target.value})}
		/>
		<div 
			className={css(styles.save)}
			onClick={() => dispatch({
				type : 'ADD_CAT',
				cat : ui.value
			}) && dispatch({type : 'CLOSE_POPUP'}) && resetUI()}
		>add topic</div>
	</div>
))
export default connect(
	state => ({
		categories : state.categories,
		ideas : state.ideas
	})
)(AddTopic);
