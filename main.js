( function( $, window ) {

	var utils = {
		addListeners: function addListeners() {
			$( ".calc--buttons div" ).on( "click", "button", View.publish );
			$( window ).on( "keypress", View.publish );	
		},
		
		subscribe: function subscribe( subscription, handler ) {
			var o = View.screen;
			
			o.on( subscription, handler );
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
		
		render: function render() {
			this.screen.val( Model.getScreenData() );
			
			if ( Model.getLastAnswer() ) {
				console.log( Model.getScreenData() );
				this.history.text( Model.getLastExpression() + " =" );
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
				case '%':	
				case 'ac':
				case 'ce':
				
				case 13:
					return true;	
				default:
					return false;
			}
		},
		
		parseInput: function( event, data ) {
			var keyValue = data.target.value || String.fromCharCode( data.which );
			var keyInput = data.target.value || data.which;
			
			// IMPORTANT DATA: {keypress: data.which; click: data.target.value}
			
			// this function routes valid inputs and ignores invalid inputs (such as letters),
			// but also including two operators (++) in a row, two decimals (..) in a row, etc.
					
			if (keyInput) { // if keyInput is not undefined
				
				if ( !(Controller.isFunctionKey( keyInput )) ) { // check for key/button presses that
																 // perform calc functions.
					Model.concatScreenData( keyValue );		
						 
				} else {
					
					if( (keyValue === '=' ) || (keyInput === 13) ) {
						//FOR TESTING PURPOSES
						console.log("evaluate expression");
						Model.setLastAnswer( math.eval( Model.getScreenData() ) );
						Model.setScreenData( Model.getLastAnswer() );
					}
					
				}
				
			} else {
				Console.log("Error: invalid data.");
			}
			
			// render the view
			View.render();
		},
		
		init: function init() {
			utils.subscribe( "View:input", this.parseInput );
		}
	};
	
	View.init();
	Controller.init();
		
}(jQuery, window));


