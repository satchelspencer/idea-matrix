import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import _ from 'lodash';
import { connect } from 'react-redux';
import cluster from './lib/cluster';

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
		width : 100,
		height : 100,
		display : 'flex',
		alignItems :'center',
		justifyContent : 'center',
		borderBottom : '1px solid #e2e2e2',
		boxSizing : 'border-box',
		padding : 5,
		fontSize : 12,
		textAlign : 'center',
		wordBreak : 'break-word',
		hyphens : 'auto'
	}
})

const Ruler = connect(state => ({
	categories : cluster(state),
	offset : state.offset
}))(({
	axis,
	offset,
	categories
}) =>(
	<div className={css(styles.ruler, axis=='x'?styles.rulerX:styles.rulerY)}>
		<div 
			className={css(axis=='x' && styles.innerX)}
			style={{
				[axis=='x'?'marginLeft':'marginTop'] : Math.min(offset[axis=='x'?0:1], 0)
			}}
		>
			{categories.map((catname, i) => (
				<div 
					key={catname+i} 
					className={css(styles.catbox)}
				>
					{catname}
				</div>
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
