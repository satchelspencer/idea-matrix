const path = require('path');
const webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
const history = require('connect-history-api-fallback');
var url = require('url');
var proxy = require('proxy-middleware');

const express = require('express');
const bodyParser = require('body-parser');
const server = express();
const httpServer = require('http').createServer(server);

const port = process.env.PORT||9999;
const outputPath = path.resolve(__dirname, 'build');

const config = require('./conf/webpack.config.js');
const fs = require('fs-extra');
const _ = require('lodash');

const root = 'data/';
const def = {
	categories : [
		'Dance',
		'Gender',
		'Sexuality',
		'Pedagogy',
		'Culture',
		'Idendity',
		'Politics',
		'Religion',
		'Value of art',
		'The Body',
		'Censorship',
		'Technology',
		'Interdisc',
		'Concern',
		'Hope',
		'Performance',
		'Art',
		'Visual art',
		'Music',
		'Collaboration',
		'New Forms',
		'Site Specific ',
		'Social Change',
		'Dance and Pop ',
		'Philosophy/Theory',
		'History'
	]
}
server.post('/api/state/:id', bodyParser.json(), function(req,res){
	const p = root+req.params.id+'.json';
	fs.ensureFileSync(p);
	fs.writeFileSync(p, JSON.stringify(req.body));
	res.end();
})
server.get('/api/state/:id', function(req,res){
	const p = root+req.params.id+'.json';
	fs.readFile(p, (e, data) => e?res.json(def):res.json(JSON.parse(data)));
})
server.get('/api/allState/', function(req,res){
	fs.readdir(root, (err, files) => {
		var fileStates = files
			.filter(f => f.match(/\.json$/))
			.map(f => JSON.parse(fs.readFileSync(root+f)));
		var state = _.reduce(fileStates, (sum, state) => {
			sum.ideas = _.mergeWith(sum.ideas, state.ideas, (a, b) => {
				if(_.isString(a)) return a+'\n\n'+b;
			})
			sum.categories = _.uniq(sum.categories.concat(state.categories));
			sum.clusters = {}
			return sum;
		})
		res.end(JSON.stringify(state, null, 2));
	})
})

if(process.env.NODE_ENV == 'development'){
  const compiler = webpack(config);
  new WebpackDevServer(compiler, {
    publicPath: config.output.publicPath,
    historyApiFallback: true,
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  }).listen(port+1, 'localhost', err => {
    if(err) console.error(err);
    console.info(`webpack on http://localhost:${port+1} waiting for build...`);
  });

  server.use('/', proxy(url.parse(`http://localhost:${port+1}/`)));

  httpServer.listen(port, err => {
    if(err) console.error(err);
    console.info(`⚡⚡⚡ dev server on ⚡⚡⚡ localhost:${port}/`);
  })

  var first = true;
  compiler.plugin('done', function(){
  	if(first){
  		  first = false;
  			console.log('Build Ready')
  	}
  })
}else{
  server.use(express.static(outputPath));
  httpServer.listen(port, err => {
    if(err) console.error(err);
    console.info(`⚡⚡⚡ PROD localhost:${port}/`);
  })
}