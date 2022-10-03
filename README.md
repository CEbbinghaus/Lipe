# Lipe

A simple logging library that lets you extend and customize it to your hearts content.

# Install

```
$ npm i lipe
```

# Basic Usage

```js
const {default: Logger} = require("lipe");
const {Console} = require("lipe/defaults");

// Create a new Logger instance
const logger = new Logger();

// Pipe everything to the console output
logger.pipe.Pipe(Console());

// Log Hello World
logger.Log("Hello World!");
```

More documentation is being worked on.

Copyright ©️ CEbbinghaus 2022
