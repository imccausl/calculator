// things to remember to work on:
// negative numbers
// 
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
		
		validateInput: function validateInput( history, input ) {
			var operators = ['*','×','/','÷','+','-','%','.', '!'],
				lastChar = history.charAt(history.length - 1),
				containsDecimal = /[\.]/,
				decimalExpression = this.splitExpression(history),
				validCharacters = /[0-9\/*-\+×÷=()*%!]/g,
				validInput = validCharacters.exec(input);
				
				console.log( "last input:", input.search(validCharacters), "history:", input );
							
				
				if ( 
				
	           ((operators.indexOf(lastChar) > -1) && (operators.indexOf(input) > -1)) ||
			
	           ((operators.indexOf(lastChar) > -1) && (input === '=')) && (( lastChar !== '!')) ||
			     
			   ((operators.indexOf(input) > -1) && (history === "")) ||
			   
			   ((decimalExpression.search(containsDecimal) !== -1)) && (input === '.') 
				   
				  ) {
					 	
					 return true; // invalid order of characters
				
				} else if (input.search(validCharacters) !== 0) {
				
					return true; // not a valid character
				
				}
							
			return false; // valid input
			
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
				keyInput = data.target.value || data.which;
				
				
			// IMPORTANT DATA: {keypress: data.which; click: data.target.value}
			
			// this function routes valid inputs and ignores invalid inputs (such as letters),
			// but also including two operators (+-) in a row, two decimals (..) in a row, etc.
					
			if (keyInput) { // if keyInput is not undefined
				
				if ( !(Controller.isFunctionKey( keyInput )) ) { // check for key/button presses that
																 // perform calc functions.			
					
					if ( !(utils.validateInput( history, keyValue )) ) {
						Model.concatScreenData( keyValue );	
					} 
						 
				} else {
					
					// evaluate expression
					if( (keyValue === '=' ) || (keyInput === 13) ) {
						
						if ( !(utils.validateInput( history.charAt(history.length - 1), '=') ) ) {
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


