module.exports = {
	'env': {
		'browser': true,
		'es6': true
	},
	'extends': [
		'airbnb-typescript',
		'airbnb/hooks',
		'plugin:react/recommended',
		'plugin:react-hooks/recommended'
	],
	'parser': '@typescript-eslint/parser',
	'parserOptions': {
		'ecmaFeatures': {
			'jsx': true
		},
		'project': './tsconfig.json',
		'sourceType': 'module'
	},
	'plugins': [
		'react',
		'react-hooks',
		'@typescript-eslint',
	],
	'rules': {
		'linebreak-style': [
			'error',
			'unix'
		],
		// semi
		'semi': 'off',
		'@typescript-eslint/semi': ['error', 'never'],
		// indent
		'indent': 'off',
		'@typescript-eslint/indent': ['error', 'tab'],
		'react/jsx-indent': ['error', 'tab'],
		'no-tabs': 'off',
		// quote
		'quote': 'off',
		'@typescript-eslint/quotes': ['error', 'single'],
	}
}