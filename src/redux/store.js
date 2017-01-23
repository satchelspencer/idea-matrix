import { createStore, compose, combineReducers } from 'redux';
import { reducer as uiReducer } from 'redux-ui';
import _ from 'lodash';
import fetch from 'isomorphic-fetch';
import uniqid from '../lib/uniqid'
import cluster from '../lib/cluster';


const reducers = {
	ui : uiReducer,
	categories(state=[],action){
		switch(action.type){
			case 'SET_CATS':
				return _.uniq([...action.categories])
			default:
				return state;
		}
	},
	ideas(state={}, action){
		switch(action.type){
			case 'REPLACE_IDEAS':
				return action.ideas;
			case 'SET_IDEA':
				const indices = _.sortBy(action.cell)
				return _.merge({...state}, {
					[indices[0]] : {
						[indices[1]] : action.value
					}
				});
			default:
				return state;
		}
	},
	offset(state=[0,0],action){
		if(action.type == 'MATRIX_OFFSET') return action.offset;
		else return state;
	},
	editing(state={
		open : false,
		cell : []
	},action){
		switch(action.type){
			case 'EDIT_CELL':
				return {open : true, cell : _.sortBy(action.cell)};
			case 'DONE_EDITING':
				return {...state, open : false};
			default:
				return state;
		}
	}
}

let store = createStore(combineReducers(reducers), {}, compose(
	window.devToolsExtension ? window.devToolsExtension() : f => f
));

let currentIdeas = {};
store.subscribe(() => {
	const ideas = _.pick(store.getState(), 'ideas', 'categories');
	if(!_.isEqual(ideas, currentIdeas)){
		currentIdeas = JSON.parse(JSON.stringify(ideas));
		fetch('/api/state/'+window.location.hash.substr(1), {
			method: "POST",
		  body: JSON.stringify(currentIdeas),
		  headers: {
		    "Content-Type": "application/json"
		  }
		})
	}
})

if(!window.location.hash){
	window.location.hash = '#'+uniqid();
}

fetch('/api/state/'+window.location.hash.substr(1)).then(res => {
	res.json().then(json => {
		if(json.categories) store.dispatch({
			type : 'SET_CATS',
			categories : json.categories
		})
		if(json.ideas) store.dispatch({
			type : 'REPLACE_IDEAS',
			ideas : json.ideas
		})
	})
})

export default store;