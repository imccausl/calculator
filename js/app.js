// config
require.config({
	baseUrl: 'js/app',
	paths: {
		'MathJax':'https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=AM_CHTML.js',
		'math': 'js/lib/math.js',
		app: 'js/app'
	}
});

//app

require(['expression', 'inputFilter'], function(expression, inputFilter) {
	console.log(inputFilter);
});


