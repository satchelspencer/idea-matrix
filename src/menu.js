import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import _ from 'lodash';
import { connect } from 'react-redux';
import ui from 'redux-ui';
import cluster from './lib/cluster'
import { ActionCreators } from 'redux-undo';

const styles = StyleSheet.create({
	wrapper : {
		position : 'absolute',
		left : 0,
		top : 0,
		bottom : 0,
		borderRight : '1px solid #a7a7a7',
		background : 'white',
		transition : '0.5s all',
		display : 'flex',
		flexDirection : 'column',
		overflow : 'hidden'
	},
	icon : {
		width : 150,
		height : 150,
		display : 'flex',
		alignItems : 'center',
		fontSize : 80,
		justifyContent : 'center',
		color : '#4c4c4c'
	}
})

const Icon = ({name, onClick, ...props}) => (
	<span {...props} className={'fa fa-'+name+' '+css(styles.icon)} onClick={onClick}/>
)

const Menu = ui({state : {
	value : null
}})(({
	ui, updateUI, resetUI,
	dispatch,
	categories,
	categoriesPast,
	ideas,
	menu,
	removing,
	params
}) => (
	<div className={css(styles.wrapper)} style={{
		width : menu?150:0,
		pointerEvents : menu?'all':'none'
	}}>
		{window.location.hash && <Icon name='plus' onClick={() => dispatch({
			type : 'OPEN_POPUP',
			params : {
				addTopic : true
			}
		})}/>}
		{window.location.hash && <Icon style={{
			background : removing && '#ffb4b4'
		}} name='trash' onClick={() => dispatch({
			type : 'TOGGLE_REMOVING'
		})}/>}
		<Icon name='th-large' onClick={() => {
			const {rows, clusters} = cluster(ideas, categories);
			dispatch({
				type : 'SET_CLUSTERS',
				clusters
			})
			dispatch({
				type : 'SET_CATS',
				categories : rows
			})
		}}/>
		<Icon name='sort-alpha-asc' onClick={() => dispatch({
			type : 'SET_CATS',
			categories : _.sortBy(categories, c=>c.toLowerCase())
		})}/>
		<Icon name='random' onClick={() => dispatch({
			type : 'SET_CATS',
			categories : _.shuffle(categories)
		})}/>
		<Icon style={{
			opacity : categoriesPast.length < 2 && '0.5'
		}} name='undo' onClick={() => categoriesPast.length > 1 && dispatch(ActionCreators.undo())}/>
	</div>
))
export default connect(
	state => ({
		categories : state.categories.present,
		categoriesPast : state.categories.past,
		ideas : state.ideas,
		menu : state.menu,
		removing : state.removing
	})
)(Menu);
