require(['require', 'expression'], function(require, expression) {
	
	expression.pushToModel("9832+93488+5%+94!");
	
	describe("Putting test data on the model", function() {
		it("Should write data to the model", function() {
			expect(test.getModel()).toBe("9832+93488+5%+94!");
		});
	});
});
//blerg

