---
title: Transforming
layout: ../layouts/MainLayout.astro
---

The act of transforming is to take a value and change it or manipulate it in some way. In Lipe this is achieved by passing a function to the `Pipe` method on the LoggerPipe.

```javascript
const pipe = new LoggerPipe().Pipe((message) => "Hello " + message);
```

this will mean that if we now use that pipe and log "World"    

```javascript
const logger = new Logger();
logger.AddPipe(pipe.Pipe(Console));

logger.Log("World!");
```
we get back `Hello World!`.

This can be used in various ways, from changing the format to censoring certain strings such as API keys or potential passwords.

*an example of filtering the pipe for config values*
```javascript
const config = require("config.json")

const logger = new Logger();

logger.AddPipe(new LoggerPipe([
    (msg) => {
        Object.values(config).forEach(v => {
            msg = msg.replace(v, "[REDACTED]") 
        })
        return msg;
    },
    Console
]));

logger.Log("API key in config is: {key}", {key: config.apiKey});
// results in: "API key in config is: [REDACTED]"

```

Its not just limited to simple string manipulation. Each step can stop or change the execution of the entire pipe based on what it returns.

* `undefined` and  `true` are ignored and continue execution as normal
* `null` and `false` will halt execution of the whole pipe preventing any further function from being called
* `string` will overwrite the current message with whatever was returned
* `LoggerPipe` will execute the provided LoggerPipe with the current arguments and then resume execution

Any other value is treated as an error and will result in the halting of the execution.