
// [doc of PathJS.pathFind](http://opencrisp.wca.at/docs/module-BaseJS.html#pathFind)

var testObject = {
    'a': {
        'b': 'B',
        'c': 'C'
    },
    'g': [
        { 'h': 'H0', 'i': 'I0' },
        { 'h': 'H1', 'i': 'I1' },
        { 'h': 'H2', 'i': 'I2' },
        { 'h': 'H3', 'i': 'I3' },
        { 'h': 'H4', 'i': 'I4' },
        { 'h': 'H5', 'i': 'I5' }
    ]
};

var testCase = [

    // ## path
    // Object.key
    {
        path: [
            'a.b:',
            'a.b:toString',
            'a.b.:.',
            ' a b : '
        ],
        value: [ { data: 'B' } ]
    },
    {
        path: ['a:xTo'],
        value: [ { data: '{"b":"B","c":"C"}' } ]
    },

    // Array.index
    {
        path: [
            'g.0.h:',
            'g.0.h:toString',
            'g.0.h.:.',
            ' g 0 h : '
        ],
        value: [ { data: 'H0' } ]
    },

    // ## xEach
    // Object.xEach
    {
        path: [
            'a.*:',
            'a.*:toString',
            'a.*.:.',
            'a*:',
            ' a * : '
        ],
        value: [ { data: 'B' }, { data: 'C' } ]
    },

    // Array.xEach
    {
        path: [
            'g.*.h:',
            'g.*.h:toString',
            'g.*.h.:.',
            'g*h:',
            ' g * h : ',
        ],
        value: [ { data: 'H0' }, { data: 'H1' }, { data: 'H2' }, { data: 'H3' }, { data: 'H4' }, { data: 'H5' } ]
    },

    // ## limit
    // Object.xEach( start, limit ) start
    {
        path: [
            'a.0~1:',
            'a.0~1.:.',
            ' a 0~1 : '
        ],
        value: [ { data: 'B' } ]
    },

    // Object.xEach( start, limit ) end
    {
        path: [
            'a.-1:',
            'a.-1.:.',
            ' a -1 : ',

            'a.-1~1:',
            'a.-1~1.:.',
            ' a -1~1 : ',
        ],
        value: [ { data: 'C' } ]
    },

    // Object.xEach( start, limit ) limit on Object.keys.length
    {
        path: [
            'a.0~10:',
            'a.0~10.:.',
            ' a 0~10 : ',

            'a.-10~10:',
            'a.-10~10.:.',
            ' a -10~10 : '
        ],
        value: [ { data: 'B' }, { data: 'C' } ]
    },

];

Crisp.definePath( testObject );

testCase.forEach(function( test ) {
    test.path.forEach(function( path ) {
        exports['pathFind ' + path ] = function(assert) {
            var done = assert.done || assert.async();

            var testLength = test.value.length + 1;
            var testCount = 0;

            if ( testLength > 1 ) {
                testLength += 1;
            }

            assert.expect( testLength );
            
            testObject.pathFind({
                path: path,
                success: function( item ) {
                    assert.deepEqual( test.value[ testCount++ ].data, item );
                },
                complete: function( e ) {
                    assert.deepEqual( test.value, e.note.List() );
                }
            });

            assert.equal( test.value.length, testCount );

            done();
        };
    });
});


testCase.forEach(function( test ) {
    test.path.forEach(function( path ) {
        exports['pathFind async ' + path ] = function(assert) {
            var done = assert.done || assert.async();

            var testLength = test.value.length + 1;
            var testCount = 0;

            if ( testLength > 1 ) {
                testLength += 1;
            }

            assert.expect( testLength );
            
            testObject.pathFind({
                path: path,
                async: true,
                success: function( item ) {
                    assert.deepEqual( test.value[ testCount++ ].data, item );
                },
                complete: function( e ) {
                    assert.deepEqual( test.value, e.note.List() );
                    done();
                }
            });

            assert.equal( 0, testCount );
        };
    });
});


testCase.forEach(function( test ) {
    test.path.forEach(function( path ) {
        exports['pathNode ' + path ] = function(assert) {
            var done = assert.done || assert.async();
            assert.expect( 2 );
            
            var data = testObject.pathNode({
                path: path,
                complete: function( e ) {
                    assert.deepEqual( [ test.value[0] ], e.note.List() );
                }
            });

            assert.deepEqual( data, test.value[0].data );

            done();
        };
    });
});


testCase.forEach(function( test ) {
    test.path.forEach(function( path ) {
        exports['pathNode string ' + path ] = function(assert) {
            var done = assert.done || assert.async();
            assert.expect( 1 );
            
            var data = testObject.pathNode( path );
            assert.deepEqual( data, test.value[0].data );

            done();
        };
    });
});


