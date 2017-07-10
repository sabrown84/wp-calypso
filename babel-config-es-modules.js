// For reuse in modules that need to ignore the babelrc and transform es6 modules
module.exports = {
	babelrc: false,
	presets: [ [ 'es2015', { modules: false } ], 'stage-2' ],
	plugins: [
		'transform-runtime',
		'transform-class-properties',
		'transform-export-extensions',
		'add-module-exports',
		'syntax-jsx',
		'transform-react-jsx',
		'transform-react-display-name',
		'lodash',
		[
			'transform-imports',
			{
				'state/selectors': {
					transform: 'state/selectors/${member}',
					kebabCase: true,
				},
			},
		],
	],
};
