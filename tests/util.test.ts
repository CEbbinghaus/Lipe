import { getErrorObject } from "../src/utils/ErrorHandling"
import { Format } from "../src/utils/Formatter"
import { getCallerInfo } from "../src/utils/util"


describe("GetErrorObject", () => {

	test("Able to retrieve an error object", () => {
		expect(getErrorObject()).toEqual(new Error())
	})

	test("Able to generate a error in a non V8 engine", () => {
		expect(getErrorObject({} as any as Error)).toEqual(new Error())
	})

})


describe("Format", () => {
	test("Formatter Leaves messages without braces unmodified", () => {
		let value = "test12334567890";
		expect(Format(value, null)).toEqual(value);
	})

	test("Formatter Regenerates tokens correctly by default", () => {
		let value = "{@token1} {token.two} {token.three:format}";
		expect(Format(value, null)).toEqual(value);
	})

	test("Formatter doesn't regenerate tokens", () => {
		let value = "{@token1} {token.two}	{token.three:format}";
		expect(Format(value, null, {RegenerateUnknownTokens: false})).toEqual(" 	");
	})

	test("Formatter Interpolates string values correctly", () => {
		expect(Format("{a} {b} {c} {d} {e}", {a: "", b: "test", c: "reallylongstringwithlotsofcharactersandsome3201421534537819", d: "string with spaces", e: "string\nwith\rescape\ncharacters\t"}))
			.toEqual(" test reallylongstringwithlotsofcharactersandsome3201421534537819 string with spaces string\nwith\rescape\ncharacters\t");
	})

	test("Formatter Interpolates number values correctly", () => {
		expect(Format("{a} {b} {c} {d} {e}", {a: 0, b: 420, c: 1.25523215214213412e+25, d: -1, e: NaN}))
			.toEqual("0 420 1.2552321521421341e+25 -1 NaN");
	})

	test("Formatter Interpolates nested objects", () => {
		expect(Format("{a.b.c} {a.b.f} {!b}", {a: {b: {c: "test", f: 42}}, b: {}}))
			.toEqual("test 42 [object Object]");
	})

	test("Formatter Interpolates Arrays Correctly", () => {
		let arr = ["a", 2, null]
		expect(Format("{arr} {!arr}", {arr}))
			.toEqual("[a, 2, null] a,2,");
	})

	test("Formatter correctly formats json", () => {
		expect(Format("{@json}", {json: {here: "is", a: {object: 42}}}))
			.toEqual(`{"here":"is","a":{"object":42}}`);
	})

	test("Formatter correctly resolves unclosed token", () => {
		expect(Format("{test", {}))
			.toEqual("{test");
	})

	test("Formatter correctly resolves empty tokens", () => {
		expect(Format("{}", {}))
			.toEqual("{}");

		expect(Format("{}", null))
			.toEqual("{}");

		expect(Format("{}", {}, {RegenerateUnknownTokens: false}))
			.toEqual("");

		expect(Format("{}", null, {RegenerateUnknownTokens: false}))
			.toEqual("");
	})

	test("Formatter correctly resolves double braces", () => {
		expect(Format("{{guid}}", {guid: "c2eddd11-b4bc-4a20-aead-7eee41e869da"}))
			.toEqual("{c2eddd11-b4bc-4a20-aead-7eee41e869da}")

		expect(Format("{testing {braces}}", {braces: 42}))
			.toEqual("{testing 42}")
	})
});

describe("Getting caller information works", () => {
	test("is able to get caller info", () => {
		const obj = getCallerInfo();

		expect(obj).toEqual(null);
	})
})
