/** View
 ** Most of the view is HTML & CSS -- the .calc--screen and .calc--history CSS class are the two 
 ** parts that are necessarily accessible to JavaScript.
 **
 ** Methods:
 ** 	getScreenContents()
 **		setScreenContents()
 ** 	init() : 	initialize the view by laying down click handlers for buttons and keys?
 *********************************************************************************************/
 
define(['inputFilter'], function() {
		
	var View = function() {
		
		var elements = {
			buttons: document.getElementById("calc--buttons"),
			buffer: document.getElementById("calc--prerender"),
			screen: document.getElementById("calc--output"),
			closedParens: document.getElementById("calc--parens"),
			history: document.getElementById("calc--history"),
		},
		
		timeout = null,
		mjRunning = false,
		mjPending = false,
		delay = 150,
		callback = MathJax.Callback("render", View),
				
		// Methods
		
		getScreenContent = function getScreenContent() {
			// this returns the markup that MathJax creates to render the view
			
			return elements.buffer.innerHTML;
		},
		
		setScreenContent = function setScreenContent( content ) {
			elements.buffer.innerHTML = content;	
		},
		
		startRender = function startRender() {
			// render the view
			if (timeout) {
				clearTimeout(timeout);
			}
			
			timeout = setTimeout(callback, delay);
		},
		
		swapBufferForScreen = function swapBufferForScreen() {
			//var buffer = View.elements.screen.innerHTML, screen = View.elements.buffer;
			
			mjRunning = mjPending = false;
			
			elements.screen.innerHTML = elements.buffer.innerHTML;
			//View.elements.screen = screen;
		},
		
		render = function render() {
			setScreenContent( "`"+model+"`" );
			
			console.log( "Render() contents of View.model:", getScreenContent() );
			console.log( "Render() View.elements.buffer: ", elements.buffer );
			console.log( "Render() View.elements.screen: ", elements.screen );
			
			// render View.model into the buffer, then swap the buffer for the screen
			// when the buffer is finished rendering.
			
			if (mjPending) return;
			
			if (mjRunning) {
				mjPending = true;
				
				MathJax.Hub.Queue(["render", this]);
			} else {
				mjRunning = true;
				
				MathJax.Hub.Queue(
					["Typeset", MathJax.Hub, elements.buffer],
					["swapBufferForScreen", this]
				
				);
			}
							
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
		
		parseInput = function( event, data ) {
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
		
		init = function init() {
			
			function addListeners() {
				document.addEventListener("keypress", parseInput, false);
				elements.buttons.addEventListener("click", parseInput, false);
				elements.screen.addEventListener("broadcast", parseInput, false);
			}
			
			addListeners();
		}
			
		callback.autoReset = true;
			
		return {
			elements: elements,
			init: init,
			startRender: startRender,
			render: render,
			getScreenContent: getScreenContent,
			setScreenContent: setScreenContent,
			model: model,
		}
		
	};
});
