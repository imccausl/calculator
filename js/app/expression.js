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
			
			_syntax = {
				parenify: function parenify() {
					var addParensTo = [/sqrt(\d+)/g, /log(\d+)/g],
						parensNeededOn = ["sqrt", "log"];
					
					parensNeededOn.forEach(function (element, index) {
						_modifyModel(addParensTo[index], parensNeededOn[index]+'($1)');
						console.log("Inside parenify():", index);
					});
					
				},
				
				changePi: function changePi() {
					_modifyModel(/π/g, "pi");
				},
				
				changePercent: function changePercent() {
					var percentExpression = /(\d*)([\+\*\/-])*(\d+)%/g,
						operator = [],
						changeString = "";
						
					operator = percentExpression.exec(_model.content.data);
					
					if (operator !== null) {
						if (operator[2] !== undefined) {	
							if (operator[2] === "*" || operator[2] === "/") {
								changeString = "($1$2($3/100))"
							} else {
								changeString = "($1$2$1($3/100))"
							}
						} else {
							changeString = "($3/100)";
						}
					
						_modifyModel(percentExpression, changeString);
					}
				}
			},
			
			_modifyModel = function _modifyModel(regex, newString) {
				_model.content.data = _model.content.data.replace(regex, newString);	
			},
					
			splitExpression = function splitExpression(expr, str) {
				var splitFrom = new RegExp(expr, "g"),
					input = str || _model.content.data,
					lastInstance = [],
					index = 0;
							
				while ((lastInstance = splitFrom.exec(input))) {
					index = lastInstance.index;
				}  
				
				return input.substring(index); 
			},
			
			
			evaluatePercent = function evaluatePercent(str) {
			 	var operators = new RegExp("[\+\*\/-]", "g"),
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
		 	
		 	getLastCh = function getLastCh() {
				return _model.content.data.charAt(_model.length-1);	
		 	},
		 	
		 	setModel = function setModel(newModel) {
		 		_model = newModel;
		 	},
		 	
		 	checkSyntax = function checkSyntax() {
			 	for (var func in _syntax) {
				 	console.log("Running:", func, "in _syntax");
				 	_syntax[func]();
			 	}
			 	
			 	console.log("completed checkSyntax(). Model updated:", _model.content.data);
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
		 	setModel: setModel,
		 	getLastCh: getLastCh,
		 	checkSyntax: checkSyntax,
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
