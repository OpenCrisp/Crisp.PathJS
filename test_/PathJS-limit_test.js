
    
// exports['no test'] = function (assert) {
//     var done = assert.done || assert.async();
//     assert.ok(1);
//     done();   
// };


exports['pathFind limit'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(1);

    var testList = [];
    
    var myObject = Crisp.utilCreate({
        ns: 'util.path'
    }).objIni().objData([
        { a: 'A0', b: 'B0' },
        { a: 'A1', b: 'B1' },
        { a: 'A2', b: 'B2' },
        { a: 'A3', b: 'B3' }
    ]);
    
    myObject.pathFind(
        { path: '~2.a:' },
        function success( item ) {
            // console.log('Success:', item );
            testList.push( item );
        },
        function complete() {
            // console.log('Complete:', testList.xTo() );
            assert.strictEqual( '["A0","A1"]', testList.xTo() );
        }
    );
    // console.log('End');

    done();
};

exports['pathFind start limit'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(1);

    var testList = [];
    
    var myObject = Crisp.utilCreate({
        ns: 'util.path'
    }).objIni().objData([
        { a: 'A0', b: 0 },
        { a: 'A1', b: 1 },
        { a: 'A2', b: 2 },
        { a: 'A3', b: 3 }
    ]);
    
    myObject.pathFind(
        { path: '1~2.a:' },
        function success( item ) {
            // console.log('Success:', item );
            testList.push( item );
        },
        function complete() {
            // console.log('Complete:', testList.xTo() );
            assert.strictEqual( '["A1","A2"]', testList.xTo() );
        }
    );
    // console.log('End');

    done();
};

exports['pathFind reverse limit'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(1);

    var testList = [];
    
    var myObject = Crisp.utilCreate({
        ns: 'util.path'
    }).objIni().objData([
        { a: 'A0', b: 0 },
        { a: 'A1', b: 1 },
        { a: 'A2', b: 2 },
        { a: 'A3', b: 3 }
    ]);
    
    myObject.pathFind(
        { path: '-2~.a:' },
        function success( item ) {
            // console.log('Success:', item );
            testList.push( item );
        },
        function complete() {
            // console.log('Complete:', testList.xTo() );
            assert.strictEqual( '["A2","A3"]', testList.xTo() );
        }
    );
    // console.log('End');

    done();
};


exports['pathFind filter limit'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(1);

    var testList = [];
    
    var myObject = Crisp.utilCreate({
        ns: 'util.path'
    }).objIni().objData([
        { a: 'A0', b: 0 },
        { a: 'A1', b: 1 },
        { a: 'A2', b: 2 },
        { a: 'A3', b: 3 }
    ]);
    
    myObject.pathFind(
        { path: '+(b:valueOf > 1).~2.a:' },
        function success( item ) {
            // console.log('Success:', item );
            testList.push( item );
        },
        function complete() {
            // console.log('Complete:', testList.xTo() );
            assert.strictEqual( '["A2","A3"]', testList.xTo() );
        }
    );
    // console.log('End');

    done();
};


exports['pathFind filter reverse limit'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(1);

    var testList = [];
    
    var myObject = Crisp.utilCreate({
        ns: 'util.path'
    }).objIni().objData([
        { a: 'A0', b: 0 },
        { a: 'A1', b: 1 },
        { a: 'A2', b: 2 },
        { a: 'A3', b: 3 }
    ]);
    
    myObject.pathFind(
        { path: '+(b:valueOf < 3).-3~.a:' },
        function success( item ) {
            // console.log('Success:', item );
            testList.push( item );
        },
        function complete() {
            // console.log('Complete:', testList.xTo() );
            assert.strictEqual( '["A1","A2"]', testList.xTo() );
        }
    );
    // console.log('End');

    done();
};
