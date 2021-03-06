import { createStore, compose, combineReducers } from 'redux';
import { reducer as uiReducer } from 'redux-ui';
import _ from 'lodash';
import fetch from 'isomorphic-fetch';
import uniqid from '../lib/uniqid'
import cluster from '../lib/cluster';
import undoable from 'redux-undo';


const reducers = {
	ui : uiReducer,
	categories : undoable((state=[],action) => {
		switch(action.type){
			case 'SET_CATS':
				return _.uniq([...action.categories])
			case 'SHUFFLE_CATS':
				return _.shuffle(state);
			case 'ADD_CAT':
				return [action.cat, ...state]
			default:
				return state;
		}
	}),
	clusters(state={},action){
		if(action.type=='SET_CLUSTERS') return action.clusters;
		else return state;
	},
	ideas(state={}, action){
		switch(action.type){
			case 'REPLACE_IDEAS':
				return action.ideas;
			case 'SET_IDEA':
				const indices = _.sortBy(action.cell)
				return _.mergeWith(state, {
					[indices[0]] : {
						[indices[1]] : action.value
					}
				}, (a, b) => {
					if(_.isArray(a)) return b;
				});
			default:
				return state;
		}
	},
	offset(state=[0,0],action){
		if(action.type == 'MATRIX_OFFSET') return action.offset;
		else return state;
	},
	menu(state=false,action){
		if(action.type=='TOGGLE_MENU') return !state;
		else return state;
	},
	removing(state=false,action){
		if(action.type=='TOGGLE_REMOVING') return !state;
		else return state;
	},
	popup(state={
		open : false,
		params : {}
	}, action){
		switch(action.type){
			case 'OPEN_POPUP':
				return {...state, 
					open : true,
					params : action.params||{}
				}
			case 'CLOSE_POPUP':
				return {...state, open : false, params : {}}
			default:
				return state
		}
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
	},
	display(state={
		order : 'name'
	}, action){
		switch(action.type){
			case 'SET_ORDER':
				return {...state, order : action.order};
			default:
				return state;
		}
	}
}

let inithash = window.location.hash;

let store = createStore(combineReducers(reducers), {}, compose(
	window.devToolsExtension ? window.devToolsExtension() : f => f
));

let currentIdeas = {};
let fetched = false;
store.subscribe(() => {
	const ideas = _.pick(store.getState(), 'ideas', 'categories', 'clusters');
	ideas.categories = ideas.categories && ideas.categories.present
	if(inithash && !_.isEqual(ideas, currentIdeas) && fetched){
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


let fetchUrl = inithash?'/api/state/'+window.location.hash.substr(1):'/api/allState/';

fetch(fetchUrl).then(res => {
	res.json().then(json => {
		if(json.categories) store.dispatch({
			type : 'SET_CATS',
			categories : json.categories
		})
		if(json.clusters) store.dispatch({
			type : 'SET_CLUSTERS',
			clusters : json.clusters
		})
		if(json.ideas) store.dispatch({
			type : 'REPLACE_IDEAS',
			ideas : json.ideas
		})
		fetched = true;
	})
})

export default store;