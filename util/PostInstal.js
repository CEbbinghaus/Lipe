// Runs initial Build script if the lib folder doesn't exist (in case it was included as a git repository)


import { exec } from "child_process";
import { existsSync} from "fs";
import * as path from "path";
import { cwd } from "process";
import { Compile } from "./CompileProject.js"

const shell = process.argv.shift();
const script = process.argv.shift();

const args = process.argv;
const dir = path.join(cwd(), args[0] || "lib")

console.log("Postinstall Script Started");

if(!existsSync(dir)){
	const Success = Compile();

	if(!Success)
		console.error("Failed to Build Source");
	else
		console.log("Built Logger from Source");
}else
	console.log("Skipping Build. Lib already exists")

console.log("Postinstall Script finished");
