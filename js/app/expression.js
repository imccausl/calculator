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
				expr = splitExpression("[\+\*\/-]");
				
				return /[.]/.test(expr);
				
			},
			
			_modifyModel = function _modifyModel(replacer, newString) {
				_model.content.data = _model.content.data.replace(replacer, newString);	
			},
					
			splitExpression = function splitExpression(expr, str) {
				var splitFrom = new RegExp(expr, "g"),
					input = str || _model.content.data,
					lastInstance = [],
					index = 0;
												
				while (lastInstance = splitFrom.exec(input)) {
					
					index = lastInstance.index;
				}  
				
				return input.substring(index+1); 
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
				return _model.content.data.charAt(_model.content.data.length-2);	
		 	},
		 	
		 	setModel = function setModel(newModel) {
		 		_model = newModel;
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
				
				_model.content.data += ch;
				checkSyntax("presentation", ch);
			},
			
			init = function init() {
				_model.content.data = "";	
			}
		
		// Interface
		return {
			
		 	splitExpression: splitExpression,
		 	hasDecimal: _hasDecimal,
		 	pushToModel: pushToModel,
		 	getModel: getModel,
		 	setModel: setModel,
		 	getLastCh: getLastCh,
		 	checkSyntax: checkSyntax,
		 	init: init
				
		}
	
	})();
		
	return expression;
});