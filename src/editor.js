import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import _ from 'lodash';
import { connect } from 'react-redux';
import ui from 'redux-ui';

import { Editor as WSEditor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';

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
		background : '#fff',
		color : '#000',
		display : 'flex',
		alignItems : 'center',
		justifyContent : 'center',
		borderRadius : 3,
		border : '1px solid black',
		fontWeight : '100',
		fontSize : 60,
		cursor : 'pointer'
	},
	ideas : {
		flex : 1,
		padding : 20,
		display : 'flex',
		flexDirection : 'column-reverse',
		justifyContent : 'flex-end',
		maxWidth : 1100,
		width : '100%',
		alignSelf : 'center'
	},
	idea : {
		border : '1px solid #b5b5b5',
		fontSize : 20,
		borderRadius : 3,
		outline : 'none',
		marginBottom : 20,
		background : 'white',
		padding : '0px 20px',
		boxSizing : 'border-box'
	},
	ideaHTML : {
		padding : '5px 20px'
	},
	addIdea : {
		fontSize : 50,
		textAlign : 'center',
		cursor : 'pointer'
	},
	toolbar : {
		boxSizing : 'border-box'
	},
	delIdea : {
		position : 'absolute',
		fontSize : 30,
		top : 4,
		right : 15,
		':hover' : {
			color : 'red'
		}
	}
})

let blankState = str => ({
    entityMap: {},
    blocks: [
      {
        key: Math.random()+'',
        text: str||' ',
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {}
      }
    ]
  })

function convert(ideas){
	if(_.isArray(ideas)) return ideas;
	else return _.compact(ideas.split('\n')).map(idea => blankState(idea))
}

const Editor = ui({state : {
	value : null,
	ideas : props => {
		let cell = _.sortBy(props.params.cell);
		return convert(((props.ideas[cell[0]]||{})[cell[1]])||[])
	},
	editIndex : -1
}})(({
	ui, updateUI, resetUI,
	dispatch,
	categories,
	ideas,
	params,
	onUpdate
}) => {
	let cell = _.sortBy(params.cell);
	return (
		<div className={css(styles.wrapper)}>
			{window.location.hash && <div 
				className={css(styles.addIdea)}
				onClick={() => updateUI({ideas : [...ui.ideas, blankState()]})}
			>+</div>}
			<div className={css(styles.ideas)}>
				{ui.ideas.map((idea, i) =>
					{ return ui.editIndex === i && window.location.hash ?
					<div key={i} style={{position : 'relative'}}>
					<WSEditor
						toolbar={{
							options : ['inline', 'list', 'link', 'image', 'remove', 'history'],
							image : {
								defaultSize : {
									width : 'auto',
									height : 'auto'
								}
							}
						}}
						key={idea.blocks[0].key+i}
					 	toolbarClassName={css(styles.toolbar)}
					  editorClassName={css(styles.idea)}
					  defaultContentState={idea}
					  onContentStateChange={state => {
							var newlist = [...ui.ideas];
							newlist[i] = state;
							updateUI({ideas : newlist})
							onUpdate({cell : cell, ideas : newlist})
						}}
					/>
					<div key={i+'s'} className={css(styles.delIdea)} onClick={() => {
							var newlist = [...ui.ideas];
							newlist.splice(i, 1)
							updateUI({ideas : newlist})
							onUpdate({cell : cell, ideas : newlist})
						}}>&times;</div>
					</div>
					:
					<div 
						key={i+'html'} 
						className={css(styles.idea, styles.ideaHTML)} 
						ref={div => {if(div) div.innerHTML = draftToHtml(idea)}}
						onClick={() => updateUI({editIndex : i})}
					/>
				}
					
				)}
			</div>
		</div>
	)
})
export default connect(
	state => ({
		categories : state.categories.present,
		ideas : state.ideas
	})
)(Editor);
