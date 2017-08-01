

// config
requirejs.config({
	baseUrl: 'js/app',

	paths: {
		'MathJax':'https://cdn.rawgit.com/mathjax/MathJax/2.7.1/MathJax.js?config=AM_CHTML.js',
		math: '../lib/math',
		domReady:'../lib/domReady'
	},
	
	shim: {
		'MathJax': {
			exports: 'MathJax'
		}
	}
});

//app

require(['domReady'], function(domReady) {
	
	domReady(function() {
		
		require(['viewModel'], function(viewModel) {
		
			viewModel.init();
		
		});
	});
	
});


