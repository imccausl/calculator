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
	
	parseInput: function( event, data ) {
		var history = null,
			keyInput = event.srcElement.value || event.key,
			keyValue = event.charCode || keyInput,
			view = 0;
			
		View.startRender();
		
		console.log(event);
			
		// IMPORTANT DATA: {keypress: data.which; click: data.target.value}
		
		// this function routes valid inputs and ignores invalid inputs (such as letters),
		// but also including two operators (+-) in a row, two decimals (..) in a row, etc.
				
		if (keyInput) { // if keyInput is not undefined
			
			if ( !(Controller.isFunctionKey( keyValue )) ) { // check for key/button presses that
															 // perform calc functions.			
								
				 testHelpers.writeToScreen(keyInput);
					 
			} else {
				
				// evaluate expression
				if( (keyInput === '=' ) || (keyValue === 13) ) {
					
					if ( view.isValid ) {
						Model.setLastAnswer( math.eval( Model.getScreenData() ).toString() );
						Model.setScreenData( Model.getLastAnswer() );
					}
					
				} else if( (keyInput === 'ac') ) {
					Model.setScreenData("");
					history = Model.getScreenData();	
				}					
			}
			
		} else {
			console.log("Error: invalid data.");
		}
	},
	
	renderViewFromModel: function renderViewFromModel() {
		
	},
	
	init: function init() {
		
		function addListeners() {
			document.addEventListener("keypress", Controller.parseInput, false);
			elements.buttons.addEventListener("click", Controller.parseInput, false);
			elements.screen.addEventListener("broadcast", Controller.parseInput, false);
		}
		
		console.log(View.elements);
		
		View.init();
		addListeners();
	}
};

var testHelpers = {
	
	writeToScreen: function writeToScreen(str) {
		
		View.model = View.model + str;
		console.log(View.model);
	}
}