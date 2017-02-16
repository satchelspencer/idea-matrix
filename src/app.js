import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import _ from 'lodash';
import { connect } from 'react-redux';

import uniqid from './lib/uniqid'
import Rulers from './rulers';
import Matrix from './matrix';
import Popup from './popup';
import Menu from './menu';
import Graph from './graph';

const styles = StyleSheet.create({
	container : {
		position : 'absolute',
		top : 0,
		left : 0,
		width : '100%',
		height : '100%',
		overflow : 'hidden',
		fontFamily : 'sans-serif',
		background : '#bbbbbb'
	},
	frame : {
		position : 'absolute',
		top : 0,
		right : 0,
		bottom : 0,
		transition : '0.5s all'
	},
	addButton : {
		position : 'absolute',
		top : 0,
		left : 0,
		width : 100,
		height : 100,
		display : 'flex',
		alignItems : 'center',
		justifyContent : 'center',
		color : 'red',
		cursor : 'pointer',
		fontSize : 50
	}
})

const App = ({dispatch, menu}) => (
	<div className={css(styles.container)}>
		<div className={css(styles.frame)} style={{left : menu?150:0}}>
			<div 
				className={css(styles.addButton)}
				onClick={() => dispatch({
					type : 'TOGGLE_MENU'
				})}
			>
				<span className={'fa '+(menu?'fa-chevron-left':'fa-bars')}/>
			</div>
			<Rulers/>
			<Matrix/>
		</div>
		<Popup/>
		<Menu/>
	</div>
)
export default connect(
	state => ({menu : state.menu})
)(App);

document.ontouchmove = function(event){
    event.preventDefault();
}