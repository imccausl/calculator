function splitExpression( input ) {
		var operators = /[*×\/÷\+-]/g,
			splitFrom = [],
			index = 0;
		
		while ((splitFrom = operators.exec(input)) !== null ) {
			index = splitFrom.index;
		}  
		
		return input.substring(index+1);
}

splitExpression( "4.3+98÷99");