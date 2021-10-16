---
title: Pipes
layout: ../layouts/MainLayout.astro
---

Pipes are the path that logs travel down after they have been emitted by the code. They allow for infinite customizability and flexibility built on the same design pattern as Gulp and Streams.

## Basics
The class responsible for piping is the LoggerPipe accessible directly from inside the required object
```javascript
const {LoggerPipe} = require("Logger");
```
It has a optional argument letting you construct the pipe with steps already defined
```javascript
const pipe = new LoggerPipe([timestamped(), Console]);
```
The pipe itself is immutable which means that it doesn't change. Calling `.Pipe` on it won't change its behavior but instead return a completely different pipe. This means that the variable has to be reassigned whenever another segment gets added.
```javascript
// the variable gets set to the last returned value of .Pipe
const pipe = new LoggerPipe().Pipe(timestamped()).Pipe(Console);

const pipe = new LoggerPipe().Pipe(timestamped());
// This won't do anything since we aren't assigning it to anything.
pipe.Pipe(Console);
```
This is to protect the user from accidentally causing unintended side-effects and allows for easier extendability.

```javascript
const basePipe = new LoggerPipe([timestamped()]);

const filePipe = basePipe.Pipe(File("logs.log"));
const consolePipe = basePipe.Pipe(Console);
```

## Piping
Each step in the pipe can be a Transform, Output or another Pipe. The order in which the segments are called is the same as the order they are defined. 

