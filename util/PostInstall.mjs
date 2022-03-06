// Runs initial Build script if the lib folder doesn't exist (in case it was included as a git repository)

import { exec, spawn } from "child_process";
import { existsSync, fstat, renameSync } from "fs";
import * as path from "path";
import { cwd } from "process";
import { Compile } from "./CompileProject.mjs";
import { env } from "process";

const dependencies = ["typescript"];

const shell = process.argv.shift();
const script = process.argv.shift();

const args = process.argv;
const dir = path.join(cwd(), args[0] || "lib");

const isGit = existsSync(".git");

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

if (shouldCompile && existsSync(dir)) {
	console.log("lib dir exists. Skipping Compilation");
	shouldCompile = false;
}

if (shouldCompile && !(env.lipe_postinstall != false)) {
	console.log("environment variable lipe_postinstall is false. Skipping Compilation");
	shouldCompile = false;
}
if (shouldCompile && isGit) {
	console.log("git repository detected. Skipping Compilation");
	shouldCompile = false;
}

// Runs initial Build script if the lib folder doesn't exist (in case it was included as a git repository)
if (shouldCompile) {
	console.log(
		"Library directory is missing. Must be installing from Git. Building project from source"
	);

	await VerifyDependencies().catch((error) => {
		throw error;
	});

	const Success = await Compile();

	if (!Success) console.error("Failed to Build Source");
	else console.log("Built Logger from Source");
}

console.log("Postinstall Script finished");
