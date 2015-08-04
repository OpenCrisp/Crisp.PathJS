
// [doc of PathJS](http://opencrisp.wca.at/docs/module-PathJS.html)<br />
// [doc of definePath](http://opencrisp.wca.at/docs/module-BaseJS.html#.definePath)

// ## pathFind
// [doc of pathFind](http://opencrisp.wca.at/docs/module-PathJS.html#pathFind)




exports['pathFind'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(5);
        
    var myObject = { a: 'A', b: 'B' };

    Crisp.definePath( myObject );

    myObject.pathFind({
        path: 'a',
        success: function( item ) {
            assert.strictEqual( myObject, this );
            assert.strictEqual( myObject.a, item );
        },
        complete: function( e ) {
            assert.strictEqual( myObject, this );
            assert.strictEqual( 'complete', e.action );
        }
    });

    assert.ok(1);
    done();
};


exports['pathFind a.b'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(4);
    
    function Ab() {}
    Ab.prototype = {
        toString: function() {
            return '> B <';
        }
    };

    var myObject = { a: { b: new Ab() } };

    Crisp.definePath( myObject );

    myObject.pathFind({
        path: 'a.b:',
        success: function( item ) {
            // console.log('---------------- success --------------');
            // console.log( this );
            // console.log( item );
            assert.strictEqual( myObject, this );
            assert.strictEqual( '> B <', item );
        },
        complete: function( e ) {
            // console.log('================ complete ==============');
            // console.log( this );
            assert.strictEqual( myObject, this );
            assert.strictEqual( 'complete', e.action );
            // assert.strictEqual( myObject, e.self );
        }
    });

    done();
};


exports['pathFind parent'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(4);
        
    var myObject = { x: { a: 'A', b: 'B' } };

    Object.defineProperty( myObject.x, '__parent__', {
        value: myObject
    });

    Crisp.definePath( myObject );

    myObject.pathFind({
        path: 'x..:xTo',
        success: function( item ) {
            assert.strictEqual( myObject, this );
            assert.strictEqual( '{"x":{"a":"A","b":"B"}}', item );
        },
        complete: function( e ) {
            assert.strictEqual( myObject, this );
            assert.strictEqual( 'complete', e.action );
        }
    });

    done();
};
