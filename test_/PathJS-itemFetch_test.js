
exports['no test'] = function (assert) {
    var done = assert.done || assert.async();
    assert.ok(1);
    done();   
};


exports['Object.itemFetch'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(1);

    var t = [];
    // var count = 0;

    var data = {
        a: 'A',
        b: 'B'
    };

    function itemFetch(opt, success) {
        success.call( this, data[opt.name] );
    }
    
    var myObject = Crisp.utilCreate({
        ns: 'util.path',
        prototypes: {
            itemFetch: Crisp.utilPick( itemFetch )
        }
    }).objIni();

    myObject.pathFind(
        {
            path: 'a:'
        },
        function (doc) {
            t.push(doc);
        },
        function () {
            t.push('end');
            assert.equal( t.join(','), 'A,end' );
            done();
        }
    );
};
