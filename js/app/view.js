/** View
 ** Most of the view is HTML & CSS -- the .calc--screen and .calc--history CSS class are the two 
 ** parts that are necessarily accessible to JavaScript.
 **
 ** Methods:
 ** 	getScreenContents()
 **		setScreenContents()
 ** 	init() : 	initialize the view by laying down click handlers for buttons and keys?
 *********************************************************************************************/
 
define(['expression', 'MathJax'], function(expression) {
		
	var View = ( function() {
		
		var	elements = {
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
					
			// Methods: All begin as private. Are made public in the return statement below their definitions.
			
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
				var model = expression.getModel();
				
				setScreenContent( "`"+model.content.data+"`" );
				
				console.log( "Render() contents of View.model:", model.content.data );
				console.log( "Render() View.elements.buffer: ", elements.buffer );
				console.log( "Render() View.elements.screen: ", elements.screen );
				
				// render View.model into the buffer, then swap the buffer for the screen
				// when the buffer is finished rendering.
				
				if (mjPending) return;
				
				if (mjRunning) {
					mjPending = true;
					
					MathJax.Hub.Queue(render);
				} else {
					mjRunning = true;
					
					MathJax.Hub.Queue(
						["Typeset", MathJax.Hub, elements.buffer],
						swapBufferForScreen
					);
				}
								
			},
			
			callback = MathJax.Callback(render);
			
		callback.autoReset = true;
			
		return {
			elements: elements,
			startRender: startRender,
			render: render,
			getScreenContent: getScreenContent,
			setScreenContent: setScreenContent
		}
		
	})();
	
	return View;
});
