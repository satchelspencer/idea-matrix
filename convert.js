const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');

let blankState = str => ({
    entityMap: {},
    blocks: [
      {
        key: Math.random()+'',
        text: str||'',
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

var root = './data/';
fs.readdir(root, (err, files) => {
	var fileStates = files
		.filter(f => f.match(/\.json$/))
		.forEach(f => {
			var data = JSON.parse(fs.readFileSync(root+f))
			data.ideas = _.mapValues(data.ideas, ideas => _.mapValues(ideas, i => {
				return convert(i)
			}))
			fs.writeFileSync(root+f, JSON.stringify(data))
		});
})