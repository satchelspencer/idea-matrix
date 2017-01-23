import _ from 'lodash';
import { createSelector } from 'reselect';

function getAdj(ideas){
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

export default createSelector(
	[
		state => state.ideas,
		state => state.categories
	],
	(ideas, categories) => {
		const adj = getAdj(ideas);
		console.log(adj);
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
)