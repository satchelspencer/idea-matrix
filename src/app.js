import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import _ from 'lodash';
import { connect } from 'react-redux';

import uniqid from './lib/uniqid'
import Rulers from './rulers';
import Matrix from './matrix';
import Editor from './editor';

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
	}
})

const App = () => (
	<div className={css(styles.container)}>
		<div 
			style={{
				position : 'absolute',
				top : 0,
				left : 0,
				width : 100,
				height : 50
			}}
			onClick={() => {}}
		/>
		<Rulers/>
		<Matrix/>
		<Editor/>
	</div>
)
export default App;

document.ontouchmove = function(event){
    event.preventDefault();
}