import {getErrorObject} from "../src/utils/ErrorHandling"

describe("Get Error Object", () => {

	test("Able to retrieve an error object", () => {
		expect(getErrorObject()).toEqual(new Error())
	})

	test("Able to generate a error in a non V8 engine", () => {
		expect(getErrorObject({} as any as Error)).toEqual(new Error())
	})

})


describe("Able to format messages as expected", () => {

});
