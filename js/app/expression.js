/* the expression module
 * ----------------
 * Each function returns an array with the names of the attributes of the inputType object that correspond to the
 * input that is allowable after the functions' corresponding input type. (e.g., isDecimalDigit checks whether a
 * digit was just inputted from the user and if so, returns an array with the kinds of input allowed following a digit such as a
 * mathematical operator, a decimal, a paren, etc). 
 * ************************************************
 
   PUBLIC METHODS:
   
   hasDecimal(): 
   
   splitExpression(regex, input):
    
   toggleFirstInput(boolean):
    
   pushToModel(input): 
   
   getModel():
    
   setModel({model obj}):
    
   getLastCh():
    
   checkSyntax():
    
   getLastAns():
   
   init():

 *******************************************************************************************************************************/
 
define( [], function (expression) {
	
	var expression = ( function() {
		
		var _model = {
				content: {
					data: "",
					firstInput: true
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
					});
					
				},
				
				changePi: function changePi() {
					_modifyModel(/π/g, "pi");
				},
				
				changePercent: function changePercent() {
					var percentExpression = /(\d*\.?\d*?)?([\+\*\/\-])*(\d+\.?\d*?)%/g,
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
			
			_presentationSyntax = {
				
				insertZero: function insertZero() {
					var lastCh = getLastCh();
										
					if ( (lastCh === "") || (lastCh.search(/[\+\*\/-]/) > -1) || (lastCh === ",") ) {
						_modifyModel(lastCh+".", lastCh+"0.");
					}
				},
				
				checkForExcessOperators: function checkForExcessOperators(ch) {
					var lastCh = getLastCh(),
						operators = ["+", "-", "/", "*"];					
					
					if ( (operators.indexOf(lastCh) > -1) && (operators.indexOf(ch) > -1) ) {
						_modifyModel(lastCh, "");
					}
				},
				
				prettifyParenExpressions: function prettifyParenExpressions(input) {
					var lastCh = getLastCh();
					
					if (lastCh === ")") {
						_modifyModel(/\)\d+/, ")*"+input);
					} else if (lastCh==="!") {
						_modifyModel(/!\d+/, "!*"+input);
					} 
				}
			},
			
			_hasDecimal = function _hasDecimal() {
				expr = _splitExpression("[\+\*\/-]");
				
				return /[.]/.test(expr);
				
			},
			
			_modifyModel = function _modifyModel(replacer, newString) {
				_model.content.data = _model.content.data.replace(replacer, newString);	
			},
					
			_splitExpression = function splitExpression(expr, str) {
				var splitFrom = new RegExp(expr, "g"),
					input = str || _model.content.data,
					lastInstance = [],
					index = 0;
												
				while (lastInstance = splitFrom.exec(input)) {
					
					index = lastInstance.index;
				}  
				
				return input.substring(index+1); 
			},
					 	
		 	getModel = function getModel() {
			 	return _model;
		 	},
		 	
		 	getLastCh = function getLastCh() {
				return _model.content.data.charAt(_model.content.data.length-2);	
		 	},
		 	
		 	setModel = function setModel(newModel) {
		 		_model = newModel;
		 	},
		 	
		 	getLastAns = function getLastAns() {
			 	return _model.lastAns;
		 	},
		 	
		 	checkSyntax = function checkSyntax(type) {
			 	var runType = null,
			 		args = arguments[1]; // presentation syntax methods take the current character as an argument in some situations
			 	
			 	if (type.toLowerCase() === "syntax") {
				 	runType = _syntax;
			 	} else {
				 	runType = _presentationSyntax;
			 	}
			 	
			 	for (var func in runType) {
				 	runType[func](args);
			 	}
			 	
		 	},
		 	
		 	
		 	
		 	pushToModel = function pushToModel(ch) {
			 	console.log("Current model state:", _model.content.data);
			 		 		
				if (_model.content.firstInput === true) {
					toggleFirstInput();
					_model.content.data = "";
				}
				
				_model.content.data += ch;
				checkSyntax("presentation", ch);
			},
			
			toggleFirstInput = function toggleFirstInput() {
				_model.content.firstInput = !(_model.content.firstInput);	
			},
			
			init = function init() {
				_model.content.data = "";	
			}
		
		// Interface
		return {
			
		 	hasDecimal: _hasDecimal,
		 	splitExpression: _splitExpression,
		 	toggleFirstInput: toggleFirstInput,
		 	pushToModel: pushToModel,
		 	getModel: getModel,
		 	setModel: setModel,
		 	getLastCh: getLastCh,
		 	checkSyntax: checkSyntax,
		 	getLastAns: getLastAns,
		 	init: init
				
		}
	
	})();
		
	return expression;
});