// Runs initial Build script if the lib folder doesn't exist (in case it was included as a git repository)

import { exec, spawn } from "child_process";
import { existsSync, fstat, renameSync} from "fs";
import * as path from "path";
import { cwd } from "process";
import { Compile } from "./CompileProject.mjs"
import { env } from "process"

const dependencies = ["typescript"]

const shell = process.argv.shift();
const script = process.argv.shift();

const args = process.argv;
const dir = path.join(cwd(), args[0] || "lib")

console.log("Postinstall Script Started");

async function VerifyDependencies()
{
	return new Promise((res, rej) => {
		console.log("Checking Package Dependencies");

		for(const dependency of dependencies)
		{
			try
			{
				import(dependency)
			}
			catch(err)
			{
				rej(
					`Lipe requires a dependency of ${dependency} when building from git. Please make sure its installed first`
				);
			}
		}
		res();
	})
}

// Runs initial Build script if the lib folder doesn't exist (in case it was included as a git repository)
if (!existsSync(dir) && (env.lipe_postinstall != false)) {
	console.log(
		"Library directory is missing. Must be installing from Git. Building project from source"
	);

	await VerifyDependencies().catch((error) => {
		throw error;
	});

	const Success = Compile();

	if (!Success) console.error("Failed to Build Source");
	else console.log("Built Logger from Source");
}

console.log("Postinstall Script finished");
