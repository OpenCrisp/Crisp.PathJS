
exports['pathFind.xMath'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(3);

    var testCount = 0;
    var testValue = [ 20.5, 21 ];
    var testList = [];
    
    var myObject = [ 20.49, 20.5, 20, 21 ];

    Crisp.definePath( myObject );

    myObject.pathFind({
        path: '*( :xMath("round") >= 21 )',
        success: function( item ) {
            // console.log('Success:', item );
            assert.strictEqual( testValue[ testCount++ ], item );
            testList.push( item );
        },
        complete: function() {
            // console.log('Complete');
            assert.deepEqual( testValue, testList );
        }
    });
    // console.log('End');

    // logs:
    // Success: 20.5
    // Success: 21
    // Complete
    // End

    done();
};
