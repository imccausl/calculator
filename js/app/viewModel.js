define(['view', 'expression', 'inputFilter'], function(view, expression, inputFilter) {
		
	//controller.
	var ViewModel = ( function() {
		
		var calculate = function() {
			
			},
			
			renderViewFromModel = function renderViewFromModel() {
			
			},
		
			isFunctionKey = function isFunctionKey( key ) {
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
			
			parseInput = function( event ) {
				var history = null,
					keyInput = event.srcElement.value || event.key,
					keyValue = event.charCode || keyInput;
										
				view.startRender();
				// IMPORTANT DATA: {keypress: data.which; click: data.target.value}
				
				// this function routes valid inputs and ignores invalid inputs (such as letters),
				// but also including two operators (+-) in a row, two decimals (..) in a row, etc.
						
				if (keyInput) { // if keyInput is not undefined
					
					if ( !(isFunctionKey( keyValue )) ) { // check for key/button presses that
																	 // perform calc functions.			
						console.log("Applying rule:", inputFilter.getFilter(), keyInput);
				
						if (inputFilter.getFilter().indexOf(keyInput) > -1) {
							 expression.pushToModel(keyInput);
						}
/*
							if (ch==="=") {
								expression.model = expression.model + closedParens.text() 
								// concatenation of model and view (closedParens data)
								closedParens.text(""); // view modification 
								expression.model = math.eval(expression.model).toString();
								render();
								expression.init();
							} else {
*/													 
					} else {
						
						// evaluate expression
						if( (keyInput === '=' ) || (keyValue === 13) ) {
							
							if ( view.isValid ) {
								//Model.setLastAnswer( math.eval( Model.getScreenData() ).toString() );
								//Model.setScreenData( Model.getLastAnswer() );
							}
						
						} else if( (keyInput === 'ac') ) {
							//Model.setScreenData("");
							//history = Model.getScreenData();	
						}					
					}
					
				} else {
					//throw Error("Something totally unexpected happened: Invalid data received!");
				}
			},
			
			init = function init() {
				
				function addListeners() {
					document.addEventListener("keypress", parseInput, false);
					view.elements.buttons.addEventListener("click", parseInput, false);
					view.elements.screen.addEventListener("broadcast", parseInput, false);
				}
					
				addListeners();
				console.log(document);
				inputFilter.setFilter();
			}
		
		return {
			init: init	
		}
		
	})();
	
	return ViewModel;
});

/*
	
	// if a decimal is entered on a blank screen, after an operator, or any situation such as this,
	// a zero is inserted before the decimal.
	
	if ((lastCh === "") || (lastCh.search(/[\+\*\/-]/) > -1) || lastCh === ",") {
		expression.model = expression.model.replace(lastCh+".", lastCh+"0."); // model modification
	}


	// if an operator is entered, but the last character entered was an operator,
	// print nothing to the screen
	
	if ( (operators.indexOf(lastCh) > -1) ) {
		expression.model = expression.model.replace(lastCh, ""); // model modification
	}
	
	
	// adding closed parens to the view when an open paren is entered and 
	// moving the closed parens to the regular view when closed parens are entered.
	
	var parenClosed = closedParens.text();
	
	if (ch==='(') {
		parenClosed += ")";
		closedParens.text(parenClosed); //view modification
		chFound = true;
	} else if (ch===')') {
		parenClosed = parenClosed.replace(")", "");
		closedParens.text(parenClosed); // view modification
		chFound = true;
	}
	
*/