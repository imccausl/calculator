$( function() {
	
	var calc = {
		screen: $( ".calc--screen" ),
		
		history: $( ".calc--history" ),
		
		input: [],
		
		ans: null,
		
		clear: function( save ) {
			this.screen.val("");
		},
		
		print: function( val ) {
			if (this.validate( val )) {
				this.screen.val( this.screen.val() + val );
			}
		},
		
		validate: function ( val ) {
			
			var symbols = /[\+\-÷×\.!]/,
				numbers = /[0-9]/,
				content = this.getScreenContents(),
				search = content.charAt(content.length - 1);
			
			console.log((typeof val), search.search(symbols), val.search(numbers));
				
			if ( ( search.search(symbols) === -1 ) || (val.search(numbers) !== -1) ) { 
				// the last symbol entered was not a mathematical operator...
				if ( (content.length > 0) || (val.search(numbers) !== -1) ) { 
					// ... so if it isn't the first thing to be entered, then we're good.
					return true; 
				}
			}
				
			return false;
				
		},
		
		evaluateExp: function( val ) {
			this.input = val;
			this.history.text( this.input + " =" );
			console.log("evaluate!");
			this.print( eval(val).toString() );
		},
		
		parseInput: function( val ) {
			
						
			switch( val ) {
				
				case "=":
					console.log( this.validate(this.getScreenContents()) );
					if ( this.validate(this.getScreenContents()) ) {
						this.evaluateExp(this.getScreenContents());
					}
					
					break;
				case "ce":
				case "ac":
				default:
					this.print( val );
			} 
			
			
		},
	
		getScreenContents: function() {
			return this.screen.val();
		}
		
	};
		
	$( "button" ).on( "click", function( event ) {
		var clicked = $(this);
		
		calc.parseInput( clicked.val() );		
	});

});
