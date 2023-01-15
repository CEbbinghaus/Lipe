---
title: Introduction
layout: ../layouts/MainLayout.astro
---

## Core

The Lipe framework is based around [Pipes](./pipes) and [Transforms](./transforming). These two concepts make up the core of the library allowing for near infinite customization and expandability. 

## Usage

following on from the [QuickStart](./quickstart) example we are left with the following code.

```javascript
import Logger from "lipe";

let logger = new Logger();

logger.pipe.Pipe(console.log);

logger.Log("Hello World!");
```

This however results in some pretty ugly output

`Hello World! { args: {}, logLevel: 4, meta: {} }`

That's because every step in the pipe receives two arguments, The first is a string containing the message at its current state while the second is a object with any context.

One way to clean up the logging output is to create a function with only one argument that calls console log separately,

```javascript
logger.pipe.Pipe((msg) => console.log(msg))
```
But the recommended approach is to use the [Console](./console) default that comes packaged with lipe. 
```javascript
import { Console } from "lipe/default";
// ...
logger.pipe.Pipe(Console());
// ...
``` 

This should now only be printing `Hello World!` to the console output. Another benefit of using the **Console** output is that any `Error` or `Critical` messages are now sent to `stderr` instead.

## Log Levels

Lipe has 6 built in log levels + one to represent no log level at all. They are as follows:	

```typescript
export enum LogLevel {
	None = 0,  // Used to represent a lack of a log Level
	Debug = 1, // for Debug messages only needed for troubleshooting
	Info = 2, // for informational messages that provide additional context
	Log = 4, // Regular log level. This is for anything of importance
	Warn = 8, // For warning of something gone wrong but recoverable
	Error = 16, // Error for Errors that occur both Recoverable & Unrecoverable
	Critical = 32, // For Critical exceptions warranting the halting of the application
}
```

Each message passed through the pipe will have its respective log level attached to the Context object under the `logLevel` Property.

```javascript
logger.pipe.Pipe((msg, ctx) => console.log(ctx.logLevel));
``` 
Which will print the respective logLevel of any given message. Of course this can be used for filtering based on the logLevel as such:
```javascript
import { LogLevel } from "lipe"

logger.pipe.Pipe((msg, ctx) => ctx.logLevel >= LogLevel.Warn);
```
This is covered in more depth at [LogLevels](./loglevels)
