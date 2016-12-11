require(['inputFilter'], function(inputFilter) {
	
	console.log(inputFilter);

	describe("Input filter", function() {
		it("should return an input filter for the next input based on the current input", function() {
			var numberFilter = 
				["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "sqrt", "(", "+", "-", "%", "log", "pow", "=", "!", "*", "/", "."],
				currentFilter = [];
				
			inputFilter.setFilter("8", "");
			currentFilter = inputFilter.getFilter();
				
			expect(currentFilter.join("")).toBe(numberFilter.join(""));
		});
	});
});			