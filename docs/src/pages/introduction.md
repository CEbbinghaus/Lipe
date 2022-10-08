---
title: Introduction
layout: ../layouts/MainLayout.astro
---

## Core

The Lipe framework is based around [Pipes](./pipes) and [Transforms](./transforming). These two concepts make up the core of the library allowing for near infinite customization and expandibility.

## Usage

```javascript
const {default: Logger} = require("lipe");

let logger = new Logger();

logger.pipe.Pipe(console.log);

logger.Log("Hello World!");
```

This however results in some pretty ugly output

`Hello World! { args: {}, logLevel: 4, meta: {} }`

This is because every step in the pipe recieves two arguments, The first is the log message passed into the function and the second is a object containing any and all information about that log.

Lets clean up the output then by eliminating the Excess data. All we have to do is edit what we pass into the pipe like such:

```javascript
logger.pipe.Pipe((msg) => console.log(msg))
```
Will ignore the second argument and print a simple nice 
`Hello World!`.

with this we have successfully implemented the most basic of the Logging. So lets delve into the next step. Using Defaults.

this time we are adding an additional object to our require line to get the Console function
```javascript
const{default:Logger, Defaults:{Console}}=require("lipe");
```
we also have to update our piping to use this new method:
```javascript
logger.pipe.Pipe(Console);
``` 
And now its using the built in module to log to the console. This means that Critical and Error logs will now be sent to stderr instead of stdout.