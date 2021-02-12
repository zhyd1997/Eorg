const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	entry: path.resolve('./src/index.tsx'),
	plugins: [
		new CleanWebpackPlugin(),
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
}