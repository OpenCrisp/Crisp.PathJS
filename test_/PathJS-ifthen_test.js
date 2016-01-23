
exports['pathFind: if true then next'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(2);

    var testList = [];
    
    var myObject = Crisp.utilCreate({
        ns: 'util.path'
    }).objIni().objData({ a: 'A', b: 'B' });
    
    myObject.pathFind({
        path: 'a:&b:',
        success: function( item ) {
            assert.strictEqual( 'B', item );
            testList.push( item );
        },
        complete: function() {
            assert.strictEqual( '["B"]', testList.xTo() );
        }
    });
    // console.log('End');

    done();
};
