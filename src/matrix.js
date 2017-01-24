import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import _ from 'lodash';
import { connect } from 'react-redux';
import Draggable from 'react-draggable';
import Measure from 'react-measure';
import ui from 'redux-ui';
import cluster from './lib/cluster';
import {Motion, spring} from 'react-motion';

const styles = StyleSheet.create({
	matrix : {
		position : 'absolute',
		top : 100,
		left : 100,
		width : '100%',
		height : '100%',
		overflow : 'hidden',
		background : 'white'
	},
	innerMatrix : {
	},
	row : {
		height : 100,
		display : 'flex'
	},
	cell : {
		position : 'absolute',
		width : 100,
		height : 100,
		borderBottom : '1px solid #d8d8d8',
		borderRight : '1px solid #d8d8d8',
		boxSizing : 'border-box',
		flex : 'none'
	}
})


const Matrix = ui({
	state : {
		width : 0,
		height : 0,
		noclick : false
	}
})(({
	ui, updateUI,
	dispatch,
	categories,
	ideas
}) => (
<Measure shouldMeasure={true} onMeasure={({width,height}) => updateUI({width,height})}>
	<div className={css(styles.matrix)}>
		<Draggable
			bounds={{
				left : Math.min(((categories.length*100)-ui.width)*-1, 0),
				top : Math.min(((categories.length*100)-ui.height)*-1, 0),
				right : 0,
				bottom : 0
			}}
			onStart={() => updateUI({noclick : false})}
			onDrag={(e,{x,y}) => updateUI({noclick : true}) || dispatch({
				type : 'MATRIX_OFFSET',
				offset : [
					Math.max(x, ((categories.length*100)-ui.width)*-1),
					Math.max(y, ((categories.length*100)-ui.height)*-1),
				]
			})}
		>
			<div 
				className={css(styles.innerMatrix)}
				style={{width : categories.length*100, height : categories.length*100}}
			>
				{categories.map((catname, i) => (
					<div key={catname+'m'}>
					{categories.map((catnameB, j) => {
						const ids = _.sortBy([catname,catnameB]);
						const val = (ideas[ids[0]]||{})[ids[1]]
						return (
							<Motion key={catname+catnameB} 
								style={{
									top: spring(i*100),
									left : spring(j*100)
								}}
							>{value => 
								<div
									className={css(styles.cell)}
									onClick={() => {
										// !ui.noclick && dispatch({
										// 	type : 'EDIT_CELL',
										// 	cell : [catname, catnameB]
										// })
										!ui.noclick && dispatch({
											type : 'SET_IDEA',
											cell : [catname, catnameB],
											value : 'ay'
										})
									}}
									style={{
										...value,
										background : val?`rgb(134, 245, 195)`:'white'
									}}
								/>
							}</Motion>							
						)
					})}
					</div>
				))}
			</div>
		</Draggable>
	</div>
</Measure>
))
export default connect(
	state => ({
		categories : cluster(state),
		ideas : state.ideas
	})
)(Matrix);
