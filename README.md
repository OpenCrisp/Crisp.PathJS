# Crisp.PathJS
is a DSL Language to finde nodes in JavaScript Objects with focus of FRD (find, rule and deliver) 

[![Build Status](https://travis-ci.org/OpenCrisp/Crisp.PathJS.svg)](https://travis-ci.org/OpenCrisp/Crisp.PathJS)
[![NPM Downloads](https://img.shields.io/npm/dm/crisp-path.svg)](https://www.npmjs.com/package/crisp-path)
[![NPM Version](https://img.shields.io/npm/v/crisp-path.svg)](https://www.npmjs.com/package/crisp-path)

```javascript
var myObject = Crisp.utilCreate({
    ns: 'util.path'
}).objIni().objData({
    a: {
        b: 'B',
        c: 'C'
    }
});

// find first node of path
myObject.pathNode('a.*:');  // 'B'

// find all nodes of path optional asynchronous
myObject.pathFind({
    path: 'a.*:',
    success: function( e ) {
        console.log('success:', e );
    },
    complete: function( e ) {
        console.log('complete:', e );
    }
});
// logs:
// success: B
// success: C
// complete: [ { data: 'B' }, { data: 'C' } ]

// check of path exists in object
myObject.pathExists('a.*:');  // true
```

## Index Table
  * [Getting Started](#getting-started)
    * [Server-Nodes](#server-nodes)
    * [Web-Clients](#web-clients)
    * [Development](#development)
  * [Usage](#usage)
    * [Crisp.definePath()](#crispdefinepath)
    * [Crisp.uitlCreate()](#crispuitlcreate)
  * [PathJS function](#pathjs-function)
    * [.pathNode()](#pathnode)
    * [.pathFind()](#pathfind)
    * [.pathExists()](#pathexists)
  * [Path string examples](#path-string-examples)
  * [Links](#links)

## Getting Started

### Server-Nodes
Use [Node Package Manager (npm)](https://www.npmjs.org) to install `crisp-path` for [Node.js](https://nodejs.org/) and [io.js](https://iojs.org/)

    $ npm install crisp-path

```javascript
// use package
require("crisp-path");
```

or use the [OpenCrisp UtilJS](https://github.com/OpenCrisp/Crisp.UtilJS) wraper

    $ npm install crisp-util

```javascript
// use package
require("crisp-util");
```

### Web-Clients
Use [Bower](http://bower.io/) to install `crisp-path` for Browsers APP's and other front-end workflows.

    $ bower install crisp-path

```html
<!-- use package -->
<script type="text/javascript" src="dist/crisp-path.min.js"></script>
```

or use the [OpenCrisp UtilJS](https://github.com/OpenCrisp/Crisp.UtilJS) wraper

    $ bower install crisp-util

```html
<!-- use package -->
<script type="text/javascript" src="dist/crisp-util.min.js"></script>
```

## Development
Use [Git](https://git-scm.com/) to clone [Crisp.PathJS from GitHub](https://github.com/OpenCrisp/Crisp.PathJS) to develop the repository with [Grunt](http://gruntjs.com/)

    # Clone:
    $ git clone https://github.com/OpenCrisp/Crisp.PathJS.git
    
    # Build: test, concat, test, minify, test
    $ grunt
    
    # Test: original sourcecode for developer (included in build)
    $ grunt t
    
    # Run all test-scripts on Unix
    $ sh grunt-tests.sh

## Usage
How to use `Crisp.PathJS` with JavaScript.

### Crisp.definePath()
How to use `Crisp.definePath( object )` module.

```javascript
var myObject = { a: 'A', b: 'B' };

// initialice path property functions on myObject
Crisp.definePath( myObject );

// find first node of path string
myObject.pathNode('a:');  // 'A'
myObject.pathNode('b:');  // 'B'
myObject.pathNode('*:');  // 'A'
```

### Crisp.utilCreate()
How to use `Crisp.utilCreate( option )` with `util.path` namespace.

```javascript
// create object with `util.path` namespace
var myObject = Crisp.utilCreate({
    ns: 'util.path'
}).objIni().objData({ a: 'A', b: 'B' });

// find first node of path string
myObject.pathNode('a:');  // 'A'
myObject.pathNode('b:');  // 'B'
myObject.pathNode('*:');  // 'A'
```

## PathJS function

### .pathNode()
Hot to use `.pathNode( path OR option )` on `myObject`.

```javascript
// find first node of path string
myObject.pathNode('b:');  // 'B'

// or with option.path string
myObject.pathNode({ path: 'b:' });  // 'B'
```

 * [**path** - find first node with path-string](#path-pathnode) 
 * **option**
   * [**path** - find first node with path-string](#optionpath-pathnode) 
   * [**_preset_** - alternate value if path not found](#optionpreset-pathnode)

> #### path (pathNode)
> create `myObject` with [`Crisp.utilCreate()`](#crisputilcreate) or initalice with [`Crisp.definePath()`](#crispdefinepath).

```javascript
// find first node of path string
myObject.pathNode('a:');  // 'A'
myObject.pathNode('b:');  // 'B'
myObject.pathNode('*:');  // 'A'
```

> #### option.path (pathNode)
> create `myObject` with [`Crisp.utilCreate()`](#crisputilcreate) or initalice with [`Crisp.definePath()`](#crispdefinepath).

```javascript
// find first node of option.path string
myObject.pathNode({ path: 'a:' });  // 'A'
myObject.pathNode({ path: 'b:' });  // 'B'
myObject.pathNode({ path: '*:' });  // 'A'
```

> #### option.preset (pathNode)
> create `myObject` with [`Crisp.utilCreate()`](#crisputilcreate) or initalice with [`Crisp.definePath()`](#crispdefinepath).

```javascript
// find first node of path string
myObject.pathNode({
  path: 'x:', 
  preset: 'X'
});
// 'X'

myObject.pathNode({
  path: 'x:',
  preset: function() { return 'X'; }
});
// 'X'

myObject.pathNode({
  path: 'x:'
});
// undefined
```



### .pathFind()
Hot to use `.pathFind( option )` on `myObject`.

```javascript
var myObject = Crisp.utilCreate({
    ns: 'util.path'
}).objIni().objData({ a: 'A', b: 'B' });

myObject.pathFind({
    path: 'a',
    success: function( item ) {
        console.log('Success:', item );
    },
    complete: function( e ) {
        console.log('Complete:', e.List().xTo() );
    }
});
console.log('End');

// logs:
// Success: A
// Complete: [{"data":"A"}]
// End
```

 * **option**
   * [**path** - find nodes with path-string filter](#optionpath-pathfind)
   * [**_async_** - enable asynchronous callback](#optionasync-pathfind)
   * [**_success_** - callback per find node](#optionsuccess-pathfind)
   * [**_complete_** - callback on search end](#optioncomplete-pathfind)
   * [**_limit_** - limit to find nodes](#optionlimit-pathfind)
   * [**_start_** - start of find nodes](#optionstart-pathfind)

> #### option.path (pathNode)
> create `myObject` with [`Crisp.utilCreate()`](#crisputilcreate) or initalice with [`Crisp.definePath()`](#crispdefinepath).

```javascript
myObject.pathFind({
    path: '*',
    complete: function( e ) {
        console.log('Complete:', e.List().xTo() );
    }
});
console.log('End');

// logs:
// Complete: [{"data":"A"},{"data":"B"}]
// End
```

> #### option.async (pathNode)
> create `myObject` with [`Crisp.utilCreate()`](#crisputilcreate) or initalice with [`Crisp.definePath()`](#crispdefinepath).

```javascript
myObject.pathFind({
    path: '*',
    async: true,
    complete: function( e ) {
        console.log('Complete:', e.List().xTo() );
    }
});
console.log('End');

// logs:
// End
// Complete: [{"data":"A"},{"data":"B"}]
```

> #### option.success (pathNode)
> create `myObject` with [`Crisp.utilCreate()`](#crisputilcreate) or initalice with [`Crisp.definePath()`](#crispdefinepath).

```javascript
myObject.pathFind({
    path: '*',
    success: function( item ) {
        console.log('Success:', item );
    }
});
console.log('End');

// logs:
// Success: A
// Success: B
// End
```

> #### option.complete (pathNode)
> create `myObject` with [`Crisp.utilCreate()`](#crisputilcreate) or initalice with [`Crisp.definePath()`](#crispdefinepath).

```javascript
myObject.pathFind({
    path: '*',
    complete: function( e ) {
        console.log('Complete:', e.List().xTo() );
    }
});
console.log('End');

// logs:
// Complete: [{"data":"A"},{"data":"B"}]
// End
```

> #### option.limit (pathNode)
> create `myObject` with [`Crisp.utilCreate()`](#crisputilcreate) or initalice with [`Crisp.definePath()`](#crispdefinepath).

```javascript
myObject.pathFind({
    path: '*',
    limit: 1,
    complete: function( e ) {
        console.log('Complete:', e.List().xTo() );
    }
});
console.log('End');

// logs:
// Complete: [{"data":"A"}]
// End
```

> #### option.start (pathNode)
> create `myObject` with [`Crisp.utilCreate()`](#crisputilcreate) or initalice with [`Crisp.definePath()`](#crispdefinepath).

```javascript
myObject.pathFind({
    path: '*',
    start: 1,
    complete: function( e ) {
        console.log('Complete:', e.List().xTo() );
    }
});
console.log('End');

// logs:
// Complete: [{"data":"B"}]
// End
```

### .pathExists()
Hot to use `.pathExists( path )` on `myObject`.

```javascript
// check of path string exists in myObject
myObject.pathExists('b');  // true
myObject.pathExists('*');  // true
myObject.pathExists('x');  // false
```

## Path string examples
with callback of complete output

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
 * [Repository](https://github.com/OpenCrisp/Crisp.PathJS)
 * [More examples](https://github.com/OpenCrisp/Crisp.PathJS/tree/master/test)
 * [Module documentation](http://opencrisp.wca.at/docs/module-PathJS.html)
 * [Node package manager](https://www.npmjs.com/package/crisp-path)
 * [Version monitoring](https://www.versioneye.com/nodejs/crisp-path)
 * [Build history](https://travis-ci.org/OpenCrisp/Crisp.PathJS)
