## Array Utils Split

#### how to use
```
    // or import
    const splitArray = require('array-utils-split');

    const ids = [1,2,3,...,100];
    const group = splitArray(ids, 20);
    console.log(group);
    // [[1,2,...,20],[21,...,40], ...]
```