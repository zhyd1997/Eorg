const path = require('path')
const webpack = require('webpack')
const htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	entry: path.resolve('./src/index.tsx'),
	plugins: [
		new webpack.HashedModuleIdsPlugin(),
		new htmlWebpackPlugin({
			template: path.resolve(__dirname, 'public/index.html')
		})
	],
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: '[name].[contenthash].js',
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js']
	},
	module: {
		rules: [
			{ test: /\.tsx?$/, loader: 'ts-loader' },
			{ test: /\.css$/i, use: ['style-loader', 'css-loader'] }
		]
	},
	optimization: {
		runtimeChunk: 'single',
		splitChunks: {
			chunks: 'all',
			maxInitialRequests: Infinity,
			minSize: 0,
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name(module) {
						const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
						return `npm.${packageName.replace('@', '')}`
					}
				}
			}
		},
	}
}