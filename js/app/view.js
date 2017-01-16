/** View
 ** Most of the view is HTML & CSS -- the .calc--screen and .calc--history CSS class are the two 
 ** parts that are necessarily accessible to JavaScript.
 ************************************************************************************************
 
	 Public Properties: 
 		 elements
 	Public Methods:
 	 	getScreenContent()
 		setScreenContent()
		
		startRender: startRender,
		render: render,
		init: init,
		disableLastAns: disableLastAns,
		parens: parens,
		
		init() : set the initial state of the view.
		
 *********************************************************************************************/
 
define(['expression', 'MathJax'], function(expression) {
		
	var View = ( function() {
		
		var	elements = {
				buttons: document.getElementById("calc--buttons"),
				buffer: document.getElementById("calc--prerender"),
				screen: document.getElementById("calc--output"),
				output: document.getElementById("calc--total-output"),
				closedParens: document.getElementById("calc--parens"),
				history: document.getElementById("calc-history--data"),
				historyBuffer: document.getElementById("calc--history-prerender"),
				lastAnsButton: document.getElementById("button--ans")
			},
			
			parens = {
				addPlaceholder: function addPlaceholder() {
					var parenClosed = elements.closedParens.textContent;
	
					parenClosed += ")";
					elements.closedParens.textContent = parenClosed;
				},
				
				shiftToView: function shiftToView() {
					var parenClosed = elements.closedParens.textContent;
					
					parenClosed = parenClosed.replace(")", "");
					elements.closedParens.textContent = parenClosed;
					
				},
				
				checkForParens: function checkForParens() {
					var parenClosed = elements.closedParens.textContent;
					
					return (parenClosed.search(/[)]/g) > -1);
				},
				
				numInside: function numInside() {
					expr = expression.splitExpression("\\(+");
					
					return /\d+/.test(expr);
				}
				
			},
		
			timeout = null,
			mjRunning = false,
			mjPending = false,
			delay = 0,
					
			// Methods: All begin as private. Are made public in the return statement below their definitions.
			
			getScreenContent = function getScreenContent() {
				// returns the markup that MathJax creates to render the view
				
				return elements.buffer.innerHTML;
			},
			
			setScreenContent = function setScreenContent( content ) {
				
				elements.buffer.innerHTML = content;	
			},
			
			startRender = function startRender() {
				// render the view
/*
				if (timeout) {
					clearTimeout(timeout);
				}
				
				timeout = setTimeout(callback, delay);
				
*/
				// use requestAnimationFrame to render the view for better performance.
				requestAnimationFrame(callback);
			},
			
			swapBufferForScreen = function swapBufferForScreen() {	
				mjRunning = mjPending = false;
				
				// Only swap the buffer if it contains rendered data
				if (!(/(`\w*)/.test(elements.buffer.textContent) )) {
					
					
					elements.screen.innerHTML = elements.buffer.innerHTML;
					elements.history.innerHTML = elements.historyBuffer.innerHTML;
				}
				
				elements.output.scrollLeft = elements.output.scrollWidth;

		
			},
			
			render = function render() {
				var model = expression.getModel();
			
				
				if (model.content.data === "E R R O R !") {
					
					View.elements.screen.textContent = model.content.data;
					View.elements.history.textContent = "";
					
				} else {
				
					setScreenContent( "`"+model.content.data+"`" );
					
					if ( (model.content.firstInput === false) && (model.lastAns !== "") ) {
						model.lastExpression = "ans = " + model.lastAns;	
					}
					
					elements.historyBuffer.textContent = "`"+model.lastExpression+"`";
					
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
							["Typeset", MathJax.Hub, elements.historyBuffer],
							swapBufferForScreen
						);
					}
				}
								
			},
			
			disableLastAns = function disableLastAns(setting) {
				elements.lastAnsButton.disabled = setting;
			},
			
			init = function init() {
				disableLastAns(true);
			}
			
			callback = MathJax.Callback(render);
			
		callback.autoReset = true;
			
		return {
			elements: elements,
			startRender: startRender,
			render: render,
			init: init,
			disableLastAns: disableLastAns,
			parens: parens,
			getScreenContent: getScreenContent,
			setScreenContent: setScreenContent
		}
		
	})();
	
	return View;
});
