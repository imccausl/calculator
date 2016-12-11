/* the input filter
 * ----------------
 * Each function returns an array with the names of the attributes of the inputType object that correspond to the
 * input that is allowable after the functions' corresponding input type. (e.g., isDecimalDigit checks whether a
 * digit was just inputted from the user and if so, returns an array with the kinds of input allowed following a digit such as a
 * mathematical operator, a decimal, a paren, etc). 
 *
 * PUBLC METHODS:
 * setFilter(ch, lastCh) : sets the next input filter based on current input and the last character pushed to the model
 * getFilter() : retrieves the current input filter
 *
 * DEPENDENCIES THAT I'D LIKE TO FIX
 * splitExpression(), evaluatePercent(), lots of adhoc model modification that should be the controller's responsibility
 **************************************************/

define( [], function () {
	
	var inputFilter =  function () {
	
		var _allowedInput = [],
		
			_inputType = {
				numbers: "0 1 2 3 4 5 6 7 8 9",
				multiDiv: "* /",
				plus: "+",
				minus: "-",
				factorial: "!",
				percent: "%",
				root: "sqrt",
				log: "log",
				pow: "pow",
				decimal: ".",
				leftParen: "(",
				rightParen: ")",
				evaluate: "="
			},
		
			_lexer = {
				
				isDecimalDigit: function isDecimalDigit(ch, lastCh) {
					var inputRule = [	
							"numbers", 
							"root", 
							"leftParen",  
							"plus", 
							"minus", 
							"percent", 
							"log",
							"pow",
							"evaluate", 
							"factorial", 
							"multiDiv"		];
		
					
					if ( ((ch >= '0') && (ch <= '9')) ) {
						
						if (lastCh === "(") {
							inputRule.push("rightParen");
						} else if (lastCh === ")") {
							expression.model = expression.model.replace(/\)\d+/, ")*"+ch);
							inputRule.push("rightParen");
						} else if (lastCh==="!") {
							expression.model = expression.model.replace(/!\d+/, "!*"+ch);
						} else if (expression.splitExpression("pow").search(/(pow\(\d+\,\d+)/) > -1)  {
							inputRule.push("rightParen");
						}
						
						return inputRule;
						
					} else {
					
						return false;
					}
				},
				
				isDecimal: function isDecimal(ch, lastCh) {			
					if (ch === ".") {
						console.log("isDecimal():", "["+lastCh+"]");
						if ((lastCh === "") || (lastCh.search(/[\+\*\/-]/) > -1) || lastCh === ",") {
							expression.model = expression.model.replace(lastCh+".", lastCh+"0."); // model modification
						}
						
						return ["numbers"];
						
					} else {
						return false;
					}
				},
			
				isOperator: function isOperator(ch, lastCh) {
					var operators = ['*','/', '+', '-'];
					
					console.log("isOperator():", lastCh, ch, operators.indexOf(ch));
					
					if (operators.indexOf(ch) > -1) {
						
						if ( (operators.indexOf(lastCh) > -1) ) {
							expression.model = expression.model.replace(lastCh, ""); // model modification
						}
						
						console.log("model", expression.model);
						
						return ["numbers", "pow", "leftParen", "rightParen", "minus", "plus", "multiDiv"];
					} else {
						return false;
					}
				},
				
				isParen: function isParen(ch, lastCh) {
					var parenClosed = closedParens.text(), // view call
						inputRules = ["numbers", "root", "minus", "plus", "log", "evaluate", "leftParen"],
						chFound = false;
					
					if (ch==='(') {
						parenClosed += ")";
						closedParens.text(parenClosed); //view modification
						chFound = true;
					} else if (ch===')') {
						parenClosed = parenClosed.replace(")", "");
						closedParens.text(parenClosed); // view modification
						chFound = true;
					}
					
					console.log("parenClosed.length:", parenClosed.length, lastCh, expression.splitExpression("\[\(+\\d+]"));
							
					if ((chFound) && ((expression.splitExpression("\[\(+\\d+]").search(/\d+/) > -1) && (parenClosed.length > 0))) {
						inputRules.push("rightParen");
					} 
					
					if (chFound) {
						return inputRules;
					} else {
						return false;
					}
					
				},
				
				isSpecOp: function isSpecOp(ch, lastCh) {
					var specOps = ['%', '!' ],
						inputRules = ["numbers","evaluate"],
						percentVal = "";
					
					if (specOps.indexOf(ch) > -1) {
						switch (specOps.indexOf(ch)) {
							case 0:
								percentVal = expression.splitExpression("([\\d\+\*\\-]\d+)%");
								expression.model = expression.model.replace(percentVal, expression.evaluatePercent(percentVal));
								// should i tokenize percent expressions by saving the percent expression and its mathematical equiv
								// so I can do a find and replace at the time of expression evaluation?
								console.log("change made by % key:", expression.model);					
						}
						
						return inputRules;
					} else {
						return false;
					}
				},
				
				isSqOrLog: function isSqOrLog(ch, lastCh) {
					var operation = ["pow", "log"],
						inputRules = ["numbers", "plus", "minus"],
						output = "",
						replString = "";
						
						console.log("POW last ch:", lastCh);
						
					if (operation.indexOf(ch) > -1) {
						
						replString = expression.splitExpression("(\\d+"+operation[operation.indexOf(ch)]+")");
						output = replString.replace(/(\D+)/, "");
						
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
						return inputRules;	
						
					} else {
						return false;
					}
				}
			},
			
			_makeFilter = function _makeFilter(rules) {
				var	decimalExpression = expression.splitExpression("[\\*\\+\\/-]"),
					rulesStr = "",
					filterArray = [];
										
				rules.forEach(function (element) {
					rulesStr = rulesStr.concat(_inputType[element] + " ");
				});
				
				filterArray = rulesStr.split(" ");
				filterArray.pop(filterArray.length-1);
						
				
				if ( (decimalExpression.search(/[\.]/) === -1) ) {
					filterArray.push(".");
				}
	
				return filterArray;		
	 	},
	 	
		 	_getNextFilter = function _getNextFilter(ch, lastCh) {
				// var lastCh = expression.model.charAt(expression.model.length-2),
				var inputRules = [];
				
				
				// CONFLICT: the operator replacement functionality to work properly, 
				// lastCh has to have the previous state of the model.
						
				for( var func in _lexer ) {
					
					console.log("??", _lexer[func]);
					
					inputRules = _lexer[func](ch, lastCh);
					if (inputRules) {
						return _makeFilter(inputRules);
					}	
				}	
			}
	
		// public methods
		return {
			
			getFilter: function getFilter() {
				return _allowedInput;
			},
			
			setFilter: function setFilter(ch, lastCh) {
				_allowedInput = _getNextFilter(ch, lastCh);
			}
			
		}
	};
	
	return inputFilter;
});

//module.exports = inputFilter;