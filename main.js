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
		
		getScreenData: function getScreenData() {
			return this.screenData;
		},
		
		setScreenData: function setScreenData( data ) {
			this.screenData = this.screenData.concat( data );
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
		
		setScreenContent: function setScreenContent( newContent ) {		
			Model.setScreenData( newContent );	
		},
		
		render: function render() {
			this.screen.val( Model.getScreenData() );
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
		
		parseInput: function( event, data ) {
			// IMPORTANT DATA: {keypress: data.which; click: data.target.value}
			
			// first step, check if data.type is "keypress" or "click"
			if (data.type === 'click') {
				View.setScreenContent( data.target.value );
			} else if (data.type === 'keypress') {
				// convert CharCode into ASCII Character
				// IMPORTANT: Replace * and / with symbols used on the keypad.
				
				View.setScreenContent( String.fromCharCode(data.which) );
			} else {
				Console.log("Error: invalid data type.");
			}
			
			View.render();
		},
		
		init: function init() {
			utils.subscribe( "View:input", this.parseInput );
		}
	};
	
	View.init();
	Controller.init();
		
}(jQuery, window));


