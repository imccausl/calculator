/* the expression module
 * ----------------
 * This is where the model lives, including methods to work with model data when necessary.
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
					_modifyModel(/π/g, "(pi)");
				},
				
				changePercent: function changePercent() {
					var percentExpression = /(\d*\.?\d*)*([\+\*\/\-])*(\d*\.?\d+)%/g,
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
							changeString = "($1$3/100)";
						}
						
					
						_modifyModel(percentExpression, changeString);
					}
				}
			},
			
			_presentationSyntax = {
				
				insertZero: function insertZero(ch) {
					var lastCh = getLastCh();
					
					
					if (ch===".") {
						if ( 
							 (lastCh === "") || 
							 (lastCh.search(/[\+\*\/-]/) > -1) || 
							 (lastCh === "g") || 
							 (lastCh === "(") || 
							 (lastCh === "^") 
							 
						   ) {
							_modifyModel(lastCh+".", lastCh+"0.");
						} else if ( (lastCh === ")") || (lastCh === "%") || (lastCh === "!") || (lastCh === "π") ) {
							_modifyModel(lastCh+".", lastCh+"*0.");
						}
					}
				},
				
				checkForExcessOperators: function checkForExcessOperators(ch) {
					var lastCh = getLastCh(),
						operators = ["+", "-", "/", "*"];	
						
									
					
					if ( (operators.indexOf(lastCh) > -1) && (operators.indexOf(ch) > -1) ) {
						
							_modifyModel(lastCh + ch, ch);
					
					}
					
					
				},
				
				prettifyExpressions: function prettifyExpressions(input) {
					var lastCh = getLastCh();
					
					console.log("prettify:", lastCh, input)
					
					if (lastCh === ")") {
						_modifyModel(/\)\d|π/, ")*"+input);
					} else if ( ( _wasDigit(lastCh) ) && (input === "(") ) {
						_modifyModel(_splitExpression(/(\d+)/), _splitExpression(/(\d+)/).replace("(", "*")+"(");		
					} else if (lastCh==="!") {
						_modifyModel(/\![\d+\(]/, "!*"+input);
					} else if ( (lastCh==="%") && (_wasDigit(input)) ) {
						_modifyModel(/%\d+/, "%*"+input);
					} else if ( (lastCh==="%") && (input==="/") ) {
						_modifyModel(/(\d+%)/, "($1)");
					} 
				}
				
			},
			
			_canHaveDecimal = function _canHaveDecimal() {
				var expr = _splitExpression("[(sqrt\d*)\+\*\/\\-\!\\%]"),
					hasOne = false;
				
				
				
				hasOne = /[\.t]/.test(expr);
				
				
				return hasOne;
				
			},
			
			_wasDigit = function _wasDigit(input) {
				return /\d/.test(input);	
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
				
				
					return input.substring(index); 
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
			 	var operators = ['+', '-', '/', '*', '%', '^', '!'];
			 	 		
				if (_model.content.firstInput === true) {
					toggleFirstInput();
					
					if ( (operators.indexOf(ch) > -1) && (_model.lastAns) ) {
						_model.content.data = _model.lastAns; // if one of the acceptable operators is pressed, push lastAns to model.
					} else {
						_model.content.data = ""; // first input after equals, clear model for a clean pushToModel slate.
					}
				}
				
				_model.content.data += ch;
				// console.log("State of the model:", _model.content);
				checkSyntax("presentation", ch);
			},
			
			toggleFirstInput = function toggleFirstInput() {
				_model.content.firstInput = !(_model.content.firstInput);	
			},
			
			init = function init() {
				_model = {
					content: {
						data: "",
						firstInput: true
					},
				
					lastExpression: "",
					lastAns: ""
				};	
			}
		
		// Interface
		return {
			
		 	canHaveDecimal: _canHaveDecimal,
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