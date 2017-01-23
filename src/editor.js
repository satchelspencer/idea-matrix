import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import _ from 'lodash';
import { connect } from 'react-redux';
import ui from 'redux-ui';

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
		flexDirection : 'column'
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
		flexDirection : 'column'
	},
	textarea : {
		flex : 1,
		border : 'none',
		fontSize : 30,
		borderRadius : 20,
		padding : 20
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

const Editor = ui({state : {
	value : null
}})(({
	ui, updateUI, resetUI,
	dispatch,
	categories,
	ideas,
	editing
}) => (
	<div 
		className={css(styles.editor)}
		style={{
			transform : `translateY(${editing.open?0:'100%'})`
		}}
	>
		<div className={css(styles.head)}>
			<div>{editing.cell[0]} & {editing.cell[1]}</div>
			<div 
				className={css(styles.close)}
				onClick={() => dispatch({type : 'DONE_EDITING'}) && resetUI()}
			>&times;</div>
		</div>
		<div className={css(styles.body)}>
			<textarea 
				className={css(styles.textarea)} 
				value={ui.value||((ideas[editing.cell[0]]||{})[editing.cell[1]])||''}
				onChange={e => updateUI({value : e.target.value})}
			/>
			<div 
				className={css(styles.save)}
				onClick={() => dispatch({
					type : 'SET_IDEA',
					cell : editing.cell,
					value : ui.value
				}) && dispatch({type : 'DONE_EDITING'}) && resetUI()}
			>save</div>
		</div>
	</div>
))
export default connect(
	state => ({
		categories : state.categories,
		ideas : state.ideas,
		editing : state.editing
	})
)(Editor);
