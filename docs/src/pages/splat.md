---
title: "Splat"
layout: ../layouts/MainLayout.astro
---

Is a method of [String Formatting](https://en.wikipedia.org/wiki/String_interpolation) Implemented in Lipe that uses property names for Keys. The formatter uses the keys out of the string to evaluate the values to be substituted. 

**Note**
While currently only member names are supported There is planned functionality for Submember access: e.g `{Member.Submember}`

The Basic Syntax goes as follows: 

```javascript
logger.Log("Hello {greet}!",  {greet: "World!"});
```

the `{greet}` then gets replaced with the corresponding object found in the argument object.