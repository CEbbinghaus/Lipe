---
title: Pipes
layout: ../layouts/MainLayout.astro
---

Pipes are the path that logs travel down after they have been emitted by the code. They allow for infinite customizability and flexibility built on the same design pattern as Gulp and Streams.

## Basics
The class responsible for piping is the LoggerPipe accessible directly from inside the required object
```javascript
import { LoggerPipe } from "lipe";
```
It has a optional argument letting you construct the pipe with steps already defined
```javascript
const pipe = new LoggerPipe([Timestamped(), Console()]);
```
The pipe itself is immutable which means that it cannot be modified. Calling `.Pipe` on it won't change its behavior but instead return a completely different pipe with both behaviors combined. This means that the variable has to be reassigned whenever another segment gets added.
```javascript
// the variable gets set to the last returned value of .Pipe
const pipe = new LoggerPipe().Pipe(Timestamped()).Pipe(Console());

const pipe = new LoggerPipe().Pipe(Timestamped());
// This won't do anything since we aren't assigning it to anything.
pipe.Pipe(Console());
```
This is to protect the user from accidentally causing unintended side-effects and allows for easier extendability.

```javascript
const basePipe = new LoggerPipe([Timestamped()]);

const filePipe = basePipe.Pipe(File("logs.log"));
const consolePipe = basePipe.Pipe(Console());
```

## Piping
Each step in the pipe can be a Transform, Output or another Pipe. The order in which the segments are called is the same as the order they are defined. 

to transform the message simply return a new string from the Pipe element:
```javascript
pipe.Pipe((message) => "Hello " + message).Pipe(Console());

logger.Log("World!"); // Will log "Hello World!"
```

If instead filtering is desired, Returning a boolean will indicate wether the execution should be halted or if the message can proceed.
```javascript
pipe.Pipe((message) => message.includes("foo")).Pipe(Console());

logger.Log("foo fighters") // Will log "foo fighters" since it includes the word "foo"
logger.Log("bar fighters") // Will not log anything since the message does not contain the word "foo" 
```
This allows for any arbitrary filtering on both the message contents (e.g hiding secrets) as well as determining if a message should be logged depending on its log level:
```javascript
const minimumLogLevel = LogLevel.Log;

// This will only log messages at a log level of 4 (Log) and above
pipe.Pipe((message, args) => args.logLevel >= minimumLogLevel);
```

we can even run other pipes conditionally by simply returning a `LoggerPipe` from the step:
```javascript

const pipeA = (new LoggerPipe()).Pipe(message => "foo " + message)
const pipeB = (new LoggerPipe()).Pipe(message => "bar " + message)

pipe.Pipe((message, args) => message.contains("fighters") ? pipeA : pipeB).Pipe(Console());

logger.Log("fighters"); // This will log "foo fighters" because pipeA appended foo to the beginning of the message
logger.Log("bashers"); // This will log "bar bashers" because pipeB appended bar to the beginning of the message
```

as such pipes can allow for almost limitless flexibility and extendibility allowing any number of functions to be executed throughout a logs lifetime.
