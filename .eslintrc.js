module.exports = {
	'env': {
		'browser': true,
		'es6': true
	},
	'extends': [
		'eslint:recommended',
		'plugin:react/recommended',
		'airbnb',
		'airbnb/hooks'
	],
	'parser': 'babel-eslint',
	'parserOptions': {
		'ecmaFeatures': {
			'jsx': true
		},
		'ecmaVersion': 6,
		'sourceType': 'module'
	},
	'plugins': [
		'react'
	],
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		"no-tabs": 0,
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'never'
		],
		"react/jsx-filename-extension": [
			1,
			{
				"extensions": [".js", ".jsx"]
			}
		],
		"react/jsx-indent": [
			1,
			'tab'
		],
		"react/destructuring-assignment": [
			0
		],
		"react/jsx-indent-props": [
			2,
			'tab'
		],
		"react/prop-types": [
			0
		],
		"no-use-before-define": [
			0
		]
	}
}
