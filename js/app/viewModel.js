define(['view', 'expression', 'inputFilter', 'math'], function(view, expression, inputFilter, math) {
		
	//controller.
	var ViewModel = ( function() {
		
		var calculate = function() {

				var model = "",
					expr = "",
					preSyntaxModel = expression.getModel();
				
				expression.checkSyntax();
				
				model = expression.getModel();
				model.content.data = model.content.data + view.elements.closedParens.innerHTML;
				view.elements.closedParens.innerHTML = "";
				
			
				
				expr = model.content.data;
				model.lastExpression = preSyntaxModel.content.data + "=";
				
				model.content.data = math.eval(expr).toString();
				
				expression.setModel(model);

			},
			
			checkExpression = function checkExpression() {
				
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
							 	expression.pushToModel(keyInput);
							 	inputFilter.setFilter(keyInput, lastCh);
							}
						}
									 
					} else {
						
						if ( (keyInput === 'ac') ) {
							//Model.setScreenData("");
							//history = Model.getScreenData();	
						}					
					}
					
				} else {
					throw Error("Something totally unexpected happened: Invalid data received!");
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
				inputFilter.setFilter(); // Passing no arguments into the setFilter() method initializes the filter.
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
	
	
	// makes some small changes to the model that help the readability of the view
	if (lastCh === "(") {
							inputRule.push("rightParen");
						} else if (lastCh === ")") {
							expression.model = expression.model.replace(/\)\d+/, ")*"+ch);
							inputRule.push("rightParen");
						} else if (lastCh==="!") {
							expression.model = expression.model.replace(/!\d+/, "!*"+ch);
						} else if (expression.splitExpression("pow").search(/(pow\(\d+\,\d+)/) > -1)  {
							inputRule.push("rightParen");
						}

	
*/