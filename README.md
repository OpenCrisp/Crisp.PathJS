# Crisp.PathJS
is a DSL Language to finde nodes in JavaScript Objects with focus of FRD (find, rule and deliver) 

[![Build Status](https://travis-ci.org/OpenCrisp/Crisp.PathJS.svg)](https://travis-ci.org/OpenCrisp/Crisp.PathJS)
[![NPM Downloads](https://img.shields.io/npm/dm/crisp-path.svg)](https://www.npmjs.com/package/crisp-path)
[![NPM Version](https://img.shields.io/npm/v/crisp-path.svg)](https://www.npmjs.com/package/crisp-path)

What is CRISP? Configuration Result In Simplified Programming

  * sync / async
  * action filter
  * note picker

## Index Table

  * [Getting Started](#getting-started)
    * [NodeJS](#nodejs)
    * [Browsers](#browsers)
  * [Usage](#usage)
    * [Quick example](#quick-example)
  * [Links](#links)

## Getting Started

### NodeJS
Use the Node Package Manager (npm) for install crisp-path

    npm install crisp-path

or use all of OpenCrisp Utils

    npm install crisp-util

### Browsers
~~~~~~html
<script type="text/javascript" src="node_modules/crisp-base/dist/crisp-base.min.js"></script>
<script type="text/javascript" src="node_modules/crisp-event/dist/crisp-event.min.js"></script>
<script type="text/javascript" src="dist/crisp-path.min.js"></script>
~~~~~~

## Usage
```javascript
// init
Crisp.definePath( object );

// functions
object.pathNode( option );
object.pathFind( option );
object.pathExists( option );
```

### Quick example
```javascript
var myObject = { a: 'A' };

Crisp.definePath( myObject );
```

```javascript
myObject.pathNode('a'); // 'A'
```

```javascript
myObject.pathFind({
    path: 'a',
    success: function( item ) {
        console.log('success:', item );
    },
    complete: function( e ) {
        console.log('complete');
    }
});

// logs:
// success: A
// complete
```

Path string examples with complete output
```javascript
// ## path
// Object.key
'a.b:'                          // [ { data: 'B' } ]
'a.b:toString'                  // [ { data: 'B' } ]

'a:xTo'                         // [ { data: '{"b":"B","c":"C"}' } ]

'x:'                            // []
'a.x:'                          // []

// Array.index
'g.0.h:'                        // [ { data: 'H0' } ]

// ## xEach
// Object.xEach
'a.*:'                          // [ { data: 'B' }, { data: 'C' } ]

// Array.xEach
'g.*.h:'
// [ { data: 'H0' }, { data: 'H1' }, { data: 'H2' }, { data: 'H3' }, { data: 'H4' }, { data: 'H5' } ]

// ## limit
// Object.xEach( start, limit ) start
'a.0~1:'                        // [ { data: 'B' } ]

// Object.xEach( start, limit ) end
'a.-1:'                         // [ { data: 'C' } ]
'a.-1~1:'                       // [ { data: 'C' } ]

// Object.xEach( start, limit ) limit on Object.length
'a.0~10:'                       // [ { data: 'B' }, { data: 'C' } ]
'a.-10~10:'                     // [ { data: 'B' }, { data: 'C' } ]

// Object.xEach( start, limit ) out of range
'a.10~10:'                      // []

// Array.xEach( start, limit ) start
'g.0~1.h:'                      // [ { data: 'H0' } ]

// Array.xEach( start, limit ) end
'g.-1.h:'                       // [ { data: 'H5' } ]
'g.-1~1.h:'                     // [ { data: 'H5' } ]

// Array.xEach( start, limit ) limit on Array.length
'g.0~10.h:'
'g.-10~10.h:'
// [ { data: 'H0' }, { data: 'H1' }, { data: 'H2' }, { data: 'H3' }, { data: 'H4' }, { data: 'H5' } ]

// Array.xEach( start, limit ) out of range
'g.10~10.h:'                    // []

// find all with filter
'#(h=="H2").i:'                 // [ { data: 'I2' } ]

'a.#(b=="B").c:'                // [ { data: 'C' } ]

'a.#(b=="X").c:'                // []

// find all with specific filter
'+(!:xType("Array")).#:xTo',
// [
// { data: '{"a":{"b":"B","c":"C"},"g":[{"h":"H0","i":"I0"},{"h":"H1","i":"I1"},{"h":"H2","i":"I2"},{"h":"H3","i":"I3"},{"h":"H4","i":"I4"},{"h":"H5","i":"I5"}]}' },
// { data: '{"b":"B","c":"C"}' },
// { data: '"B"' },
// { data: '"C"' }
// ]

// find all with specific filter and second filter
'+(!:xType("Array")).#(:xType("field")):' // [ { data: 'B' }, { data: 'C' } ]

```


## Links
 * [Online Crisp.PathJS module Documentation](http://opencrisp.wca.at/docs/module-PathJS.html)
 * [More Examples on GitHub.com](https://github.com/OpenCrisp/Crisp.PathJS/tree/master/test)
 * [Repository on GitHub.com](https://github.com/OpenCrisp/Crisp.PathJS)
 * [npm package on npm.com](https://www.npmjs.com/package/crisp-path)
 * [Build History on Travis-ci.org](https://travis-ci.org/OpenCrisp/Crisp.PathJS)
