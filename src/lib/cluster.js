import _ from 'lodash';
import mc from 'markov-clustering'
import math from 'mathjs'

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
	const l = categories.length;
	const arr = _.fill(Array(l), 0).map(a => _.fill(Array(l), 0));
	_.each(ideas, (val, key) => {
		_.each(val, (v,keyb) => {
			if(v && _.includes(categories, key) && _.includes(categories, keyb)){
				arr[categories.indexOf(key)][categories.indexOf(keyb)] = 1;
				arr[categories.indexOf(keyb)][categories.indexOf(key)] = 1;
			}
		})
	})
	const cIndicies = mc.cluster(math.matrix(arr));
	const clusters = {};
	cIndicies.filter(c => c.length > 1).forEach((group,i) => {
		group.forEach(j => clusters[categories[j]] = i)
	})
	const rows = _.uniq(
		_.flatten(
			_.sortBy(cIndicies, c=>c.length*-1).map(
				group => _.sortBy(group.map(i => categories[i]), cat => cat.toLowerCase())
			)
		)
	)
	return {rows, clusters};
}