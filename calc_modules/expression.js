/** MODEL **/

/* the expression module
 * ---------------------
 * this is the home of the model, where the calculator's data lives in -- ideally -- its raw, unprocessed form.
 *
 */
 
var expression = ( function expression() {
	
	var _model = "",
		_view = "",
	
		_modifyView = function _modifyView(str, replacement) {
			_view = _model.replace(str, replacement);
		},
		
		splitExpression = function splitExpression(expr, str) {
			var splitFrom = new RegExp(expr, "g"),
				input = str || _model;
				lastInstance = [],
				index = 0;
						
			while ((lastInstance = splitFrom.exec(input))) {
				index = lastInstance.index;
			}  
			
			return input.substring(index); 
		},
		
		
		evaluatePercent = function evaluatePercent(str) {
		 	var operators = new RegExp("[\+\*\\-]", "g"),
		 		percentVal = str.substring(str.search(operators)+1),
		 		opr = str.substring(str.search(operators), str.search(operators)+1),
		 		num = str.substring(0, str.search(operators));
		 	
		 	percentVal = math.eval(percentVal.replace(/%/g, "")+"/100").toString();
		 	
		 	if ((opr === "+") || (opr === "-")) {
			 	num = "(" + num + opr + num + "*" + percentVal + ")";
		 	} else if ((opr === "*") || (opr === "/")) {
			 	num = num + opr + percentVal;
		 	} else {
			 	num = percentVal;
		 	}
		 	
		 	return num;	
	 	}, 
	 	
	 	getModel = function getModel() {
		 	return _model;
	 	},
	 	
	 	getView = function getView () {
		 	return _view;	
	 	},
	 	
	 	pushToModel = function pushToModel(ch) {		
			_model += ch;
			console.log(_model);
		}
	
	// Interface
	return {
		
	 	splitExpression: splitExpression,
	 	pushToModel: pushToModel,
	 	getModel: getModel,
	 	getView: getView,
	 	modifyView: _modifyView
			
	}

})();




 	// *** end lexer ** generic model functions for getting input from the view and initializing the model follow //
/*
	
	getInput: function getInput(event) {
		var ch = event.target.value || String.fromCharCode( event.which );
		
		console.log("Applying rule:", inputFilter.allowedInput, ch);

		 if (inputFilter.allowedInput.indexOf(ch) > -1) {	
			if (ch==="=") {
				expression.model = expression.model + closedParens.text() // concatenation of model and view (closedParens data)
				closedParens.text(""); // view modification 
				expression.model = math.eval(expression.model).toString();
				render();
				expression.init();
			} else {
				expression.pushToModel(ch);
			}
		} 
	},
	
	
	
	init: function init() {
		var initialInput = "0 1 2 3 4 5 6 7 8 9 . ( - + π log pow sqrt";
		expression.model = "";
		
		inputFilter.allowedInput = initialInput.split(" ");
		
		$( ".calc--buttons div" ).on( "click", "button", expression.getInput );
		$( window ).on( "keypress", expression.getInput );
		
	}
};

function render() {
	output.text( expression.model ); // view modification (for testing purposes)
}

expression.init();
*/


