// Runns initial Build script if the lib folder doesn't exist (in case it was included as a git repository)


const { exec } = require("child_process");
const { existsSync} = require("fs");
const path = require("path");
const { cwd } = require("process");

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