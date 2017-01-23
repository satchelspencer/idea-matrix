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

const root = 'data/';
const def = {
	categories : [
		'dance',
		'politics',
		'religion',
		'value of art',
		'Robert Motherwell',
		'The Body',
		'Censorship',
		'technology',
		'The Body',
		'Dance Trends',
		'Performance Art',
		'Self-promotion',
		'Authorship',
		'collaboration',
		'Feminist Art',
		'Men in dance',
		'Systemic Racism',
		'The uncanny',
		'Science',
		'Site Specific Work',
		'Social Change',
		'Pop Culture',
		'Entertainment',
		'Dance Critics',
		'John Martin',
		'Jill Johnston',
		'Theophile Gautier',
		'Post colonialism',
		'Postmodernism',
		'Feminism',
		'Post structuralism',
		'Structuralism',
		'Marxism',
		'New Historicism',
		'African-American criticism',
		'Psychoanalytic criticism',
		'Modernism',
		'Queer theory',
		'Liberal Humanism',
		'Theatre',
		'Samual Beckett',
		'Anne Bogart',
		'Robert Wilson',
		'Wooster Group',
		'Peter Brook'
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