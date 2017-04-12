import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import _ from 'lodash';
import { connect } from 'react-redux';
import Draggable from 'react-draggable';
import Measure from 'react-measure';
import ui from 'redux-ui';
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
		width : 102,
		height : 102,
		marginTop : -1,
		marginLeft : -1,
		border : '1px solid #d8d8d8',
		boxSizing : 'border-box',
		flex : 'none'
	}
})

const colors = ['red', 'blue', 'orange', 'green', 'yellow', 'purple']

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
	clusters,
	catRange,
	offset,
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
						var [xoff, yoff] = offset.map(i=>i*-1);
						const ids = _.sortBy([catname,catnameB]);
						const val = (ideas[ids[0]]||{})[ids[1]]
						return (
							<Motion key={catname+catnameB} 
								style={{
									top: spring(i*100, {stiffness : 200, damping : 40}),
									left : spring(j*100, {stiffness : 200, damping : 40})
								}}
							>{value => {
								var [cxoff, cyoff] = [value.left,value.top];
								return (cxoff+100 >= xoff && cyoff+100 >= yoff && cxoff <= xoff+ui.width-100 && cyoff <= yoff+ui.height-100) && (
									<div
										key={catname+catnameB+'c'} 
										className={css(styles.cell)}
										onClick={() => {
											(!ui.noclick) && dispatch({
												type : 'OPEN_POPUP',
												params : {
													editor : true,
													head : catname+' & '+catnameB,
													cell : [catname, catnameB]
												}
											})
											// !ui.noclick && dispatch({
											// 	type : 'SET_IDEA',
											// 	cell : [catname, catnameB],
											// 	value : 'ay'
											// })
										}}
										style={{
											...value,
											background : val && ((clusters[catname] == clusters[catnameB] && clusters[catname] !== undefined)? `hsl(${(clusters[catname]*100)%360},82%,50%)`:'black'),
											opacity : val && (Math.sqrt(((val.length)-catRange.min)/(catRange.max-catRange.min+0.0001))+0.3)
										}}
									/>
								)
							}								
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
	state => {
		var catWeights = _.flatten(_.values(state.ideas).map(c => _.values(c))).map(v => v.length);
		return {
			categories : state.categories.present,
			ideas : state.ideas,
			clusters : state.clusters,
			offset : state.offset.map(o=>Math.min(0, o)),
			catRange : {
				min : _.min(catWeights),
				max : _.max(catWeights)
			}
		}
	}
)(Matrix);
