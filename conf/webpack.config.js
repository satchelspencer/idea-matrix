'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	devtool: '#source-map',
	entry: [
    	'webpack-dev-server/client?http://localhost:10000',
    	'webpack/hot/only-dev-server',
    	'react-hot-loader/patch',
    	path.join(__dirname, '../src/index.js'),
  	],
	output: {
	    path: path.resolve(__dirname, '../build'),
	    filename: 'app.bundle.js',
	    publicPath: '/'
	},
	module: {
	    loaders: [
	        {
				test: /\.(js|jsx)$/,
				include: path.join(__dirname, '../src'),
				loader: 'babel',
				query : {
					"presets" : ["babel-preset-es2015-loose", "babel-preset-stage-0", "babel-preset-react"].map(require.resolve),
					"plugins" : ["react-hot-loader/babel"]
				}
	    	},
	    	{
	    	    test: /\.css$/,
	    	    loader: 'style-loader!raw-loader' 
	    	},
    	    {
    	    	test: /\.(png|jpg)$/, loader: "url-loader?limit=1000000"
    	    }
	 	]
	},
	resolve : {
		extensions: ['', '.js', '.jsx', '.json'],
		alias: {
        'data': path.join(__dirname, '../data', 'dist')
    }
	},
  	plugins: [
  		new HtmlWebpackPlugin({
  			template : './conf/template.html'
  		}),
  		new webpack.optimize.OccurrenceOrderPlugin(),
    	new webpack.HotModuleReplacementPlugin()
  	]
}