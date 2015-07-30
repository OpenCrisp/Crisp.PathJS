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


## Links
 * [Online Crisp.PathJS module Documentation](http://opencrisp.wca.at/docs/module-PathJS.html)
 * [More Examples on GitHub.com](https://github.com/OpenCrisp/Crisp.PathJS/tree/master/test)
 * [Repository on GitHub.com](https://github.com/OpenCrisp/Crisp.PathJS)
 * [npm package on npm.com](https://www.npmjs.com/package/crisp-path)
 * [Build History on Travis-ci.org](https://travis-ci.org/OpenCrisp/Crisp.PathJS)
