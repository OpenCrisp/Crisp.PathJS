
// [doc of PathJS](http://opencrisp.wca.at/docs/module-PathJS.html)<br />
// [doc of definePath](http://opencrisp.wca.at/docs/module-BaseJS.html#.definePath)

// ## pathFind
// [doc of pathFind](http://opencrisp.wca.at/docs/module-PathJS.html#pathFind)




exports['pathFind'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(5);
        
    var myObject = { a: 'A', b: 'B' };

    Crisp.definePath( myObject );

    myObject.pathFind(
        {
            path: 'a'
        },
        function ( item ) {
            assert.strictEqual( myObject, this );
            assert.strictEqual( myObject.a, item );
        },
        function ( e ) {
            assert.strictEqual( myObject, this );
            assert.strictEqual( 'complete', e.action );
        }
    );

    assert.ok(1);
    done();
};

exports['pathFind _'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(5);
        
    var myObject = { _a: 'A', _b: 'B' };

    Crisp.definePath( myObject );

    myObject.pathFind(
        {
            path: '_a'
        },
        function ( item ) {
            assert.strictEqual( myObject, this );
            assert.strictEqual( myObject._a, item );
        },
        function ( e ) {
            assert.strictEqual( myObject, this );
            assert.strictEqual( 'complete', e.action );
        }
    );

    assert.ok(1);
    done();
};

exports['pathFind concat'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(1);
        
    var myObject = { a: 'A', b: 'B' };
    var text = '';

    Crisp.definePath( myObject );

    myObject.pathFind(
        {
            path: 'a:',
            values: undefined,
            preset: ''
        },
        function ( item ) {
            text = text.concat(item);
        },
        function () {
            text = text.concat(' end');
            assert.strictEqual( text, 'A end' );
        }
    );

    done();
};


exports['pathFind function'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(5);
        
    var myObject = { a: 'A', b: 'B' };

    Crisp.definePath( myObject );

    myObject.pathFind({
        path: 'a:toString',
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

exports['pathFind function of undefined'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(3);
        
    var myObject = { a: 'A', b: 'B' };

    Crisp.definePath( myObject );

    myObject.pathFind({
        path: 'a:xy',
        success: function() {
            throw new Error();
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

exports['pathFind option.self'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(5);
        
    var myObject = { a: 'A', b: 'B' };
    var mySelf = {};

    Crisp.definePath( myObject );

    myObject.pathFind({
        path: 'a',
        self: mySelf,
        success: function( item ) {
            assert.strictEqual( mySelf, this );
            assert.strictEqual( myObject.a, item );
        },
        complete: function( e ) {
            assert.strictEqual( mySelf, this );
            assert.strictEqual( 'complete', e.action );
        }
    });

    assert.ok(1);
    done();
};

exports['item.pathFind values.item value'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(5);
        
    var myObject = { a: 'A', b: 'B' };

    Crisp.definePath( myObject );

    myObject.pathFind({
        path: 'a:==$item',
        values: {
            item: 'A'
        },
        success: function( item ) {
            assert.strictEqual( myObject, this );
            assert.strictEqual( true, item );
        },
        complete: function( e ) {
            assert.strictEqual( myObject, this );
            assert.strictEqual( 'complete', e.action );
        }
    });

    assert.ok(1);
    done();
};

exports['item.pathFind values.item path'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(5);
        
    var myObject = { a: 'A', b: 'B' };

    Crisp.definePath( myObject );

    myObject.pathFind({
        path: '$item:',
        values: {
            item: 'a'
        },
        success: function( item ) {
            assert.strictEqual( myObject, this );
            assert.strictEqual( 'A', item );
        },
        complete: function( e ) {
            assert.strictEqual( myObject, this );
            assert.strictEqual( 'complete', e.action );
        }
    });

    assert.ok(1);
    done();
};

exports['item.pathFind values.item child.path'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(5);
        
    var myObject = { a: { b: 'B' } };

    Crisp.definePath( myObject );

    myObject.pathFind({
        path: 'a.$item:',
        values: {
            item: 'b'
        },
        success: function( item ) {
            assert.strictEqual( myObject, this );
            assert.strictEqual( 'B', item );
        },
        complete: function( e ) {
            assert.strictEqual( myObject, this );
            assert.strictEqual( 'complete', e.action );
        }
    });

    assert.ok(1);
    done();
};

exports['item.pathFind values $self'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(5);
        
    var myObject = { a: 'A', b: 'B' };
    var mySelf = {};

    Crisp.definePath( myObject );

    myObject.pathFind({
        path: '$self',
        self: mySelf,
        success: function( item ) {
            assert.strictEqual( mySelf, this );
            assert.strictEqual( myObject, item );
        },
        complete: function( e ) {
            assert.strictEqual( mySelf, this );
            assert.strictEqual( 'complete', e.action );
        }
    });

    assert.ok(1);
    done();
};

exports['item.pathFind values $self function'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(5);
        
    var myObject = { a: 'A', b: 'B' };

    Crisp.definePath( myObject );

    myObject.pathFind({
        path: '($self).a:toLowerCase',
        success: function( item ) {
            assert.strictEqual( myObject, this );
            assert.strictEqual( 'a', item );
        },
        complete: function( e ) {
            assert.strictEqual( myObject, this );
            assert.strictEqual( 'complete', e.action );
        }
    });

    assert.ok(1);
    done();
};

exports['item.pathFind values self find'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(5);
        
    var myObject = { 
        list: [
            // { a: 'AA', b: 'AB' },
            { a: 'BA', b: 'BB' },
            // { a: 'CA', b: 'CB' },
        ],
        is: 'BA'
    };

    Crisp.definePath( myObject );

    myObject.pathFind({
        path: 'list.*( a: == $self.is: ).b:',
        // path: 'lists:',
        // values: { x: 'X' },
        success: function( item ) {
            assert.strictEqual( myObject, this );
            assert.strictEqual( 'BB', item );
        },
        complete: function( e ) {
            assert.strictEqual( myObject, this );
            assert.strictEqual( 'complete', e.action );
        }
    });

    assert.ok(1);
    done();
};

exports['item.pathFind values deep'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(5);
        
    var myObject = {};

    Crisp.definePath( myObject );

    myObject.pathFind({
        path: '( $a & ( $a=="A" & $b ) )',
        values: { a: 'A', b: 'B' },
        success: function( item ) {
            assert.strictEqual( myObject, this );
            assert.strictEqual( 'B', item );
        },
        complete: function( e ) {
            assert.strictEqual( myObject, this );
            assert.strictEqual( 'complete', e.action );
        }
    });

    assert.ok(1);
    done();
};

exports['item.pathFind start/limit default'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(1);
        
    var myObject = { a: 'A', b: 'B', c: 'C' }; 
    var test = [];

    Crisp.definePath( myObject );

    myObject.pathFind({
        path: '1~1',
        success: function( item ) {
            test.push( item );
        },
        complete: function() {
            test = '[' + test.join(',') + ']';
        }
    });

    assert.strictEqual( test, '[B]' );
    done();
};

exports['abst.pathFind start/limit default'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(1);
        
    var myObject = [1,2];
    var test = [];

    Crisp.definePath( myObject );

    myObject.pathFind(
        {
            path: '~'
        },
        function ( item ) {
            test.push( item );
        },
        function () {
            test = '[' + test.join(',') + ']';
        }
    );

    assert.strictEqual( test, '[1,2]' );
    done();
};

exports['abst.pathFind 1~'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(1);
        
    var myObject = [1,2];
    var test = [];

    Crisp.definePath( myObject );

    myObject.pathFind({
        path: '1~',
        success: function( item ) {
            test.push( item );
        },
        complete: function() {
            test = '[' + test.join(',') + ']';
        }
    });

    assert.strictEqual( test, '[2]' );
    done();
};

exports['abst.pathFind 1~1'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(1);
        
    var myObject = [1,2];
    var test = [];

    Crisp.definePath( myObject );

    myObject.pathFind({
        path: '1~1',
        success: function( item ) {
            test.push( item );
        },
        complete: function() {
            test = '[' + test.join(',') + ']';
        }
    });

    assert.strictEqual( test, '[2]' );
    done();
};

exports['abst.pathFind limit'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(1);
        
    var myObject = [1,2];
    var test = [];

    Crisp.definePath( myObject );

    myObject.pathFind({
        path: '~1',
        success: function( item ) {
            test.push( item );
        },
        complete: function() {
            test = '[' + test.join(',') + ']';
        }
    });

    assert.strictEqual( test, '[1]' );
    done();
};

// exports['abst.pathFind limit reverse filter'] = function(assert) {
//     var done = assert.done || assert.async();
//     assert.expect(1);
        
//     var myObject = [1,2,3];
//     var test = [];

//     Crisp.definePath( myObject );

//     myObject.pathFind({
//         path: '+(:<"3").0~3.',
//         success: function( item ) {
//             test.push( item );
//         },
//         complete: function() {
//             test = '[' + test.join(',') + ']';
//         }
//     });

//     assert.strictEqual( test, '[2]' );
//     done();
// };

exports['abst.pathFind first of index'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(1);
        
    var myObject = [1,2];
    var test = [];

    Crisp.definePath( myObject );

    myObject.pathFind({
        path: ' 0. ',
        success: function( item ) {
            test.push( item );
        },
        complete: function() {
            test = '[' + test.join(',') + ']';
        }
    });

    assert.strictEqual( test, '[1]' );
    done();
};

exports['abst.pathFind undefined index'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(1);
        
    var myObject = [1,2];
    var test = [];

    Crisp.definePath( myObject );

    myObject.pathFind({
        path: '20.',
        success: function( item ) {
            test.push( item );
        },
        complete: function() {
            test = '[' + test.join(',') + ']';
        }
    });

    assert.strictEqual( test, '[]' );
    done();
};

exports['abst.pathFind inlay path value'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(1);
        
    var myObject = [1,2];
    var test = [];

    Crisp.definePath( myObject );

    myObject.pathFind({
        path: ' 20 ',
        success: function( item ) {
            test.push( item );
        },
        complete: function() {
            test = '[' + test.join(',') + ']';
        }
    });

    assert.strictEqual( test, '[20]' );
    done();
};

exports['abst.pathFind reverse'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(1);
        
    var myObject = [1,2];
    var test = [];

    Crisp.definePath( myObject );

    myObject.pathFind({
        path: '^*',
        success: function( item ) {
            test.push( item );
        },
        complete: function() {
            test = '[' + test.join(',') + ']';
        }
    });

    assert.strictEqual( test, '[2,1]' );
    done();
};

exports['abst.pathFind reverse limit'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(1);
        
    var myObject = [1,2];
    var test = [];

    Crisp.definePath( myObject );

    myObject.pathFind({
        path: '^~1',
        success: function( item ) {
            test.push( item );
        },
        complete: function() {
            test = '[' + test.join(',') + ']';
        }
    });

    assert.strictEqual( test, '[2]' );
    done();
};

exports['abst.pathFind filter interger'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(1);
        
    var myObject = [{ a: 1 },{ a: 2 }];
    var test = [];

    Crisp.definePath( myObject );

    myObject.pathFind({
        path: '*(a>1)',
        success: function( item ) {
            test.push( item.a );
        },
        complete: function() {
            test = '[' + test.join(',') + ']';
        }
    });

    assert.strictEqual( test, '[2]' );
    done();
};

exports['abst.pathFind filter &'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(1);
        
    var myObject = [{ a: 1 },{ a: 2 },{ a: 3 },{ a: 4 }];
    var test = [];

    Crisp.definePath( myObject );

    myObject.pathFind({
        path: '*.( a>1 & a<4 )',
        success: function( item ) {
            test.push( item.a );
        },
        complete: function() {
            // console.log( test );
            test = '[' + test.join(',') + ']';
        }
    });

    assert.strictEqual( test, '[2,3]' );
    done();
};

exports['abst.pathFind filter |'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(1);
        
    var myObject = [{ a: 1 },{ a: 2 },{ a: 3 },{ a: 4 }];
    var test = [];

    Crisp.definePath( myObject );

    myObject.pathFind({
        path: '*.( a<2 | a>3 )',
        success: function( item ) {
            test.push( item.a );
        },
        complete: function() {
            test = '[' + test.join(',') + ']';
        }
    });

    assert.strictEqual( test, '[1,4]' );
    done();
};

exports['abst.pathFind filter new Number()'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(1);
        
    var myObject = [{ a: Number(1) },{ a: Number(2) }];
    var test = [];

    Crisp.definePath( myObject );

    myObject.pathFind({
        path: '*(a>1)',
        success: function( item ) {
            test.push( item.a );
        },
        complete: function() {
            test = '[' + test.join(',') + ']';
        }
    });

    assert.strictEqual( test, '[2]' );
    done();
};

exports['abst.pathFind filter boolean'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(1);
        
    var myObject = [{ a: true },{ a: false }];
    var test = [];

    Crisp.definePath( myObject );

    myObject.pathFind({
        path: '*(!!a)',
        success: function( item ) {
            test.push( item.a );
        },
        complete: function() {
            test = '[' + test.join(',') + ']';
        }
    });

    assert.strictEqual( test, '[true]' );
    done();
};

exports['abst.pathFind filter new Boolean()'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(1);

    var Fn = Boolean;
        
    var myObject = [{ a: new Fn(1) },{ a: new Fn() }];
    var test = [];

    Crisp.definePath( myObject );

    myObject.pathFind({
        path: '*(!!a)',
        success: function( item ) {
            test.push( item.a );
        },
        complete: function() {
            test = '[' + test.join(',') + ']';
        }
    });

    assert.strictEqual( test, '[true]' );
    done();
};
