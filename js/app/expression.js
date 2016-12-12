/** MODEL **/

/* the expression module
 * ---------------------
 * this is the home of the model, where the calculator's data lives in -- ideally -- its raw, unprocessed form.
 *
 */
 
define( [], function (expression) {
	
	var expression = ( function() {
		
		var _model = {
				content: {
					data: "",
					isValid: false
				},
				
				lastExpression: "",
				lastAns: ""
			},
					
			splitExpression = function splitExpression(expr, str) {
				var splitFrom = new RegExp(expr, "g"),
					input = str || _model.content.data;
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
		 	
		 	
		 	pushToModel = function pushToModel(ch) {		
				_model.content.data += ch;
				console.log(_model.content.data);
			},
			
			init = function init() {
				_model.content.data = "";	
			}
		
		// Interface
		return {
			
		 	splitExpression: splitExpression,
		 	pushToModel: pushToModel,
		 	getModel: getModel,
		 	init: init
				
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
		
		
		
		
		
		}
	};
	
	function render() {
		output.text( expression.model ); // view modification (for testing purposes)
	}
	
	expression.init();
	*/
	
	return expression;
});

//module.exports = expression;




/* expression calls from inputFilter:

// converts strings such as x% or 10+x% into an evaluatable value:

switch (specOps.indexOf(ch)) {
	case 0:
		percentVal = expression.splitExpression("([\\d\+\*\\-]\d+)%");
		expression.model = expression.model.replace(percentVal, expression.evaluatePercent(percentVal));
		// should i tokenize percent expressions by saving the percent expression and its mathematical equiv
		// so I can do a find and replace at the time of expression evaluation?
		console.log("change made by % key:", expression.model);					
	}
	
// contains both expression and view calls: 
// converts logs and powers into a syntactically correct expression

	var replString = expression.splitExpression("(\\d+"+operation[operation.indexOf(ch)]+")"),
		output = replString.replace(/(\D+)/, "")
						
	switch(operation.indexOf(ch)) {
		case 0:
			output = "pow("+output+",";
			expression.model = expression.model.replace(/(\d+pow)/, output);						
			console.log("POW:", output);	
			break;
		case 1:
			output = "log(";
			expression.model = expression.model.replace(/log(\(\d+\))^/, output);
		}
	
	closedParens.text(closedParens.text()+")"); // view modification (for testing purposes)
	
*/
