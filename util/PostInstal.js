// Runs initial Build script if the lib folder doesn't exist (in case it was included as a git repository)


import { exec } from "child_process";
import { existsSync} from "fs";
import * as path from "path";
import { cwd } from "process";

const shell = process.argv.shift();
const script = process.argv.shift();

const args = process.argv;
const dir = path.join(cwd(), args[0] || "lib")

if(!existsSync(dir)){
	exec("npm run build", (error, stdout, stderr) => {
		if(error)
			console.error(stderr);
		else
			console.log("Built Timer from Source");
	})
}else
	console.log("Skipping Build. Lib already exists")
