//controller.
var Controller = {
	
	calculate: function() {
		
	},
	
	isFunctionKey: function isFunctionKey( key ) {
		switch( key ) {
			case '=':	
			case 'ac':
			case 'ce':
			case 'ans':
			case 13:
				return true;	
			default:
				return false;
		}
	},
	
		
	renderViewFromModel: function renderViewFromModel() {
		
	},
	
	init: function init() {
		
		View.init();
	}
};

var testHelpers = {
	
	writeToScreen: function writeToScreen(str) {
		
		View.model = View.model + str;
		console.log(View.model);
	}
}