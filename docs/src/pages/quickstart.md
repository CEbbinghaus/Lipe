---
title: "Quick Start"
layout: ../layouts/MainLayout.astro
---
This page will get you started with Lipe in no time.

## Install
* Requires Node >=14.x
* Requires npm or similar package manager (yarn, pnpm)

In your local npm project run:

`$ npm i lipe`

## Usage

Getting started is as easy as Requiring the Package, Constructing the Logger, Defining the output and Logging the message.

```javascript
const {default: Logger} = require("lipe");

let logger = new Logger();

logger.pipe.Pipe(console.log);

logger.Log("Hello World!");
```

have a read through the [Introduction](./introduction) to learn more