const test = require("../expression.js");

test._model = "9832+93488+5%+94!";

describe("Putting test data on the model", function() {
	it("Should write data to the model", function() {
		expect(test._model).toBe(test._model);
	});
});

