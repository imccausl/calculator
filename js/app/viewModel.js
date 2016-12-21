define(['view', 'expression', 'inputFilter', 'math'], function(view, expression, inputFilter, math) {
		
	//controller.
	var ViewModel = ( function() {
		
		var calculate = function() {

				var model = "",
					expr = "",
					preSyntaxModel = expression.getModel();
				
				expression.checkSyntax("syntax");
				
				model = expression.getModel();
				model.content.data = model.content.data + view.elements.closedParens.innerHTML;
				view.elements.closedParens.innerHTML = "";
				
			
				
				expr = model.content.data;
				model.lastExpression = preSyntaxModel.content.data + "=";
				
				model.content.data = math.eval(expr).toString();
				
				expression.setModel(model);

			},
			
			checkInput = function checkInput(input) {
				if (input === '(') {
					view.parens.addPlaceholder();	
				} else if ( ( (input >= '0') && (input <= '9') ) ) {
					if (view.parens.checkForParens()) {
						inputFilter.addToFilter(')');
					}
					
				} else if (input === ')') {
					view.parens.shiftToView();
				}
			},
		
			isFunctionKey = function isFunctionKey( key ) {
				switch( key ) {
					
					case 'ac':
					case 'ce':
					case 'ans':
					
						return true;	
					default:
						return false;
				}
			},
			
			parseInput = function( event ) {
				var history = null,
					keyInput = event.srcElement.value || event.key,
					keyValue = event.charCode || keyInput,
					lastCh = expression.getLastCh();
										
				view.startRender();
				// IMPORTANT DATA: {keypress: data.which; click: data.target.value}
				
				// this function routes valid inputs and ignores invalid inputs (such as letters),
				// but also including two operators (+-) in a row, two decimals (..) in a row, etc.
						
				if (keyInput) { // if keyInput is not undefined
					
					if ( !(isFunctionKey( keyValue )) ) { // check for key/button presses that
						let dataFilter = inputFilter.getFilter();
																	 // perform calc functions.			
						console.log("Applying rule:", inputFilter.getFilter(), keyInput);
				
						if (dataFilter.indexOf(keyInput) > -1) {
							
							// evaluate expression: evaluation is beholden to the input filter unlike some of the other functions, 
							// below the isFunctionKey() else statement.
							
							if( (keyInput === '=' ) || (keyValue === 13) ) {
							
							//if ( view.isValid ) {
								calculate();
							//}
						
							} else {
							 	inputFilter.setFilter(keyInput, lastCh);
							 	checkInput(keyInput);
							 	expression.pushToModel(keyInput);
							}
						}
									 
					} else {
						
						if ( (keyInput === 'ac') ) {
							//Model.setScreenData("");
							//history = Model.getScreenData();	
						}					
					}
					
				} else {
					throw new Error("Something totally unexpected happened: Invalid data received!");
				}
			},
			
			init = function init() {
				
				function addListeners() {
					document.addEventListener("keypress", parseInput, false);
					view.elements.buttons.addEventListener("click", parseInput, false);
					view.elements.screen.addEventListener("broadcast", parseInput, false);
				}
					
				addListeners();
				inputFilter.setFilter(); // Passing no arguments into the setFilter() method initializes the filter.
			}
		
		return {
			init: init	
		}
		
	})();
	
	return ViewModel;
});