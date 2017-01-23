import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import _ from 'lodash';
import { connect } from 'react-redux';
import Draggable from 'react-draggable';
import Measure from 'react-measure';
import ui from 'redux-ui';
import cluster from './lib/cluster';

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
			<div className={css(styles.innerMatrix)}>
				{categories.map((catname, i) => (
					<div key={catname+i} className={css(styles.row)}>
						{categories.map((catnameB, j) => {
							const ids = _.sortBy([catname,catnameB]);
							const value = (ideas[ids[0]]||{})[ids[1]]
							return (
								<div
									key={catname+catnameB+j+i} 
									className={css(styles.cell)}
									onClick={() => {
										!ui.noclick && dispatch({
											type : 'EDIT_CELL',
											cell : [catname, catnameB]
										})
									}}
									style={{
										background : value?`rgba(134, 245, 195, ${Math.min(value.length/15, 1)})`:'white'
									}}
								>
									
								</div>
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
