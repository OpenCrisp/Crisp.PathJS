


exports['pathFind: in out'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(1);
    
    var myObject = Crisp.utilCreate({
        ns: 'util.path'
    }).objIni().objData({ x: { a: 'A', b: 'B' } });
    
    Object.defineProperty( myObject.x, '__parent__', {
        value: myObject
    });

    myObject.pathFind(
        { path: 'x..:xTo' },
        function( doc ) {
            assert.strictEqual( '{"x":{"a":"A","b":"B"}}', doc );
        }
    );

    done();
};


exports['pathFind: in filter of parent then'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(1);
    
    var myObject = Crisp.utilCreate({
        ns: 'util.path'
    }).objIni().objData({ x: { a: 'A' }, y: 'A' });
    
    Object.defineProperty( myObject.x, '__parent__', {
        value: myObject
    });

    myObject.pathFind(
        { path: 'x.(.y:=="A").a:' },
        function( doc ) {
            assert.strictEqual( 'A', doc );
        }
    );

    done();
};


exports['pathFind: values.root'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(2);
    
    var myObject = Crisp.utilCreate({
        ns: 'util.path'
    }).objIni().objData({ x: { a: 'A' }, y: 'A' });
    
    Object.defineProperty( myObject.x, '__parent__', {
        value: myObject
    });

    Crisp.definePath( myObject.x );

    myObject.x.pathFind(
        { path: '$root.y:' },
        function( doc ) {
            assert.strictEqual( 'A', doc );
        }
    );

    myObject.pathFind(
        { path: 'x.(a:==$root.y:).a:' },
        function( doc ) {
            assert.strictEqual( 'A', doc );
        }
    );

    done();
};
