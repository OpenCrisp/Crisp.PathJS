
exports['utilPick'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(1);

    var list = [];
    // var count = 0;
    
    function Type( str ) {
        this._tmp = String( str );
    }
    
    function isField( option, success, picker ) {
        // return true;
        // return this._tmp === 'A';
        
        // success.call( this, this._tmp, picker );
        // return;
        
        var self = this;
        picker.Wait();
        Crisp.nextTick(function() {
            success.call( self, self._tmp, picker );
            picker.Talk();
        });
    }

    Type.prototype.isField = Crisp.utilPick( isField );

    function toPick( option, success, picker ) {
        var self = this;

        picker.Wait();
        Crisp.nextTick(function() {
            success.call( self, self._tmp, picker );
            console.log('bla', self._tmp );
            picker.Talk();
        });
    }

    Type.prototype.toPick = Crisp.utilPick( toPick );

    var myObject = Crisp.utilCreate({
        ns: 'util.path',
        prototypes: {
            isAbst: function () {
                // return undefined;
                // return false;
                // return 'A';
            },
            toPick: function () {
                return 'S';
            }
            // toPick: Crisp.utilPick( function ( option, success, picker ) {
            //     // picker.Wait();
            //     // Crisp.nextTick(function () {
            //         success.call( this, 'S' );
            //     //     picker.Talk();
            //     // });
            // })
        }
    }).objIni().objData({ a: new Type('A'), b: new Type('B') });

    myObject.pathFind(
        {
            // path: ':toPick'
            // path: ':isAbst | :toPick'
            // path: ':isAbst & :toPick'
            // path: '*:toPick'
            path: '*.( :isField ):toPick'
        },
        function (doc) {
            // console.log('$$$$ ', doc );
            console.warn('pathFind success', doc );
            list.push(doc);
        },
        function () {
            console.warn('pathFind complete');
            list.push('end');
            assert.equal( list.join(','), 'A,B,end' );
            done();
        }
    );

    // setTimeout(function () {
    //         assert.equal( list.join(','), 'A,B,end' );
    //     done();
    // }, 1000 );
};

// exports['pathNode Boolean'] = function(assert) {
//     var done = assert.done || assert.async();
//     assert.expect(2);
    
//     var myObject = { a: true, b: false };
//     Crisp.definePath( myObject );

//     assert.strictEqual( true, myObject.pathNode('a') );
//     assert.strictEqual( false, myObject.pathNode('b') );

//     done();
// };
