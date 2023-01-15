import { existsSync } from "fs";
import * as path from "path";
import { env } from "process";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

if (!existsSync("src")) {
	console.log("Skipped...");
	process.exit(0);
}

const dependencies = ["typescript"];

const dir = __dirname + "/../lib";

const isGit = existsSync(__dirname + "/.git");

console.log("Postinstall Script Started");

async function VerifyDependencies() {
	return new Promise((res, rej) => {
		console.log("Checking Package Dependencies");

		for (const dependency of dependencies) {
			try {
				import(dependency);
			} catch (err) {
				rej(
					`Lipe requires a dependency of ${dependency} when building from git. Please make sure its installed first`
				);
			}
		}
		res();
	});
}

let shouldCompile = true;

if (shouldCompile && isGit) {
	console.log("git repository detected. Skipping Compilation");
	shouldCompile = false;
}

if (shouldCompile && existsSync(dir)) {
	console.log("lib dir exists. Skipping Compilation");
	shouldCompile = false;
}

if (shouldCompile && !(env.lipe_postinstall != false)) {
	console.log(
		"environment variable lipe_postinstall is false. Skipping Compilation"
	);
	shouldCompile = false;
}


if(!shouldCompile) {
	console.log("Skipping Postinstall Compile");
	process.exit(0);
}

import { Compile } from "./CompileProject.mjs";

// Runs initial Build script if the lib folder doesn't exist (in case it was included as a git repository)
console.log(
	"Library directory is missing. Must be installing from Git. Building project from source"
);

await VerifyDependencies().catch((error) => {
	throw error;
});

const Success = await Compile();

if (!Success) console.error("Failed to Build Source");
else console.log("Built Logger from Source");


console.log("Finished Compiling Lipe Postinstall");
