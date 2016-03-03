
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
        value: [ 'B' ]
    },
    {
        path: ['a:xTo'],
        value: [ '{"b":"B","c":"C"}' ]
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
        value: [ 'H0' ]
    },

    // Array.index typeof object
    {
        path: [
            'g.0:',
            'g.0:toString',
            'g.0.:.',
            ' g 0 : '
        ],
        value: [ '[object Object]' ]
    },

    // Array.index object
    {
        path: [
            'g.0',
            ' g 0 '
        ],
        value: [ { h: 'H0', i: 'I0' } ]
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
        value: [ 'B', 'C' ]
    },

    // Object.xEach reverse
    {
        path: [
            'a.^*:',
            'a.^*:toString',
            'a.^*.:.',
            'a^*:',
            ' a ^* : '
        ],
        value: [ 'C', 'B' ]
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
        value: [ 'H0', 'H1', 'H2', 'H3', 'H4', 'H5' ]
    },

    // Array.xEach reverse
    {
        path: [
            'g.^*.h:',
            'g.^*.h:toString',
            'g.^*.h.:.',
            'g^*h:',
            ' g ^* h : ',
        ],
        value: [ 'H5', 'H4', 'H3', 'H2', 'H1', 'H0' ]
    },

    // Array.xEach filter
    {
        path: [
            'g.*.(i>"I3").h:',

            // specific filter
            'g.+(i>"I3").*.h:',
            '+(i>"I3").g.*.h:'
        ],
        value: [ 'H4', 'H5' ]
    },
    {
        path: [
            'g.*.( i>"I2" & i<"I5" ).h:',
            'g.*.( i=="I3" | i=="I4" ).h:'
        ],
        value: [ 'H3', 'H4' ]
    },

    // ## limit
    // Object.xEach( start, limit ) start
    {
        path: [
            'a.0~1:',
            'a.0~1.:.',
            ' a 0~1 : '
        ],
        value: [ 'B' ]
    },

    // Object.xEach( start, limit ) start 1
    {
        path: [
            'a.1~1:',
            'a.1~1.:.',
            ' a 1~1 : '
        ],
        value: [ 'C' ]
    },

    // Object.xEach( start, limit ) start reverse
    {
        path: [
            'a.^0~1:',
            'a.^0~1.:.',
            ' a ^0~1 : '
        ],
        value: [ 'C' ]
    },

    // Object.xEach( start, limit ) start 1 reverse
    {
        path: [
            'a.^1~1:',
            'a.^1~1.:.',
            ' a ^1~1 : '
        ],
        value: [ 'B' ]
    },

    // Object.xEach( start, limit ) end
    {
        path: [
            'a.-1:',
            'a.-1.:.',
            ' a -1 : ',

            'a.-1~:',
            'a.-1~.:.',
            ' a -1~ : ',

            'a.-1~1:',
            'a.-1~1.:.',
            ' a -1~1 : ',
        ],
        value: [ 'C' ]
    },

    // Object.xEach( start, limit ) end reverse
    {
        path: [
            'a.^-1:',
            'a.^-1.:.',
            ' a ^-1 : ',

            'a.^-1~:',
            'a.^-1~.:.',
            ' a ^-1~ : ',

            'a.^-1~1:',
            'a.^-1~1.:.',
            ' a ^-1~1 : ',
        ],
        value: [ 'B' ]
    },

    // Object.xEach( start, limit ) limit on Object.length
    {
        path: [
            'a.0~10:',
            'a.0~10.:.',
            ' a 0~10 : ',

            'a.-10~10:',
            'a.-10~10.:.',
            ' a -10~10 : ',

            'a.~:',
            'a.~.:.',
            ' a ~ : '
        ],
        value: [ 'B', 'C' ]
    },

    // Object.xEach( start, limit ) out of range
    {
        path: [
            'a.10~10:',
            'a.10~10.:.',
            ' a 10~10 : ',

            'a.10~:',
            'a.10~.:.',
            ' a 10~ : '
        ],
        value: []
    },

    // Array.xEach( start, limit ) start
    {
        path: [
            'g.0~1.h:',
            'g.0~1.h.:.',
            ' g 0~1 h : ',

            'g.~1.h:',
            'g.~1.h.:.',
            ' g ~1 h : '
        ],
        value: [ 'H0' ]
    },

    // Array.xEach( start, limit ) end
    {
        path: [
            'g.-1~1.h:',
            'g.-1~1.h.:.',
            ' g -1~1 h : ',

            'g.-1.h:',
            'g.-1.h.:.',
            ' g -1 h : ',

            'g.5~1.h:',
            'g.5~1.h.:.',
            ' g 5~1 h : ',

            'g.5~.h:',
            'g.5~.h.:.',
            ' g 5~ h : ',
        ],
        value: [ 'H5' ]
    },

    // Array.xEach( start, limit ) limit on Array.length
    {
        path: [
            'g.0~10.h:',
            'g.0~10.h.:.',
            ' g 0~10 h : ',

            'g.-10~10.h:',
            'g.-10~10.h.:.',
            ' g -10~10 h : ',

            'g.~.h:',
            'g.~.h.:.',
            ' g ~ h : '
        ],
        value: [ 'H0', 'H1', 'H2', 'H3', 'H4', 'H5' ]
    },

    {
        path: [
            'g.10~10.h:',
            'g.10~10.h.:.',
            ' g 10~10 h : '
        ],
        value: []
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

    // find all
    {
        path: [
            '#:xTo',
            '#.:xTo.',
            ' # : xTo '
        ],
        value: [
            '{"a":{"b":"B","c":"C"},"g":[{"h":"H0","i":"I0"},{"h":"H1","i":"I1"},{"h":"H2","i":"I2"},{"h":"H3","i":"I3"},{"h":"H4","i":"I4"},{"h":"H5","i":"I5"}]}',
            '{"b":"B","c":"C"}',
            '"B"',
            '"C"',
            '[{"h":"H0","i":"I0"},{"h":"H1","i":"I1"},{"h":"H2","i":"I2"},{"h":"H3","i":"I3"},{"h":"H4","i":"I4"},{"h":"H5","i":"I5"}]',
            '{"h":"H0","i":"I0"}',
            '"H0"',
            '"I0"',
            '{"h":"H1","i":"I1"}',
            '"H1"',
            '"I1"',
            '{"h":"H2","i":"I2"}',
            '"H2"',
            '"I2"',
            '{"h":"H3","i":"I3"}',
            '"H3"',
            '"I3"',
            '{"h":"H4","i":"I4"}',
            '"H4"',
            '"I4"',
            '{"h":"H5","i":"I5"}',
            '"H5"',
            '"I5"'
        ]
    },

    // find all with filter
    {
        path: [
            '#(h=="H2").i:',
            '#(h=="H2")i:',
            '#.(h.=="H2").i.:.',
            ' # ( h == "H2" ) i : ',
        ],
        value: [ 'I2' ]
    },

    {
        path: [
            '#(h>"H3").i:',
            '#(h>"H3")i:',
            '#.(h.>"H3").i.:.',
            ' # ( h > "H3" ) i : ',
        ],
        value: [ 'I4', 'I5' ]
    },

    {
        path: [
            '^#(h<"H2").i:',
            '^#(h<"H2")i:',
            '^#.(h.<"H2").i.:.',
            ' ^# ( h < "H2" ) i : ',
        ],
        value: [ 'I1', 'I0' ]
    },

    {
        path: [
            'a.#(b=="B").c:',
            'a#(b=="B")c:',
            'a.#.(b.=="B").c.:.',
            ' a # ( b == "B" ) c : ',
        ],
        value: [ 'C' ]
    },
    {
        path: [
            'a.#(b=="X").c:',
            'a#(b=="X")c:',
            'a.#.(b.=="X").c.:.',
            ' a # ( b == "X" ) c : ',
        ],
        value: []
    },

    // find all with specific filter
    {
        path: [
            '+(!:xType("Array")).#:xTo',
            '+(!:xType("Array"))#:xTo',
            '+.(!:xType("Array")).#.:xTo.',
            ' + ( !:xType("Array") ) # : xTo ',
        ],
        value: [
            '{"a":{"b":"B","c":"C"},"g":[{"h":"H0","i":"I0"},{"h":"H1","i":"I1"},{"h":"H2","i":"I2"},{"h":"H3","i":"I3"},{"h":"H4","i":"I4"},{"h":"H5","i":"I5"}]}',
            '{"b":"B","c":"C"}',
            '"B"',
            '"C"'
        ]
    },

    // find all with specific filter and second filter
    {
        path: [
            '+(!:xType("Array")).#(:xType("field")):',
            '+(!:xType("Array"))#(:xType("field")):',
            '+.(!:xType("Array")).#.(:xType("field").).:.',
            ' + ( !:xType("Array") ) # ( :xType("field") ) : ',
        ],
        value: [
            'B',
            'C'
        ]
    },

    // Number value
    {
        path: [
            '20',
            ' 20 '
        ],
        value: [
            20
        ]
    },
    {
        path: [
            '-1',
            ' -1 '
        ],
        value: [
            -1
        ]
    },
    {
        path: [
            '1.01',
            ' 1.01 '
        ],
        value: [
            1.01
        ]
    },

    // String value
    {
        path: [
            '"abc"',
            ' "abc" ',
            "'abc'",
            " 'abc' "
        ],
        value: [
            'abc'
        ]
    }
];

// testCase = [
//     {
//         path: [
//             'g.^*.h:',
//             'g.^*.h:toString',
//             'g.^*.h.:.',
//             'g^*h:',
//             ' g ^* h : ',
//         ],
//         value: [ 'H5', 'H4', 'H3', 'H2', 'H1', 'H0' ]
//     }
// ];

// testCase = [
//     {
//         path: [
//             '+( :xType("Array").. == "false" ).#:xTo',
//             // '+(!:xType("Array"))#:xTo',
//             // '+.(!:xType("Array")).#.:xTo.',
//             // ' + ( !:xType("Array") ) # : xTo ',
//         ],
//         value: [
//             { data: '{"a":{"b":"B","c":"C"},"g":[{"h":"H0","i":"I0"},{"h":"H1","i":"I1"},{"h":"H2","i":"I2"},{"h":"H3","i":"I3"},{"h":"H4","i":"I4"},{"h":"H5","i":"I5"}]}' },
//             { data: '{"b":"B","c":"C"}' },
//             { data: '"B"' },
//             { data: '"C"' }
//         ]
//     }
// ];

// testCase = [
//     {
//         path: [
//             'g.0~1.h:'
//         ],
//         value: [ 'H0' ]
//     }
// ];


// var testExit = 0;

[
    // create object functions with CreateJS and namespace of PathJS
    Crisp.utilCreate({ ns: 'util.path' }).objData( testObject ),

    // define PathJS function on given object
    // (function() {
    //     Crisp.definePath( testObject );
    //     return testObject;
    // })()

].forEach(function( use, index ) {
    var useTitle = index ? 'definePath' : 'namespace';

    testCase.forEach(function( test ) {
        test.path.forEach(function( path ) {
            exports[ useTitle + ': pathFind ' + path ] = function(assert) {
                var done = assert.done || assert.async();

                var testLength = test.value.length + 2;
                var testCount = 0;
                var testList = [];

                // if ( testLength > 1 ) {
                //     testLength += 1;
                // }

                assert.expect( testLength );
                
                use.pathFind(
                    {
                        path: path
                    },
                    function( item ) {
                        // if ( testExit++ > 50 ) {
                        //     throw new Error();
                        // }

                        // console.log('success', item );
                        assert.deepEqual( test.value[ testCount++ ], item );
                        testList.push( item );
                    },
                    function() {
                        // console.log('complete', e );
                        assert.deepEqual( test.value, testList );
                    }
                );

                assert.equal( test.value.length, testCount );

                done();
            };
        });
    });


    testCase.forEach(function( test ) {
        test.path.forEach(function( path ) {
            exports[ useTitle + ': pathFind async ' + path ] = function(assert) {
                var done = assert.done || assert.async();

                var testLength = test.value.length + 2;
                var testCount = 0;
                var testList = [];

                // if ( testLength > 1 ) {
                //     testLength += 1;
                // }

                assert.expect( testLength );
                
                // console.log('start');
                
                use.pathFind({
                    path: path,
                    async: true,
                    success: function( item ) {
                        // console.log('success');
                        assert.deepEqual( test.value[ testCount++ ], item );
                        testList.push( item );
                    },
                    complete: function() {
                        // console.log('complete');
                        assert.deepEqual( test.value, testList );
                        done();
                    }
                });

                assert.equal( 0, testCount );
            };
        });
    });
















// =====================================================
//                      deprecated
// =====================================================

    // testCase.forEach(function( test ) {
    //     test.path.forEach(function( path ) {
    //         exports[ useTitle + ': pathNode ' + path ] = function(assert) {
    //             var done = assert.done || assert.async();
    //             assert.expect( 2 );
                
    //             var data = use.pathNode({
    //                 path: path,
    //                 complete: function( e ) {
    //                     // console.log( e );
    //                     if ( test.value.length > 0 ) {
    //                         assert.deepEqual( [ test.value[0] ], e.List() );
    //                     }
    //                     else {
    //                         assert.deepEqual( [], e.List() );
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
    //         exports[ useTitle + ': pathNode string ' + path ] = function(assert) {
    //             var done = assert.done || assert.async();
    //             assert.expect( 1 );
                
    //             var data = use.pathNode( path );

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

});


