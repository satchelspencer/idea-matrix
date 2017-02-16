import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import _ from 'lodash';
import { connect } from 'react-redux';
import ui from 'redux-ui';

const styles = StyleSheet.create({
	wrapper : {
		flex : 1,
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
	params
}) => {
	let cell = _.sortBy(params.cell);
	return (
		<div className={css(styles.wrapper)}>
			<textarea 
				className={css(styles.textarea)} 
				value={ui.value||((ideas[cell[0]]||{})[cell[1]])||''}
				onChange={e => updateUI({value : e.target.value})}
			/>
			{window.location.hash && <div 
				className={css(styles.save)}
				onClick={() => {
					if(ui.value) dispatch({
						type : 'SET_IDEA',
						cell : cell,
						value : ui.value
					})
					dispatch({type : 'CLOSE_POPUP'}) && resetUI()
				}}
			>save</div>}
		</div>
	)
})
export default connect(
	state => ({
		categories : state.categories.present,
		ideas : state.ideas
	})
)(Editor);
