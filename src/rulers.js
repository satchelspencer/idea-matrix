import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import _ from 'lodash';
import { connect } from 'react-redux';
import {Motion, spring} from 'react-motion';

const styles = StyleSheet.create({
	rulers : {
		position : 'absolute',
		top : 0,
		left : 0
	},
	ruler : {
		position : 'absolute',
		background : '#f3f3f3',
		overflow : 'hidden',
		boxSizing : 'border-box'
	},
	rulerX : {
		left : 100,
		right :0,
		height : 100,
		borderBottom : '1px solid black'
	},
	rulerY : {
		top : 100,
		bottom : 0,
		width : 100,
		borderRight : '1px solid black'
	},
	innerX : {
		transform: 'rotate(-90deg) translateX(-100px)',
		transformOrigin: '0 0'
	},
	catbox : {
		position : 'absolute',
		width : 102,
		height : 102,
		marginTop : -1,
		display : 'flex',
		alignItems :'center',
		justifyContent : 'center',
		borderBottom : '1px solid #e2e2e2',
		borderTop : '1px solid #e2e2e2',
		boxSizing : 'border-box',
		padding : 5,
		fontSize : 12,
		textAlign : 'center',
		wordBreak : 'break-word',
		hyphens : 'auto'
	},
	del : {
		position : 'absolute',
		fontSize: 100,
    width: '100%',
    height: '100%',
    top: -14,
    left: -2,
    opacity: 0.5
	}
})

const Ruler = connect(state => ({
	categories : state.categories.present,
	offset : state.offset,
	removing : state.removing
}))(({
	axis,
	offset,
	removing,
	categories,
	dispatch
}) =>(
	<div className={css(styles.ruler, axis=='x'?styles.rulerX:styles.rulerY)}>
		<div 
			className={css(axis=='x' && styles.innerX)}
			style={{
				position : 'absolute',
				[axis=='x'?'left':'top'] : Math.min(offset[axis=='x'?0:1], 0)
			}}
		>
			{categories.map((catname, i) => (
				<Motion key={catname+axis} style={{top: spring(i*100, {stiffness : 200, damping : 40})}}>{value => 
					<div 
						className={css(styles.catbox)}
						style={{
							...value,
							background : removing && '#bc0000',
							color : removing && 'white'
						}}
					>
						{removing && <div 
							className={css(styles.del)}
							onClick={() => dispatch({
								type : 'SET_CATS',
								categories : _.without(categories, catname)
							})}
						>&times;</div>}
						{catname}
					</div>
				}</Motion>
			))}
		</div>
	</div>
))

const Rulers = () => (
	<div className={css(styles.container)}>
		<Ruler axis='x'/>
		<Ruler axis='y'/>
	</div>
)
export default Rulers;
