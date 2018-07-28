#!/bin/bash

npx babel roxp.js --out-file roxp-babelified.js
uglifyjs -c -m -o roxp.min.js -- roxp-babelified.js
rm roxp-babelified.js