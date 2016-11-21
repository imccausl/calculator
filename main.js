// things to complete:
// negative numbers
// delete key / CE functionality
// validated input when % or ! is used in expressions


( function( $, window ) {

	var utils = {
		addListeners: function addListeners() {
			$( ".calc--buttons div" ).on( "click", "button", View.publish );
			$( window ).on( "keypress", View.publish );	
		},
		
		subscribe: function subscribe( subscription, handler ) {
			var o = View.screen;
			
			o.on( subscription, handler );
		},
		
		/* validateInput needs to return an object containing the property "isValid" and 
		 * if isValid = true, a property with the valid input to send to the Model.
	     */
		
		validateInput: function validateInput( history, input ) {
			
			var operators = ['*','×','/','÷','+','-','.','%'],
				lastChar = history.charAt(history.length - 1),
				containsDecimal = /[\.]/,
				decimalExpression = this.splitExpression(history),
				validCharacters = /[0-9\/\*\-\+×÷=\.()%!]/,
				validCharAfterSpecOps = /[0-9\/\*\-\+×÷=]/,
				data = {};
							
			if (input.search(validCharacters) === 0) { // if input is a valid character, first test is passed.
				
				//check if input is nevertheless invalid based on current state of the data:
			    if ((operators.indexOf(lastChar) > -1) && (operators.indexOf(input) > -1)) {
				//case 1: last character on the screen is an operator & current input is an operator 
				
					data.isValid = false;
				   
				} else if ((( lastChar === '!') || (lastChar === '%')) && (input.search(validCharAfterSpecOps) === 0)) {
				//case 2: last character on the screen is a "!" or "%" and input is +,-,÷,*, or a number.
				
					//output is valid with conditions
					data.isValid = true;
					
					// if input is a number then we need to make some changes to the data; if it's an operator then it doesn't matter.
					if (input.search(/[0-9]/) === 0) {
						// use a different default operator for factorial or percent.
						if (lastChar === '!') {
							data.write = '*' + input;
						} else if (lastChar === '%') {
							data.write = "+" + input;
						}
					} else {
						data.write = input;
					}
					
				} else if ((operators.indexOf(input) > -1) && (history === "")) {
				//case 3: input is an operator but there is nothing on the screen	
				
					data.isValid = false;
				
				} else if ((decimalExpression.search(containsDecimal) !== -1) && (input === '.')) {
				//case 4: a number with a decimal is on the screen and a decimal is entered again.
				
					data.isValid = false;
					
				} else if ((operators.indexOf(lastChar) > -1) && (input === '=')) {
				//case 5: last character on the screen is an operator that isn't "!" and input is '='.	
				
					data.isValid = false;
				
				} else {
					
					data.isValid = true;
				    data.write = input; // return valid output
				
				} // end data-state validation check
			
			} else {
				data.isValid = false; 
			} // end generalized input validation check
			
			return data;
		},
		
		splitExpression: function splitExpression( input ) {
			var operators = /[*×\/÷\+-]/g,
				splitFrom = [],
				index = 0;
		
			while ((splitFrom = operators.exec(input)) !== null ) {
				index = splitFrom.index;
			}  
			
			return input.substring(index+1);
		}	
	};
	
	/** Model
	 ** 
	 **
	 **
	 **
	 **
	 *********************************************************************************************/
	var Model = {
		
		screenData: "",
		lastExpression: "",
		lastAnswer: "",
		savedAnswer: "",
		
		concatScreenData: function concatScreenData( data ) {
			this.screenData = this.screenData + data;
		},
		
		getScreenData: function getScreenData() {
			return this.screenData;
		},
		
		setScreenData: function setScreenData( data ) {
			this.screenData = data;
		},
		
		getLastAnswer: function getLastAnswer() {
			return this.lastAnswer;
		},
		
		setLastAnswer: function setLastAnswer ( data )	{
			this.lastExpression = this.screenData;
			this.lastAnswer = data;
		},
		
		setLastExpression: function( data ) {
			this.lastExpression = data;
		},
		
		getLastExpression: function( data ) {
			return this.lastExpression;
		}
	};
	
	/** View
	 ** Most of the view is HTML & CSS -- the .calc--screen and .calc--history CSS class are the two 
	 ** parts that are necessarily accessible to JavaScript.
	 **
	 ** Methods:
	 ** 	getScreenContents()
	 **		setScreenContents()
	 ** 	init() : 	initialize the view by laying down click handlers for buttons and keys?
	 *********************************************************************************************/
	var View = {
		// View interface elements
		screen: $('.calc--screen'),
		history: $('.calc--history'),
		
		// Methods
		
		getScreenContent: function getScreenContent() {
			return this.screen.val();
		},
		
		render: function render( screen, history ) {
			this.screen.val( screen );
			
			if ( Model.getLastAnswer() ) {
				console.log( Model.getScreenData() );
				this.history.text( history + " =" );
			}
		},
		
		publish: function publish( event ) {
			var o = View.screen,
				EVENT_TYPE = "View:input";
			
			o.trigger.call( o, EVENT_TYPE, event );
				
		},
		
		init: function init() {
			utils.addListeners();	
		}	
		
	};
	
	
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
			var history = Model.getScreenData(),
				keyValue = data.target.value || String.fromCharCode( data.which ),
				keyInput = data.target.value || data.which,
				view = utils.validateInput( history, keyValue );
				
				
			// IMPORTANT DATA: {keypress: data.which; click: data.target.value}
			
			// this function routes valid inputs and ignores invalid inputs (such as letters),
			// but also including two operators (+-) in a row, two decimals (..) in a row, etc.
					
			if (keyInput) { // if keyInput is not undefined
				
				if ( !(Controller.isFunctionKey( keyInput )) ) { // check for key/button presses that
																 // perform calc functions.			
									
					if ( view.isValid ) { // if input is NOT invalid
						
						Model.concatScreenData( view.write );	
					
					} 
						 
				} else {
					
					// evaluate expression
					if( (keyValue === '=' ) || (keyInput === 13) ) {
						
						console.log( view.isValid );
						
						if ( view.isValid ) {
							Model.setLastAnswer( math.eval( Model.getScreenData() ).toString() );
							Model.setScreenData( Model.getLastAnswer() );
						}
					} else if( (keyValue === 'ac') ) {
						Model.setScreenData("");
						history = Model.getScreenData();	
					}					
				}
				
			} else {
				Console.log("Error: invalid data.");
			}
			
			// render the view
			View.render( Controller.renderViewFromModel( Model.getScreenData() ), 
						 Controller.renderViewFromModel( Model.getLastAnswer() ) );
		},
		
		renderViewFromModel: function renderViewFromModel( data ) {
			var multiplyExp = /[*]/g,
				divideExp = /[\/]/g,
				subtractExp = /[-]/g,
				addExp = /[\+]/g;
			
			if (typeof data === 'string') {
				data = data.replace(multiplyExp, " × ")
						   .replace(divideExp, " ÷ ")
						   .replace(subtractExp, " - ")
						   .replace(addExp, " + ");
			}
			
			return data;
		},
		
		init: function init() {
			utils.subscribe( "View:input", this.parseInput );
		}
	};
	
	View.init();
	Controller.init();
		
}(jQuery, window));


