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
					model.lastExpression = preSyntaxModel.content.data + " =";
					
					model.content.data = math.eval(expr).toString(); // this is a mathJS function for evaluating math, not JS EVAL
					model.lastAns = model.content.data;
					view.disableLastAns(false);
				} 
				
				catch(err) {
					model.content.data = "E R R  !";
					
				}
				
				finally {
					inputFilter.setFilter();
					view.elements.screen.textContent = model.content.data;
					view.elements.history.textContent = expr
						.replace(/\*/g, " ⋅ ")
						.replace(/\+/g, " + ")
						.replace(/\-/g, " - ")
						.replace(/\//g, " ÷ ")
						.replace(/sqrt/g, " √") + " =";
					
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
					case 'info':
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
			 		filtCh = "",
			 		delCh = "",
			 		closedParens = view.elements.closedParens,
			 		calcScreen = view.elements.screen;
			 	
			 	
			 	
			 	
			 	if (model.content.firstInput) {
				 	allClear();
				 } else {
					
					delCh = model.content.data.charAt(model.content.data.length-1);
					
					if (delCh === '(') {
						closedParens.textContent = closedParens.textContent.substr(0, closedParens.textContent.length-1)
					}
					
					model.content.data = model.content.data.substr(0, model.content.data.length-1);	
										 
				 	lastCh = model.content.data.charAt(model.content.data.length-2);
				 	filtCh = model.content.data.charAt(model.content.data.length-1);
				 	
				 	if (filtCh === 'g') {
				 		
				 		filtCh = 'log';
					} else if (filtCh === 'o') {
						
						model.content.data = model.content.data.replace("lo", "");
						filtCh = model.content.data.charAt(model.content.data.length-1);
					} else if (filtCh === 't') {
						filtCh = 'sqrt';
					} else if (filtCh === 'r') {
						model.content.data = model.content.data.replace("sqr", "");
						filtCh = model.content.data.charAt(model.content.data.length-1);
					}
				 	
				 	// known issue: removing "log" instead of backspacing 1 ch at a time.
				 	
				 	calcScreen.textContent = model.content.data
				 			.replace(/\*/g, " ⋅ ")
							.replace(/\+/g, " + ")
							.replace(/\-/g, " - ")
							.replace(/\//g, " ÷ ")
							.replace(/sqrt/g, " √");
							
				 	expression.setModel(model);
				 	inputFilter.setFilter(filtCh, lastCh); // if the model changes, the input filter has to follow suit.
				 	
				 	
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
							
							view.elements.closedParens.textContent = "";
							view.elements.screen.textContent = "";
							
							view.disableLastAns(true);
							inputFilter.setFilter();	
		 	},
			
			parseInput = function( event ) {
				var history = null,
					keyInput = event.target.value || event.key,
					keyValue = event.charCode || keyInput,
					lastCh = expression.getLastCh(),
					calcOutput = document.getElementById('calc--total-output');
					
											
									
				// IMPORTANT DATA: {keypress: data.which; click: data.target.value}
				
				// this function routes valid inputs and ignores invalid inputs (such as letters),
				// but also including two operators (+-) in a row, two decimals (..) in a row, etc.
				
				console.log("parseInput():", event);
				console.log("KeyInput:", keyInput, "KeyValue:", keyValue);
						
				try {
					
					if (document.activeElement) {
						document.activeElement.blur();
					}
						
					window.focus();

					if (keyInput) { // if keyInput is not undefined
												
						if (keyInput !== 'info') {
							let aboutHeader = document.querySelector('.calc-about--header');
							let aboutBody = document.querySelector('.calc-about--body');
														
							// perform this check so that any key input will resume the app from its present state.
							if (aboutHeader.classList.contains('visible')) {
								// put the calc-history--data and calc--total-output classes back in.
								// (I hide them in order to preserve the data, so clicking "info" doesn't delete everything.
								
								view.elements.history.classList.remove('hidden');
								calcOutput.classList.remove('hidden');
								
								// hide the app info divs.
								aboutHeader.classList.remove('visible');
								aboutBody.classList.remove('visible');
							}

							view.startRender();
						}
											
						if ( !(isFunctionKey( keyValue )) ) { // check for key/button presses that
							let dataFilter = inputFilter.getFilter(); //used let because I only need block scope here.
							console.log("Current filter:", dataFilter);
							
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
								 	
								 	calcOutput.scrollLeft = calcOutput.scrollWidth;
								 	
								 	expression.pushToModel(keyInput);
								 	view.elements.screen.textContent = expression.getModel().content.data
								 		.replace(/\*/g, " ⋅ ")
								 		.replace(/\+/g, " + ")
								 		.replace(/\-/g, " - ")
								 		.replace(/\//g, " ÷ ")
								 		.replace(/sqrt/g, " √");
								 	
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
							} else if ( keyInput === 'info' ) {
								let aboutHeader = document.querySelector('.calc-about--header');
								let aboutBody = document.querySelector('.calc-about--body');
								let screenOutput = document.querySelector('#calc--total-output');
								
								screenOutput.classList.toggle('hidden');
								view.elements.history.classList.toggle('hidden');
								
								aboutHeader.classList.toggle('visible');
								aboutBody.classList.toggle('visible');
							}		
						}
						
					} else {
						throw new Error("Something totally unexpected happened: Invalid data received? How?!!");
						
					}
				}
				
				catch(err) {
					console.log(err);
					allClear(); // if something totally unexpected happens with input, just reset the calculator.
					init();
				}
				
				
			},
			
			init = function init() {
				
				//configure math.js lib to prevent round-off errors.
				math.config({
					number: 'BigNumber',
					precision: 15 // number of digits to display
				});	
				
				function addListeners() {
					document.addEventListener("keydown", parseInput, false);
					view.elements.buttons.addEventListener("click", parseInput, false);
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