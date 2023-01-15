---
title: "Quick Start"
layout: ../layouts/MainLayout.astro
---
This page will get you started with Lipe in no time.

## Installation

* Requires Node >=14.x
* Requires npm or similar package manager (yarn, pnpm)

In your local npm project run:

```bash
npm i lipe
```

this will install lipe and all of its dependencies (which are currently none 😉)

## Usage

Lipe has both support for CommonJS (node) `require` as well as ESM `import` syntax

*esm*
```javascript
import Logger, { LoggerPipe } from "lipe";
```
*commonjs*
```javascript
const {default: Logger, LoggerPipe} = require("lipe");
```

All of the documents will be referencing the ESM syntax but both are valid.

Now all that is left is to construct a new logger, Pipe its output somewhere meaningful and to Log a message.

```javascript
import Logger from "lipe";

let logger = new Logger();

logger.pipe.Pipe(console.log);

logger.Log("Hello World!");
```

have a read through the [Introduction](./introduction) for more in depth explanations.
