---
title: Lipe
layout: ../layouts/MainLayout.astro
---
Lipe (a contraction of Logging and Pipe) is a Lightweight yet powerful Logging library for any use case. It allows the developer to specify exactly where the data should end up and in which form.
It supplies a lot of built in functions for handling 

## Motivation
Logger was created to be a Flexible and Extendable way of creating Logs and routing them to where they are needed. Much like winston, bunyan and pino its flexible and allows for a great deal of customization.

## Usage
Basic usage is quite easy. If all that is needed is to replace the default JS console:

```javascript
const {default: Logger} = require("lipe");

let logger = new Logger();

logger.pipe.Pipe(console.log);

logger.Log("Hello World!");
```
see [Quick Start](./quickstart) for more information on how to get going


## Documentation

Its recommended to start with the [Quick Start](./quickstart) guide to get the most simple version up and running. 