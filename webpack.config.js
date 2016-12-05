var path = require('path');
var webpack = require('webpack');

var BUILD_DIR = path.resolve(__dirname, 'client-js');
var DIST_DIR = path.resolve(__dirname, 'app/dist');

module.exports = {
	stats: {
		color: true,
		reasons: true
	},
	devtool: 'source-map',


	entry: [
		path.join(BUILD_DIR, 'main.js')
	],
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					cacheDirectory: true
				}
			}
		]
	},
	output: {
		path: DIST_DIR,
		filename: 'bundle.js'
	},
	plugins: [
		new webpack.DefinePlugin({
			// 'process.env.NODE_ENV': '"production"'
			'process.env.NODE_ENV': '"development"'
		})
	],
	externals: [
		(function () {
			var IGNORES = [
				'os',
				'path',
				'fs',
				'electron',
				'fluent-ffmpeg'
			];
			return function (context, request, callback) {
				if (IGNORES.indexOf(request) >= 0) {
					return callback(null, "require('" + request + "')");
				}
				return callback();
			};
		})()
	]
};
