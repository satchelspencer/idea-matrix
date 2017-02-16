import _ from 'lodash';
import math from 'mathjs'
import { jLouvain } from 'jlouvain';

const options = {
  expandFactor: 1, //more => larger cluster
  inflateFactor: 1,
  maxLoops: 10,
  multFactor: 1
}

export function oldCluster(ideas, categories){
	const adj = {};
	_.each(ideas, (val, key) => {
		_.each(val, (v,keyb) => {
			if(v){
				adj[key] = [...adj[key]||[], keyb]
				adj[keyb] = [...adj[keyb]||[], key]
			}
		})
	})

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

export default function(ideas, categories){
	const nodes = categories;
	const edges = [];
	_.each(ideas, (val, key) => {
		_.each(val, (v,keyb) => {
			if(v && _.includes(categories, key) && _.includes(categories, keyb)){
				edges.push({
					source : key,
					target : keyb,
					weight : 1
				})
			}
		})
	})
	const clusters = jLouvain().nodes(nodes).edges(edges)();
	const rows = _(clusters).invertBy().values().flatten().value();
	return {rows, clusters};
}