
    
// exports['no test'] = function (assert) {
//     var done = assert.done || assert.async();
//     assert.ok(1);
//     done();   
// };


exports['utilPick * parallel inherit'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(1);

    var list = [];
    // var count = 0;

    function itemEach() {
        // optEach.start = 1;
        this.xEach.callback.apply( this, arguments );
    }
    
    var myObject = Crisp.utilCreate({
        ns: 'util.path',
        prototypes: {
            itemEach: Crisp.utilPick( itemEach )
        }
    }).objIni().objData({ a: 'A', b: 'B' });

    myObject.pathFind(
        {
            path: '*:'
        },
        function (doc) {
            list.push(doc);
        },
        function () {
            list.push('end');
            assert.equal( list.join(','), 'A,B,end' );
            done();
        }
    );
};

exports['utilPick * async'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(1);

    var list = [];
    // var count = 0;
    
    function Type( str ) {
        this._tmp = String( str );
    }

    Type.prototype.isField = function () {
        return true;
        // return this._tmp === 'A';
    };

    function toPick( option, success, picker ) {
        var self = this;

        picker.Wait();
        Crisp.nextTick(function() {
            success.call( self, self._tmp, picker );
            // console.log('bla', self._tmp );
            picker.Talk();
        });
    }

    Type.prototype.toPick = Crisp.utilPick( toPick );

    var myObject = Crisp.utilCreate({
        ns: 'util.path',
        prototypes: {
            // isAbst: function () {},
            toPick: function () {
                return 'S';
            }
        }
    }).objIni().objData({ a: new Type('A'), b: new Type('B') });

    myObject.pathFind(
        {
            // path: '(*:toPick)'
            // path: '*.( false | true ):toPick'
            path: '*.( :isField ):toPick'
            // path: '*.( :toPick=="A" ):toPick'
        },
        function (doc) {
            // console.log('$$$$ ', doc );
            list.push(doc);
        },
        function () {
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

exports['utilPick # async'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(1);

    var list = [];
    // var count = 0;
    
    function Type( str ) {
        this._tmp = String( str );
    }

    Type.prototype.isField = function () {
        return true;
        // return this._tmp === 'A';
    };

    function toPick( option, success, picker ) {
        var self = this;

        picker.Wait();
        Crisp.nextTick(function() {
            success.call( self, self._tmp, picker );
            // console.log('bla', self._tmp );
            picker.Talk();
        });
    }

    Type.prototype.toPick = Crisp.utilPick( toPick );

    var myObject = Crisp.utilCreate({
        ns: 'util.path',
        prototypes: {
            isAbst: function () {
                return false;
            },
            toPick: function () {
                return 'S';
            }
        }
    }).objIni().objData({ a: new Type('A'), b: new Type('B') });

    myObject.pathFind(
        {
            path: '+( !:isAbst )#:toPick'
        },
        function (doc) {
            // console.log('$$$$ ', doc );
            list.push(doc);
        },
        function () {
            list.push('end');
            assert.equal( list.join(','), 'S,end' );
            done();
        }
    );


    // setTimeout(function () {
    //         assert.equal( list.join(','), 'S,end' );
    //     done();
    // }, 1000 );
};




exports['utilPick # parallel inherit'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(1);

    var list = [];
    // var count = 0;

    function itemEach( optEach ) {
        optEach.start = 1;
        this.xEach.callback.apply( this, arguments );
    }
    
    var myObject = Crisp.utilCreate({
        ns: 'util.path',
        prototypes: {
            itemEach: Crisp.utilPick( itemEach ),
            toString: function () {
                return 'S';
            }
        }
    }).objIni().objData({ a: 'A', b: 'B' });

    // console.log( myObject );

    myObject.pathFind(
        {
            path: '#:'
        },
        function (doc) {
            list.push(doc);
        },
        function () {
            list.push('end');
            assert.equal( list.join(','), 'S,B,end' );
            done();
        }
    );
};

exports['utilPick # raw'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(1);

    var list = [];
    // var count = 0;

    function itemEach() {
        this.xEach.callback.apply( this, arguments );
    }
    
    var myObject = Crisp.utilCreate({
        ns: 'util.path',
        prototypes: {
            itemEach: Crisp.utilPick( itemEach ),
            toString: function () {
                return 'S';
            }
        }
    }).objIni().objData({ a: 'A', b: 'B' });

    // console.log( myObject );

    myObject.pathFind(
        {
            path: '#'
        },
        function (doc) {
            list.push( doc.toString() );
        },
        function () {
            list.push('end');
            assert.equal( list.join(','), 'S,A,B,end' );
            done();
        }
    );
};

exports['utilPick # specific'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(1);

    var list = [];
    // var count = 0;

    function itemEach() {
        this.xEach.callback.apply( this, arguments );
    }
    
    var myObject = Crisp.utilCreate({
        ns: 'util.path',
        prototypes: {
            isAbst: function () {
                return true;
            },
            itemEach: Crisp.utilPick( itemEach ),
            toString: function () {
                return 'S';
            }
        }
    }).objIni().objData({ a: 'A', b: 'B' });

    // console.log( myObject );

    myObject.pathFind(
        {
            path: '+( :isAbst )#:'
        },
        function (doc) {
            list.push(doc);
        },
        function () {
            list.push('end');
            assert.equal( list.join(','), 'S,end' );
            done();
        }
    );
};

// exports['utilPick # specific &'] = function(assert) {
//     var done = assert.done || assert.async();
//     assert.expect(1);

//     var list = [];
//     // var count = 0;
    
//     function Type( str ) {
//         this._tmp = String( str );
//     }

//     Type.prototype.isField = function () {
//         return true;
//         // return this._tmp === 'A';
//     }

//     function toPick( option, success, picker ) {
//         var self = this;

//         // picker.Wait();
//         // Crisp.nextTick(function() {
//             success.call( self, self._tmp, picker );
//         //     picker.Talk();
//         // });
//     }

//     Type.prototype.toPick = Crisp.utilPick( toPick );

//     var myObject = Crisp.utilCreate({
//         ns: 'util.path',
//         prototypes: {
//             isAbst: function () {
//                 return true;
//             },
//             toPick: function () {
//                 return 'S';
//             }
//         }
//     }).objIni().objData({ a: new Type('A'), b: new Type('B') });

//     myObject.pathFind(
//         {
//             // path: '+(:isAbst).#:toPick'
//             path: '+(:isAbst & :isAbst).#:toPick'
//         },
//         function (doc) {
//             // console.log('$$$$ ', doc );
//             list.push(doc);
//         },
//         function () {
//             list.push('end');
//             assert.equal( list.join(','), 'S,end' );
//             done();
//         }
//     );

//     setTimeout(function () {
//             assert.equal( list.join(','), 'S,end' );
//         done();
//     }, 1000 );
// };

