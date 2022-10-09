import ts from "typescript";
import * as fs from "fs";
import glob from "glob";
import { fileURLToPath } from "url";

if (!fs.existsSync("src")) {
	console.log("Skipped...");
	process.exit(0);
}

const IsMainModule = process.argv[1] === fileURLToPath(import.meta.url);

const ModuleTable = {
	None: 0,
	[0]: "None",
	CommonJS: 1,
	[1]: "CommonJS",
	AMD: 2,
	[2]: "AMD",
	UMD: 3,
	[3]: "UMD",
	System: 4,
	[3]: "System",
	ES2015: 5,
	ES6: 5,
	[5]: "ES6",
	ES2020: 6,
	[6]: "ES2020",
	ESNext: 99,
	[99]: "ESNext",
};

/**
 * Compiles Project
 * @param {string[]} fileNames
 * @param {ts.CompilerOptions} options
 * @param {ts.CompilerOptions} options
 * @returns {Promise<boolean>} Success
 */
async function RunCompiler(fileNames, options) {
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

	if (emitResult.emitSkipped)
		console.log(`Compile Failed for Module ${ModuleTable[options.module]}`);
	else
		console.log(
			`Compile Finished for Module ${ModuleTable[options.module]}`
		);

	return !emitResult.emitSkipped;
}

/**
 * Compiles the Project with all variations
 * @returns {Promise<boolean>} Success
 * @export
 */
export function Compile() {
	const rawData = fs.readFileSync("./tsconfig.json").toString();
	const cleanData = rawData.replace(
		/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g,
		(m, g) => (g ? "" : m)
	);
	/**
	 * @type {../tsconfig.json}
	 */
	const tsconfig = JSON.parse(cleanData);

	const compilerOptions = tsconfig.compilerOptions;

	if (
		!compilerOptions["moduleResolution"] ||
		compilerOptions["moduleResolution"].toLowerCase() != "node"
	)
		throw "Module resolution must be Node";

	compilerOptions["moduleResolution"] = ts.ModuleResolutionKind.NodeJs;

	const Modules = tsconfig.modules;
	// const Targets = tsconfig.targets;

	if (!Modules || !Modules.length)
		throw "Must Define at least One Module to Compile to";

	// if (!Targets || !Targets.Length)
	// 	throw "Must Define at least One Target to Compile to";

	console.log(`Compiling Lipe with Modules: {${Modules}}`); // and Targets: {${Targets}}

	return new Promise((res, rej) => {
		glob("src/**/*.ts", (err, files) => {
			for (let module of Modules) {
				if (err) {
					console.error(err);
					return;
				}

				const options = Object.assign({}, compilerOptions);

				if (ModuleTable[module] === undefined)
					throw `Module ${module} is missing its mapping`;

				options["module"] = ModuleTable[module];
				options["outDir"] += `/${module}`;
				// options["target"] = Targets[0];

				const CompilerFailed = !RunCompiler(files, options);

				if (CompilerFailed) {
					if (IsMainModule) process.exit(1);
					else return res(false);
				}

				let pack = {
					type: null
				};

				switch(module)
				{
					case "CommonJS":
						pack.type = "commonjs"
						break;
					case "ES6":
						pack.type = "module"
					break;
					default: 
						console.warn("No package.json type for Non Standard Module " + module);
				}

				fs.writeFileSync(`./lib/${module}/package.json`, JSON.stringify(pack));
				
			}
			return res(true);
		});
	});
}

if (IsMainModule) {
	Compile();
}
