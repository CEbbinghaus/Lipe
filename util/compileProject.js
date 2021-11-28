import ts from "typescript";
import * as fs from "fs";
import glob from "glob";

/**
 * Compiles Project
 * @param {string[]} fileNames
 * @param {ts.CompilerOptions} options
 * @param {ts.CompilerOptions} options
 */
function compile(fileNames, options) {
	const host = ts.createCompilerHost(options);
	let program = ts.createProgram(fileNames, options, host);
	let emitResult = program.emit();

	let allDiagnostics = ts
		.getPreEmitDiagnostics(program)
		.concat(emitResult.diagnostics);

	allDiagnostics.forEach((diagnostic) => {
		if (diagnostic.file) {
			let { line, character } = ts.getLineAndCharacterOfPosition(
				diagnostic.file,
				diagnostic.start
			);
			let message = ts.flattenDiagnosticMessageText(
				diagnostic.messageText,
				"\n"
			);
			console.log(
				`${diagnostic.file.fileName} (${line + 1},${
					character + 1
				}): ${message}`
			);
		} else {
			console.log(
				ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")
			);
		}
	});

	let exitCode = emitResult.emitSkipped ? 1 : 0;
	console.log(`Process exiting with code '${exitCode}'.`);
	process.exit(exitCode);
}

/**
 * @type {../tsconfig.json}
 */
const tsconfig = JSON.parse(fs.readFileSync("./tsconfig.json"));

const compilerOptions = tsconfig.compilerOptions;

glob("src/**.ts", (err, files) => {
	if (err) {
		console.error(err);
		return;
	}
	const options = {
		"Classic": ts.ModuleResolutionKind.Classic,
		"Node": ts.ModuleResolutionKind.NodeJs
	};

	compilerOptions["moduleResolution"] = options[compilerOptions["moduleResolution"]];

	compile(files, compilerOptions);
});
