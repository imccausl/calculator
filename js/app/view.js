/** View
 ** Most of the view is HTML & CSS -- the .calc--screen and .calc--history CSS class are the two 
 ** parts that are necessarily accessible to JavaScript.
 **
 ** Methods:
 ** 	getScreenContents()
 **		setScreenContents()
 ** 	init() : 	initialize the view by laying down click handlers for buttons and keys?
 *********************************************************************************************/
 
var View = ( function View() {
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
	
	init = function init() {
		
		console.dir(callback)
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
	
})();
