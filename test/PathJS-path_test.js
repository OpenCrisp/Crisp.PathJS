
// [doc of PathJS.pathFind](http://opencrisp.wca.at/docs/module-BaseJS.html#pathFind)

var testObject = {
    'a': {
        'b': 'B',
        'c': 'C'
    },
    'g': [
        { 'h': String('H0'), 'i': 'I0' },
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
    {
        path: [
            'x:',
            'x:toString',
            'x.:.',
            ' x : ',

            'a.x:',
            'a.x:toString',
            'a.x.:.',
            ' a x : '
        ],
        value: []
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

    // Object.xEach( start, limit ) limit on Object.length
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

    // Object.xEach( start, limit ) out of range
    {
        path: [
            'a.10~10:',
            'a.10~10.:.',
            ' a 10~10 : '
        ],
        value: []
    },

    // Array.xEach( start, limit ) start
    {
        path: [
            'g.0~1.h:',
            'g.0~1.h.:.',
            ' g 0~1 h : '
        ],
        value: [ { data: 'H0' } ]
    },

    // Array.xEach( start, limit ) end
    {
        path: [
            'g.-1.h:',
            'g.-1.h.:.',
            ' g -1 h : ',

            'g.-1~1.h:',
            'g.-1~1.h.:.',
            ' g -1~1 h : ',
        ],
        value: [ { data: 'H5' } ]
    },

    // Array.xEach( start, limit ) limit on Array.length
    {
        path: [
            'g.0~10.h:',
            'g.0~10.h.:.',
            ' g 0~10 h : ',

            'g.-10~10.h:',
            'g.-10~10.h.:.',
            ' g -10~10 h : '
        ],
        value: [ { data: 'H0' }, { data: 'H1' }, { data: 'H2' }, { data: 'H3' }, { data: 'H4' }, { data: 'H5' } ]
    },

    // Array.xEach( start, limit ) out of range
    {
        path: [
            'g.10~10.h:',
            'g.10~10.h.:.',
            ' g 10~10 h : '
        ],
        value: []
    },

    {
        path: [
            '#:xTo'
        ],
        value: [
            { data: '{"a":{"b":"B","c":"C"},"g":[{"h":"H0","i":"I0"},{"h":"H1","i":"I1"},{"h":"H2","i":"I2"},{"h":"H3","i":"I3"},{"h":"H4","i":"I4"},{"h":"H5","i":"I5"}]}' },
            { data: '{"b":"B","c":"C"}' },
            { data: '"B"' },
            { data: '"C"' },
            { data: '[{"h":"H0","i":"I0"},{"h":"H1","i":"I1"},{"h":"H2","i":"I2"},{"h":"H3","i":"I3"},{"h":"H4","i":"I4"},{"h":"H5","i":"I5"}]' },
            { data: '{"h":"H0","i":"I0"}' },
            { data: '"H0"' },
            { data: '"I0"' },
            { data: '{"h":"H1","i":"I1"}' },
            { data: '"H1"' },
            { data: '"I1"' },
            { data: '{"h":"H2","i":"I2"}' },
            { data: '"H2"' },
            { data: '"I2"' },
            { data: '{"h":"H3","i":"I3"}' },
            { data: '"H3"' },
            { data: '"I3"' },
            { data: '{"h":"H4","i":"I4"}' },
            { data: '"H4"' },
            { data: '"I4"' },
            { data: '{"h":"H5","i":"I5"}' },
            { data: '"H5"' },
            { data: '"I5"' }
        ]
    },

    {
        path: [
            '#(h=="H2").i:'
        ],
        value: [ { data: 'I2' } ]
    }
];

testCase = [
    // {
    //     path: [
    //         'a.#.(b=="B").c:'
    //     ],
    //     value: [ { data: 'C' } ]
    // },
    {
        path: [
            'a.#.(b=="X").c:'
        ],
        value: [ { data: 'C' } ]
    }
];

Crisp.definePath( testObject );

var testExit = 0;

testCase.forEach(function( test ) {
    test.path.forEach(function( path ) {
        exports['pathFind ' + path ] = function(assert) {
            var done = assert.done || assert.async();

            var testLength = test.value.length + 2;
            var testCount = 0;

            // if ( testLength > 1 ) {
            //     testLength += 1;
            // }

            assert.expect( testLength );
            
            testObject.pathFind({
                path: path,
                success: function( item ) {
                    if ( testExit++ > 50 ) {
                        throw new Error();
                    }

                    // console.debug('success', item );
                    assert.deepEqual( test.value[ testCount++ ].data, item );
                },
                complete: function( e ) {
                    // console.log('complete', e );
                    assert.deepEqual( test.value, e.note.List() );
                }
            });

            assert.equal( test.value.length, testCount );

            done();
        };
    });
});


// testCase.forEach(function( test ) {
//     test.path.forEach(function( path ) {
//         exports['pathFind async ' + path ] = function(assert) {
//             var done = assert.done || assert.async();

//             var testLength = test.value.length + 2;
//             var testCount = 0;

//             // if ( testLength > 1 ) {
//             //     testLength += 1;
//             // }

//             assert.expect( testLength );
            
//             // console.log('start');
            
//             testObject.pathFind({
//                 path: path,
//                 async: true,
//                 success: function( item ) {
//                     // console.log('success');
//                     assert.deepEqual( test.value[ testCount++ ].data, item );
//                 },
//                 complete: function( e ) {
//                     // console.log('complete');
//                     assert.deepEqual( test.value, e.note.List() );
//                     done();
//                 }
//             });

//             assert.equal( 0, testCount );
//         };
//     });
// });


// testCase.forEach(function( test ) {
//     test.path.forEach(function( path ) {
//         exports['pathNode ' + path ] = function(assert) {
//             var done = assert.done || assert.async();
//             assert.expect( 2 );
            
//             var data = testObject.pathNode({
//                 path: path,
//                 complete: function( e ) {
//                     if ( test.value.length > 0 ) {
//                         assert.deepEqual( [ test.value[0] ], e.note.List() );
//                     }
//                     else {
//                         assert.deepEqual( [], e.note.List() );
//                     }
//                 }
//             });

//             if ( test.value.length > 0 ) {
//                 assert.deepEqual( data, test.value[0].data );
//             }
//             else {
//                 assert.strictEqual( data, undefined );
//             }

//             done();
//         };
//     });
// });


// testCase.forEach(function( test ) {
//     test.path.forEach(function( path ) {
//         exports['pathNode string ' + path ] = function(assert) {
//             var done = assert.done || assert.async();
//             assert.expect( 1 );
            
//             var data = testObject.pathNode( path );

//             if ( test.value.length > 0 ) {
//                 assert.deepEqual( data, test.value[0].data );
//             }
//             else {
//                 assert.strictEqual( data, undefined );
//             }

//             done();
//         };
//     });
// });


