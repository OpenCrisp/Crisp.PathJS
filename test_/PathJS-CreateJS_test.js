
// exports['pathNode'] = function(assert) {
//     var done = assert.done || assert.async();
//     assert.expect(3);

//     var myObject = Crisp.utilCreate({
//         ns: 'util.path'
//     }).objIni().objData({ a: 'A', b: 'B' });
    
//     assert.strictEqual( myObject.pathNode('a:'), 'A' );
//     assert.strictEqual( myObject.pathNode('b:'), 'B' );
//     assert.strictEqual( myObject.pathNode('*:'), 'A' );

//     done();
// };

// exports['pathNode option.path'] = function(assert) {
//     var done = assert.done || assert.async();
//     assert.expect(3);

//     var myObject = Crisp.utilCreate({
//         ns: 'util.path'
//     }).objIni().objData({ a: 'A', b: 'B' });
    
//     assert.strictEqual( myObject.pathNode({ path: 'a:' }), 'A' );
//     assert.strictEqual( myObject.pathNode({ path: 'b:' }), 'B' );
//     assert.strictEqual( myObject.pathNode({ path: '*:' }), 'A' );

//     done();
// };

// exports['pathNode option.preset'] = function(assert) {
//     var done = assert.done || assert.async();
//     assert.expect(3);

//     var myObject = Crisp.utilCreate({
//         ns: 'util.path'
//     }).objIni();
    
//     assert.strictEqual( myObject.pathNode({ path: 'x:', preset: 'X' }), 'X' );
//     assert.strictEqual( myObject.pathNode({ path: 'x:', preset: function() { return 'X'; } }), 'X' );
//     assert.strictEqual( myObject.pathNode({ path: 'x:' }), undefined );

//     done();
// };


exports['pathFind'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(4);

    var testList = [];
    
    var myObject = Crisp.utilCreate({
        ns: 'util.path'
    }).objIni().objData({ a: 'A', b: 'B' });
    
    myObject.pathFind({
        path: 'a:',
        success: function( item ) {
            // console.log('Success:', item );
            assert.strictEqual( myObject, this );
            assert.strictEqual( myObject.a, item );
            testList.push( item );
        },
        complete: function() {
            // console.log('Complete:', e.List().xTo() );
            assert.strictEqual( myObject, this );
            assert.strictEqual( '["A"]', testList.xTo() );
        }
    });
    // console.log('End');

    done();
};

exports['pathFind option.path'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(2);
    
    var testList = [];
    
    var myObject = Crisp.utilCreate({
        ns: 'util.path'
    }).objIni().objData({ a: 'A', b: 'B' });
    
    myObject.pathFind({
        path: '*',
        success: function ( item ) {
            testList.push( item );
        },
        complete: function() {
            // console.log('Complete:', e.List().xTo() );
            assert.strictEqual( myObject, this );
            assert.strictEqual( '["A","B"]', testList.xTo() );
        }
    });
    // console.log('End');

    done();
};

exports['pathFind option.async'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(4);
    
    var testCount = 0;

    var testList = [];
    
    var myObject = Crisp.utilCreate({
        ns: 'util.path'
    }).objIni().objData({ a: 'A', b: 'B' });
    
    myObject.pathFind({
        path: '*',
        async: true,
        success: function ( item ) {
            testList.push( item );
        },
        complete: function() {
            // console.log('Complete:', e.List().xTo() );
            assert.equal( testCount, 1 );
            assert.strictEqual( myObject, this );
            assert.strictEqual( '["A","B"]', testList.xTo() );
            done();
        }
    });
    // console.log('End');

    assert.equal( testCount, 0 );
    testCount += 1;
};

exports['pathFind option.success'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(2);

    var testCount = 0;
    var testData = [{ data: 'A' }, { data: 'B' }];
    
    var myObject = Crisp.utilCreate({
        ns: 'util.path'
    }).objIni().objData({ a: 'A', b: 'B' });
    
    myObject.pathFind({
        path: '*',
        success: function( item ) {
            // console.log('Success:', item );
            assert.strictEqual( testData[ testCount++ ].data, item );
        }
    });
    // console.log('End');

    done();
};

exports['pathFind option.limit'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(2);
    
    var testList = [];
    
    var myObject = Crisp.utilCreate({
        ns: 'util.path'
    }).objIni().objData({ a: 'A', b: 'B' });
    
    myObject.pathFind({
        // path: '~1.',
        path: '*',
        limit: 1,
        success: function ( item ) {
            testList.push( item );
        },
        complete: function() {
            // console.log('Complete:', e.List().xTo() );
            assert.strictEqual( myObject, this );
            assert.strictEqual( '["A"]', testList.xTo() );
        }
    });
    // console.log('End');

    done();
};

exports['pathFind option.start'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(2);
    
    var testList = [];
    
    var myObject = Crisp.utilCreate({
        ns: 'util.path'
    }).objIni().objData({ a: 'A', b: 'B' });
    
    myObject.pathFind({
        path: '*',
        start: 1,
        success: function ( item ) {
            testList.push( item );
        },
        complete: function() {
            // console.log('Complete:', e.List().xTo() );
            assert.strictEqual( myObject, this );
            assert.strictEqual( '["B"]', testList.xTo() );
        }
    });
    // console.log('End');

    done();
};

exports['pathFind option.start out of data'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(2);
    
    var testList = [];
    
    var myObject = Crisp.utilCreate({
        ns: 'util.path'
    }).objIni().objData({ a: 'A', b: 'B' });
    
    myObject.pathFind({
        path: '*',
        start: 2,
        success: function ( item ) {
            testList.push( item );
        },
        complete: function() {
            // console.log('Complete:', e.List().xTo() );
            assert.strictEqual( myObject, this );
            assert.strictEqual( '[]',testList.xTo() );
        }
    });
    // console.log('End');

    done();
};

// exports['pathExists'] = function(assert) {
//     var done = assert.done || assert.async();
//     assert.expect(3);
    
//     var myObject = Crisp.utilCreate({
//         ns: 'util.path'
//     }).objIni().objData({ a: 'A', b: 'B' });
    
//     assert.ok( myObject.pathExists('b') );
//     assert.ok( myObject.pathExists('*') );
//     assert.ok( !myObject.pathExists('x') );

//     done();
// };

exports['abst.pathFind function arguments'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(2);
    
    var myObject = Crisp.utilCreate({
        ns: 'util.path',
        prototypes: {
            myFn: function() {
                // console.log('filter:', arguments );
                return arguments;
            }
        }
    }).objIni().objData([{ a: 'A' }, { a: 'B' }]);
    
    myObject.pathFind({
        path: ':myFn("list","*\\(a>20\\)")',
        success: function( item ) {
            // console.log('Success:', item );
            // assert.deepEqual({ '0': 'list', '1': '*(a>20)' }, item );
            assert.strictEqual( 'list', item[0] );
            assert.strictEqual( '*(a>20)', item[1] );
        }
    });

    done();
};

exports['abst.pathFind filter'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(2);

    var testCount = 0;
    var testData = [{ data: 11 }, { data: 22 }];
    
    var mySub = Crisp.utilCreate({
        ns: 'util.path',
        prototypes: {
            myFilter: function() {
                console.log('filter:', arguments );
            }
        }
    });

    var myObject = Crisp.utilCreate({
        ns: 'util.path'
    }).objIni().objData([
        mySub.objClone().objData({ a: 11 }),
        mySub.objClone().objData({ a: 22 })
    ]);
    
    myObject.pathFind({
        path: '*',
        success: function( item ) {
            // console.log('Success:', item );
            assert.strictEqual( testData[ testCount++ ].data, item.a );
        }
    });
    // console.log('End');

    done();
};

exports['abst.pathFind specific'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(6);

    var testCount = 0;
    var testData = [
        // { data: '"A"' }
        { data: '{"a":{"b":"B","c":"C"},"g":[{"h":"H0","i":"I0"},{"h":"H1","i":"I1"},{"h":"H2","i":"I2"},{"h":"H3","i":"I3"},{"h":"H4","i":"I4"},{"h":"H5","i":"I5"}]}' },
        { data: '{"b":"B","c":"C"}' },
        { data: '"B"' },
        { data: '"C"' }
    ];
    
    var myObject = Crisp.utilCreate({
        ns: 'util.path'
    }).objIni().objData({
        // 'a': 'A'
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
    });
    
    myObject.pathFind(
        {
            // path: '+( : == "A" ).#:xTo'
            path: '+( :xType("Array") == false ).#:xTo '
        },
        function( doc ) {
            console.log('Success:', doc );
            assert.strictEqual( doc, testData[ testCount++ ].data );
        },
        function() {
            console.warn('Complete:', testCount );
            assert.equal( ++testCount, 5 );
        }
    );
    // console.log('End');
    assert.equal( ++testCount, 6 );

    done();
};
