
Comparing two melodies via parsons code:
```
const smith_waterman = require('smith-waterman-score')
const result = smith_waterman("*uddudrud", "*uduudrur", {"match": 1, "mismatch": -1, "gap": -1})
// string1, string2, score
```

