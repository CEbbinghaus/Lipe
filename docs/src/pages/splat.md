---
title: "Splat"
layout: ../layouts/MainLayout.astro
---

Is a method of [String Formatting](https://en.wikipedia.org/wiki/String_interpolation) Implemented in Lipe that uses property names for Keys. The formatter uses the keys out of the string to evaluate the values to be substituted. 

The Basic Syntax goes as follows: 

```javascript
logger.Log("Hello {greet}!",  {greet: "World!"}); // returns "Hello World!"
```

the `{greet}` then gets replaced with the corresponding object found in the argument object.

This also works for nested objects e.g `obj.value`
```javascript
logger.Log("Nested Value: {obj.value}", {obj: {value: 42}}); // returns "Nested Value: 42"
```
