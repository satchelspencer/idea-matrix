import _ from 'lodash';
import { createSelector } from 'reselect';

const getAdj = createSelector(
	state => state.ideas,
	ideas => {
		const symmetric = {};
		_.each(ideas, (val, key) => {
			_.each(val, (v,keyb) => {
				if(v){
					symmetric[key] = [...symmetric[key]||[], keyb]
					symmetric[keyb] = [...symmetric[keyb]||[], key]
				}
			})
		})
		return symmetric;
	}
)

function cluster(adj, categories){
	let start;
	let result = [];
	let visited = [];
	while(start = _.minBy(_.difference(_.keys(adj), visited), k => adj[k].length)){
		visited.push(start);
		let q = [start];
		while(q.length){
			let node = q.shift();
			let nodeadj = _.sortBy(_.difference(adj[node], visited), n => adj[n].length*-1);
			q = [...q, ...nodeadj];
			visited = [...visited, ...nodeadj];
			result.push(node);
		}
	}
	return result.concat(_.difference(categories, result));
}

export default createSelector(
	[
		getAdj,
		state => state.display.order,
		state => state.categories
	],
	(adj, order, categories) => {
		switch(order){
			case 'name':
				return _.sortBy(categories);
			case 'cluster':
				return cluster(adj, categories);
			case 'freq':
				return _.sortBy(categories, c => adj[c]&&adj[c].length);
			default:
			 return categories;
		}
	}
)