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
		"react-hooks/rules-of-hooks": "error",
		// It warns when dependencies are specified incorrectly and suggests a fix.
    	"react-hooks/exhaustive-deps": "warn",
		"react/jsx-indent-props": [
			2,
			'tab'
		],
		"react/prop-types": [
			0
		],
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
		// no-shadow
		'no-shadow': 'off',
		// except test files
		'import/no-extraneous-dependencies': [
			'error',
			{
				'devDependencies': [
					'src/setupTests.ts',
					'**/*.spec.ts',
					'**/*.test.ts',
					'**/*.spec.tsx',
					'**/*.test.tsx',
				],
			},
		],
	}
}