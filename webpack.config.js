const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const parts = require('./webpack.parts');

const developmentConfig = require('./webpack.dev');
const productionConfig = require('./webpack.prod');
const test = require('./webpack.test');

const PATHS = {
	app: path.resolve(__dirname, 'app'),
	build: path.resolve(__dirname, 'dist')
};

// merge sect 4.2 of SurviveJS - Webpack -- refactor

// https://webpack.js.org/guides/code-splitting-async/

// look into https://github.com/addyosmani/webpack-lighthouse-plugin
// it might get integrated into Chrome 60

// look into imports-loader https://github.com/webpack-contrib/imports-loader

const babelOptions = {
	'presets': [
		// 'env'
		['es2015',
			{
				'modules': false
			}
		]
	]
};

const commonConfig = merge([
	{
		entry: {
			// the entry point of our app
			app: PATHS.app,
			vendor: [
				'bootstrap-loader',
				// 'jquery' // imports-loader?$= commenting out as Bootstrap isn't using any scripts
			],
		},
		output: {
			path: PATHS.build,
			publicPath: '/dist',
			filename: '[name].js'
		},
		module: {
			rules: [
				{
					test: /\.vue$/,
					loader: 'vue-loader',
					options: {
						loaders: {
							ts: 'ts-loader'
						}
					}
				},
				{
					test: /\.tsx?$/,
					exclude: /node_modules/,
					use: [
						{
							loader: 'babel-loader',
							options: babelOptions
						},
						{
							loader: 'ts-loader',
							options: {
								appendTsSuffixTo: [
									/\.vue$/
								]
							}
						},
					]
				},
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: babelOptions
					}
				},
				{
					test: /\.scss$/,
					loaders: ['style-loader', 'css-loader', 'postcss', 'sass']
				},
				{
					test: /\.(woff2?|ttf|eot|svg)$/,
					loader: 'url-loader?limit=10000'
				},
				{
					test: /bootstrap-sass\/assets\/javascripts\//,
					use: 'imports-loader?jQuery=jquery'
				}
			]
		},
		plugins: [
			new webpack.ProvidePlugin({
				$: 'jquery',
				jQuery: 'jquery',
				'window.jquery': 'jquery',
				Tether: 'tether',
				'window.Tether': 'tether'
			}),
			new webpack.EnvironmentPlugin(
				{
					'NODE_ENV': 'development'
				}
			)
		],
		resolve: {
			// Add '.ts' and '.tsx' as a resolvable extension.
			alias: {
				'vue$': 'vue/dist/vue.esm.js'
			},
			extensions: ['.vue', '.ts', '.tsx', '.js']
		}
	},
	parts.lintJavaScript({include: PATHS.app}),
	parts.loadCSS()
]);

const testConfig = developmentConfig;

module.exports = (env) => {
	let config = {};
	switch(env) {
		case 'development':
			config = merge(commonConfig, developmentConfig);
			break;
		case 'production':
			config = merge(commonConfig, productionConfig);
			break;
		default:
		case 'test':
			config = merge(commonConfig, testConfig);
			break;
	}

	return config;
};
