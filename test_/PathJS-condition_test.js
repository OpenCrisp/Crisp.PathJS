

exports['pathFind: condition path is string'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(1);
    
    var myObject = Crisp.utilCreate({
        ns: 'util.path'
    }).objIni().objData({ a: 'A', b: 'B' });
    
    myObject.pathFind(
        { path: 'a:=="A"' },
        function( doc ) {
            assert.ok( doc );
        }
    );

    done();
};


exports['pathFind: condition path is path'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(1);
    
    var myObject = Crisp.utilCreate({
        ns: 'util.path'
    }).objIni().objData({ a: 'A', b: 'B' });
    
    myObject.pathFind(
        { path: 'a: != b:' },
        function( doc ) {
            assert.ok( doc );
        }
    );

    done();
};

exports['pathFind: in conditionGroup of parent'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(1);
    
    var myObject = Crisp.utilCreate({
        ns: 'util.path'
    }).objIni().objData({ x: { a: 'A', b: 'B' }, y: 'A' });
    
    Object.defineProperty( myObject.x, '__parent__', {
        value: myObject
    });

    myObject.pathFind(
        { path: 'x.(a:==.y:).b:' },
        function( doc ) {
            assert.strictEqual( 'B', doc );
        }
    );

    done();
};

exports['pathFind: in conditionGroup of outsite parent'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(1);
    
    var myObjectX = Crisp.utilCreate({
        ns: 'util.path'
    }).objIni().objData({ a: 'A', b: 'B' });
    
    var myObject = Crisp.utilCreate({
        ns: 'util.path'
    }).objIni().objData({ x: myObjectX, y: 'A' });
    
    Object.defineProperty( myObject.x, '__parent__', {
        value: myObject
    });

    myObject.x.pathFind(
        { path: 'a:==.y:&b:' },
        function( doc ) {
            assert.strictEqual( 'B', doc );
        }
    );

    done();
};


exports['pathFind: condition abst.field in abst.field'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(1);

    var Break = Crisp.ns('util.control.Break');

    var t = [];
    
    var myObject = Crisp.utilCreate({
        ns: 'util.path'
    }).objIni().objData({ a: ['A','C'], b: ['B','C','D','C'] });
    
    myObject.pathFind(
        { path: 'a.*.($self.b.*:==:):' },
        function (doc) {
            // console.log('doc:', doc);
            t.push(doc);
            throw new Break();
        },
        function() {
            assert.deepEqual(t, ['C']);
            // console.log('-- END --');
        }
    );

    done();
};
