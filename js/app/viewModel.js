define(['view', 'expression', 'inputFilter', 'math'], function(view, expression, inputFilter, math) {
		
	//controller.
	var ViewModel = ( function() {
		
		var calculate = function() {

				var model = "",
					expr = "",
					preSyntaxModel = expression.getModel();
				
				expression.checkSyntax("syntax");
				
				model = expression.getModel();
				
				model.content.data = model.content.data + view.elements.closedParens.textContent;
				expression.toggleFirstInput();
				view.elements.closedParens.textContent = "";
				
				// make any show-stopping errors simply display "ERROR" on the screen... just like a real calculator... kinda?
				try {
					expr = model.content.data;
					model.lastExpression = preSyntaxModel.content.data + "=";
					
					model.content.data = math.eval(expr).toString();
					model.lastAns = model.content.data;
					view.disableLastAns(false);
				} 
				
				catch(err) {
					model.content.data = "E R R  !";
				}
				
				finally {
					inputFilter.setFilter();
					console.log("Model state at calculate", model);
					expression.setModel(model);
				}
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
					case 'Backspace':
					case 'Delete':
					case 'Clear':
						return true;	
					default:
						return false;
				}
			},
			
			backspace = function backspace() {
				
			 	var model = expression.getModel(),
			 		lastCh = "",
			 		filtCh = "";
			 	
			 	
			 	
			 	
			 	if (model.content.firstInput) {
				 	allClear();
				 } else {
					
					
					model.content.data = model.content.data.substr(0, model.content.data.length-1);	
					console.log("backspace", expression.splitExpression(/log\b/, model.content.data));
					 
				 	lastCh = model.content.data.charAt(model.content.data.length-2);
				 	filtCh = model.content.data.charAt(model.content.data.length-1);
				 	
				 	if (filtCh === 'g') {
				 		
				 		filtCh = 'log';
					} else if (filtCh === 'o') {
						filtCh = 'log';
						
						model.content.data = model.content.data.replace("lo", "");
					}
				 	
				 	// known issue: removing "log" instead of backspacing 1 ch at a time.
				 	
				 	expression.setModel(model);
				 	inputFilter.setFilter(filtCh, lastCh); // if the model changes, the input filter has to follow suit.
				 	
				 	console.log("inputfilter:", inputFilter.getFilter());
				}
			 	
		 	},
		 	
		 	allClear = function allClear() {
			 	expression.setModel({
								content: {
									data: "",
									firstInput: true
								},
								lastAns: "",
								lastExpression: ""
							});	
							
							view.disableLastAns(true);
							inputFilter.setFilter();	
		 	},
			
			parseInput = function( event ) {
				var history = null,
					keyInput = event.srcElement.value || event.key,
					keyValue = event.charCode || keyInput,
					lastCh = expression.getLastCh();
										
				// IMPORTANT DATA: {keypress: data.which; click: data.target.value}
				
				// this function routes valid inputs and ignores invalid inputs (such as letters),
				// but also including two operators (+-) in a row, two decimals (..) in a row, etc.
						
				try {
					if (keyInput) { // if keyInput is not undefined
						view.startRender();
											
						if ( !(isFunctionKey( keyValue )) ) { // check for key/button presses that
							let dataFilter = inputFilter.getFilter(); //used let because I only need block scope here.
							
							if (keyInput === 'Enter') keyInput = '=';
											
							if (dataFilter.indexOf(keyInput) > -1) {
								
								// evaluate expression: evaluation is beholden to the input filter unlike some of the other functions, 
								// below the isFunctionKey() else statement.
								
								if( keyInput === '=' ) {
									calculate();		
								} else {
								 	
								 	inputFilter.setFilter(keyInput, lastCh);
								 	checkInput(keyInput);
								 	
								 	if (keyInput === 'ans') keyInput = expression.getLastAns();
								 								 	
								 	expression.pushToModel(keyInput);
								 	
								 	if (!(expression.hasDecimal())) {
								 		inputFilter.addToFilter('.');
									}
									
									if ( (view.parens.numInside()) && (view.parens.checkForParens()) ) {
										inputFilter.addToFilter(')');
									}
									
								}
							}
										 
						} else {
							
							if ( (keyInput === 'ac') || (keyInput === 'Clear') ) {
								
								allClear();
								
							} else if ( (keyInput === 'ce' ) || (keyInput === 'Backspace') || (keyInput === 'Delete') ) {
								backspace();
							}			
						}
						
					} else {
						throw new Error("Something totally unexpected happened: Invalid data received!");
						
					}
				}
				
				catch(err) {
					allClear();
				}
				
				
			},
			
			init = function init() {
				
				//configure math.js lib to prevent round-off errors.
				math.config({
					number: 'BigNumber',
					precision: 15 // display up to 15 numbers
				});	
				
				function addListeners() {
					document.addEventListener("keydown", parseInput, false);
					view.elements.buttons.addEventListener("click", parseInput, false);
					view.elements.screen.addEventListener("broadcast", parseInput, false);
				}
					
				addListeners();
				view.init();
				inputFilter.setFilter(); // Passing no arguments into the setFilter() method initializes the filter.
			}
		
		return {
			init: init	
		}
		
	})();
	
	return ViewModel;
});