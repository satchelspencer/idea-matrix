import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import _ from 'lodash';
import { connect } from 'react-redux';
import ui from 'redux-ui';
import cluster from './lib/cluster'

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

const Icon = ({name, onClick}) => (
	<span className={'fa fa-'+name+' '+css(styles.icon)} onClick={onClick}/>
)

const Menu = ui({state : {
	value : null
}})(({
	ui, updateUI, resetUI,
	dispatch,
	categories,
	ideas,
	menu,
	params
}) => (
	<div className={css(styles.wrapper)} style={{
		width : menu?150:0,
		pointerEvents : menu?'all':'none'
	}}>
		<Icon name='plus' onClick={() => dispatch({
			type : 'OPEN_POPUP',
			params : {
				addTopic : true
			}
		})}/>
		<Icon name='trash'/>
		<Icon name='search' onClick={() => {
			const {rows, clusters} = cluster(ideas, categories);
			console.log(clusters);
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
	</div>
))
export default connect(
	state => ({
		categories : state.categories,
		ideas : state.ideas,
		menu : state.menu
	})
)(Menu);
