# smith-waterman-score
A easy and clear javascript solution of the smith-waterman algorithm.

Install via npm:
```
npm install --save smith-waterman-score
``` 

Then just call it like this:

```
const smith_waterman = require('smith-waterman-score')
const result = smith_waterman("*uddudrud", "*uduudrur", {"match": 1, "mismatch": -1, "gap": -1})
```

It will return you an object with two relevant informations:

```
result.peak
// { 'cell': [8,8], 'value': 6 }
result.trace
//  [
//    {patChar: "u", patIndex: 8, seqChar: "u", seqIndex: 8}
//    .... ]
