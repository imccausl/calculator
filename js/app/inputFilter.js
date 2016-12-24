/* the input filter
 * ----------------
 * Each function returns an array with the names of the attributes of the inputType object that correspond to the
 * input that is allowable after the functions' corresponding input type. (e.g., isDecimalDigit checks whether a
 * digit was just inputted from the user and if so, returns an array with the kinds of input allowed following a digit such as a
 * mathematical operator, a decimal, a paren, etc). 
 *
 * PUBLC METHODS:
 * setFilter(ch, lastCh) : sets the next input filter based on current input and the last character pushed to the model.
 *						 : if no arguments are passed, then the filter is initialized for first-time/blank-slate inputs.
 * getFilter()			 : retrieves the current input filter
 * addToFilter()		 : allows for on-the-fly amendments to the inputFilter for things like decimals and parentheses.
 *******************************************************************************************************************************/

define( [], function() {
	
	var inputFilter =  ( function () {
	
		var _allowedInput = [],
		
			_inputType = {
				numbers: "0 1 2 3 4 5 6 7 8 9 ans",
				multiDiv: "* /",
				plus: "+",
				minus: "-",
				factorial: "!",
				percent: "%",
				root: "sqrt",
				log: "log",
				pow: "^",
				decimal: ".",
				leftParen: "(",
				rightParen: ")",
				evaluate: "=",
				pi: "π"
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
		
					
					if ( ( (ch >= '0') && (ch <= '9') ) || (ch === 'ans') ) {
												
						return inputRule;
						
					} else {
					
						return false;
					}
				},
				
				isDecimal: function isDecimal(ch, lastCh) {			
					if (ch === ".") {
						return ["numbers"];
						
					} else {
						return false;
					}
				},
			
				isOperator: function isOperator(ch, lastCh) {
					var operators = ['*','/', '+', '-'];
					
					if (operators.indexOf(ch) > -1) {
						return ["numbers", "leftParen", "rightParen", "minus", "plus"];
					} else {
						return false;
					}
				},
				
				isParen: function isParen(ch, lastCh) {
					var inputRules = ["numbers", "root", "minus", "plus", "pi", "log", "leftParen"],
						chFound = false;
					
					if (ch==='(') {
						chFound = true;
					} else if (ch===')') {
						chFound = true;
						inputRules.push("multiDiv", "factorial", "pow", "evaluate");
					} 
										
					if (chFound) {
						return inputRules;
					} else {
						return false;
					}
					
				},
				
				// my so-called "Special Operators" are percent and factorial, that require different input filters than the regular operators.
				isSpecOp: function isSpecOp(ch, lastCh) {
					var specOps = ['%', '!' ],
						inputRules = ["numbers","evaluate"],
						percentVal = "";
					
					if (specOps.indexOf(ch) > -1) {
						return inputRules;
					} else {
						return false;
					}
				},
				
				// Don't really know what to call this function: it sets the input filter for Exponents, Logs, and Square Roots
				isSqOrLog: function isSqOrLog(ch, lastCh) {
					var operation = ["^", "log", "sqrt"],
						inputRules = ["numbers", "plus", "minus"];
												
					if (operation.indexOf(ch) > -1) {
						return inputRules;	
					} else {
						return false;
					}
				}
			},
			
			_makeFilter = function _makeFilter(rules) {
				var	rulesStr = "",
					filterArray = [];
										
				rules.forEach(function (element) {
					rulesStr = rulesStr.concat(_inputType[element] + " ");
				});
				
				filterArray = rulesStr.split(" ");
				filterArray.pop(filterArray.length-1);
					
				return filterArray;		
	 	},
	 	
		 	_getNextFilter = function _getNextFilter(ch, lastCh) {
				var inputRules = [];
				
				
				if ( ( ch  ) !== undefined ) {					
					for( var func in _lexer ) {
												
						inputRules = _lexer[func](ch, lastCh);
						if (inputRules) {
							return _makeFilter(inputRules);
						}	
					}
				} else {
					// no input rules found, so initialize the input filter with the following allowed inputs:
					return _makeFilter(['numbers', 'plus', 'minus', 'pi', 'log', 'root', 'pow', 'decimal', 'leftParen']);
				}
			},
				
			_addToFilter = function _addToFilter(item) {
				_allowedInput.push(item);
			}
				
	
		// public methods
		return {
			
			getFilter: function getFilter() {
				return _allowedInput;
			},
			
			setFilter: function setFilter(ch, lastCh) {
				_allowedInput = _getNextFilter(ch, lastCh);
			},
			
			addToFilter: _addToFilter
			
		}
	})();
	
	return inputFilter;
});
