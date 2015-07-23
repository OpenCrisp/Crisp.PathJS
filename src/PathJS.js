
/**
 * PathJS Crisp functions
 * @namespace util.path
 * 
 * @tutorial {@link http://opencrisp.wca.at/tutorials/PathJS_test.html|use PathJS}
 */

(function($$) {

    // function print( self, name, score ) {
    //     // return;

    //     var level = 4 * self.level;
    //     var str = '\x1B[37m' + printFill( self.index, 5 + level ) + '\x1B[39m' + printFill( name, 40 - level );

    //     if (score) {
    //      score.forEach(function( item, self ) {
    //          var color = self === 0 ? '\x1B[31m' : '\x1B[32m';
    //          var size = self === 0 ? 30 : 10;
    //          str += '\x1B[90m> ' + color + printFill( item || '', size );
    //      });
    //     }
    //     else {
    //      str = printFill( str, 200, '-');
    //     }

    //     console.log( str );
    // }

    // function printFill( str, m, fill ) {
    //     fill = fill || ' ';
    //     str = ''.concat(str);
    //     for ( var i = str.length; i<m; i+=1 ) {
    //      str += fill;
    //     }
    //     return str;
    // }


    var utilTick        = $$.utilTick;
    // var stringToRegExp  = RegExp.escape;
    var isType          = $$.isType;
    

    var Break = $$.ns('util.control.Break');
    var End = $$.ns('util.control.End');

    var regDoubleQuote = /\\"/g;
    var regSingleQuote = /\\'/g;




    var fnOperator = {
        '>': function( val0, val1 ) {
            return val0 > val1;
        },
        '<': function( val0, val1 ) {
            return val0 < val1;
        },
        '>=': function( val0, val1 ) {
            return val0 >= val1;
        },
        '<=': function( val0, val1 ) {
            return val0 <= val1;
        },
        '==': function( val0, val1 ) {
            return val0 === val1;
        },
        '!=': function( val0, val1 ) {
            return val0 !== val1;
        }
    };


    var fnFind = {

        '*': function( node ) {
            node.xEach({
                self: this,
                success: function( item ) {
                    nextTick.call( this, item );
                }
            });
        },

        '+': function( node ) {
            // console.log('fnFind.#', node.docPath(), testSpecific );
            
            if ( this.child ) {
                this._specific = this.child.filter;
            }

            if ( !execValue( this.specific(), node ) ) {
                return;
            }

            this.child.exec( node );
        },

        '#': function( node ) {
            var specific = this.specific();
            var testSpecific = specific ? execValue( specific, node ) : true;
            // console.log('fnFind.#', node.docPath(), testSpecific );

            if ( !testSpecific ) {
                // console.log('fnFind.#.isField');
                return;
            }

            this.child.exec( node );

            // if ( node.isField() ) {
            if ( !isType( node.xEach, 'Function' ) ) {
                // console.log('fnFind.#.isField');
                return;
            }

            // if ( node.docNotuse() ) {
            //  return;
            // }

            node.xEach({
                self: this,
                success: function( item ) {
                    // console.log('\x1B[31mfnFind.#.xEach', item.docPath(), '\x1B[39m' );

                    fnFind['#'].call( this, item );
                }
            });
        }
        
    };



    function isFunction( fn ) {
        return isType( fn, 'Function' );
    }


    function execReverse( reverse, node ) {
        var i=0;

        for (; i<reverse; i+=1 ) {
            // console.log('execReverse:', typeof node, node );
            node = (node==='false' || node===false) ? true : !node;
        }

        return node;
    }


    function execValue( ref, node ) {
        var val;

        if ( !ref ) {
            return;
        }

        ref._reason = {};
        $$.defineEvent( ref._reason );

        ref._reason.eventListener({
            limit: 1,
            action: 'success',
            listen: function(e) {
                // console.log('-- execValue: success', e.data );
                val = e.data;
            }
        });

        ref.exec( node );

        return val;
    }


    var strCondition = '\\s*(?:' + 
                '(\\!=|[<>=]{1,2})' +                                       // [1] operator
        '|' +   '(\\!+)' +                                                  // [2] reverse
        '|' +   '(&|\\|)' +                                                 // [3] next
        '|' +   '(\\[|\\()' +                                               // [4] child = findPathCondition
        '|' +   '(\\]|\\))\\.?' +                                           // [5] END of this PathConditionGroup

        '|' +   '([0-9]+(?:\\.[0-9]+)?)(?!\\.|:)' +                                             // [6] Number
        '|' +   '(true|false)' +                                            // [7] Boolean String
        '|' +   '"((?:[^"\\\\]*|\\\\"|\\\\)*)"' +                           // [8] DoubleQuotet String
        '|' +   "'((?:[^'\\\\]*|\\\\'|\\\\)*)'" +                           // [9] SingleQuotet String
        '|' +   '\\/((?:[^\\/\\\\]*|\\\\\\/|\\\\)+)\\/([igm]{1,3})?' +      // [10] RegExp inclusive Flags
        '|' +   '\\$([\\w]+)' +                                             // [11] varName for includet values
        
        '|' +   '.+' +                      //     parse() findPathDoc
    ')\\s*';

    var regCondition = new RegExp( strCondition, 'g' );
    // console.log( strCondition );

    var countContition = 0;

    function findPathCondition( parent ) {

        var score;
        var stop;
        var prev;
        var condition;

        var conditionGroup = new PathConditionGroup( this, parent );
        condition = prev = conditionGroup.add(1);

        // print( this, 'findPathCondition START' );
        this.level += 1;

        regCondition.lastIndex = this.index;

        for (; !stop && ( score = regCondition.exec( this.path ) ); ) {
            this.index = regCondition.lastIndex;
            countContition += 1;

            // console.log('');
            // print( this, 'findPathCondition', score );

            // \\!=|[<>=]{1,2}
            if ( score[1] !== undefined ) {
                condition._operator = score[1];
                // condition.value = [ condition.child, findPathCondition.call( this, condition ) ];
                // condition.value = [ condition.child, condition = conditionGroup.add() ];
                condition = condition.value = conditionGroup.add();
                // stop = true;
            }
            // \\!+
            else if ( score[2] !== undefined ) {
                condition._reverse = score[2].length;
            }
            // &|\\|
            else if ( score[3] !== undefined ) {
                prev._next = score[3];
                condition = prev = conditionGroup.add(1);
                // condition._prev = score[3];
            }
            // \\[|\\(
            else if ( score[4] !== undefined ) {
                condition.child = findPathCondition.call( this, condition );
            }
            // (\\]|\\))\\.?
            else if ( score[5] !== undefined ) {
                stop = true;
            }
            // [0-9\\.]+
            else if ( score[6] !== undefined ) {
                condition.child = new PathValue( condition, Number(score[6]) );
            }
            // true|false
            else if ( score[7] !== undefined ) {
                condition.child = new PathValue( condition, score[7] === 'true' );
            }
            // "((?:[^"\\\\]*|\\\\"|\\\\)*)"
            else if ( score[8] !== undefined ) {
                condition.child = new PathValue( condition, score[8].replace( regDoubleQuote, '"' ) );
            }
            // \'((?:[^\'\\\\]*|\\\'|\\\\)*)\'
            else if ( score[9] !== undefined ) {
                condition.child = new PathValue( condition, score[9].replace( regSingleQuote, "'" ) );
            }
            // \\/((?:[^\\/\\\\]*|\\\\\\/|\\\\)+)\\/([igm]{1,3})?
            else if ( score[10] !== undefined ) {
                condition.child = new PathValue( condition, new RegExp( score[10], score[11] ) );
            }
            // \\$([\\w]+)
            else if ( score[12] !== undefined ) {
                condition.child = new PathValue( condition, this.valueKey(score[12]) );
            }
            else {
                this.index = score.index;
                condition.parse();
            }

            regCondition.lastIndex = this.index;

            // if ( countContition > 20 ) {
            //  throw new Error();
            // }
        }

        this.level -= 1;
        // print( this, 'findPathCondition END' );

        return conditionGroup;
    }

    function conditionGroupExecSuccess( item ) {
        // console.log('PathConditionGroup.exec', this.node );
        var tmp;
        // var reason2 = item.reason();

        if ( item.next('&') ) {
            tmp = execValue( item, this.node );
            // console.log('PathConditionGroup.exec &', tmp );

            if ( !tmp ) {
                throw new Break();
            }
            return;
        }
        else if ( item.next('|') ) {
            tmp = execValue( item, this.node );
            // console.log( item, this.node );
            // console.log('PathConditionGroup.exec |', tmp );

            if ( tmp ) {

                this.reason.eventTrigger({
                    action: 'success',
                    args: tmp
                });

                throw new Break();
            }
            return;
        }

        item.exec( this.node );
    }

    function PathConditionGroup( reason, parent ) {
        if ( !parent ) {
            this._reason = reason;
        }

        // this._parent = parent;
        Object.defineProperty( this, '_parent', { value: parent });
        this.condition = [];
    }

    PathConditionGroup.prototype = {
        parent: function( fn ) {
            if ( fn ) {
                return this._parent && isFunction( this._parent[ fn ] ) && this._parent[ fn ]();
            }
            else {
                return this._parent;
            }
        },

        reason: function() {
            return this._reason || this.parent('reason');
        },

        specific: function() {
            return this._specific || this.parent('specific');
        },

        add: function( include ) {
            var condition = new PathCondition( this );
            if ( include ) {
                this.condition.push( condition );
            }
            return condition;
        },

        exec: function( node ) {
            var reason = this.reason();

            var picker = reason.eventPicker({
                cache: reason,
                action: 'complete'
            });

            this.condition.xEach({
                self: {
                    node: node,
                    reason: reason
                },
                success: conditionGroupExecSuccess
            });

            picker.Talk();
        }
    };


    function PathCondition( parent ) {
        // this._parent = parent;
        Object.defineProperty( this, '_parent', { value: parent });
    }

    PathCondition.prototype = {
        parent: function( fn ) {
            if ( fn ) {
                return this._parent && isFunction( this._parent[ fn ] ) && this._parent[ fn ]();
            }
            else {
                return this._parent;
            }
        },

        reason: function() {
            return this._reason || this.parent('reason');
        },

        specific: function() {
            return this._specific || this.parent('specific');
        },

        parse: function() {
            this.child = findPathDoc.call( this.reason(), this );
            return this;
        },

        exec: function( node ) {
            var child, value;

            // console.log('exec PathCondition', node );

            if ( !this.reverse() && !this.operator() ) {
                return nextTick.call( this, node );
            }

            child = execValue( this.child, node );
            child = execReverse( this.reverse(), child );
            
            if ( this.operator() ) {

                value = execValue( this.value, node );

                if ( value instanceof RegExp ) {
                    child = value.test( child );
                    value = true;
                }

                child = fnOperator[ this.operator() ]( child, value );
                // console.log('-- operator:', this.operator(), child, value );
            }
            
            this.reason().eventTrigger({
                action: 'success',
                args: child
            });
        },

        reverse: function() {
            return this._reverse || 0;
        },

        operator: function() {
            return this._operator || 0;
        },

        next: function( next ) {
            return next ? this._next === next : this._next;
        }
    };



    var strPathDoc = '\\s*(?:' +
                '(\\.)' +                               // [1] PathParent PathDoc
        '|' +   '([0-9]+|[a-z][a-z0-9\\-]*)\\.?' +      // [2] PathDoc Attribute-Name
        '|' +   '([*#+])\\.?' +                         // [3] PathValue Node
        '|' +   '\\$([a-z0-9_]+)\\.?' +                 // [4] PathRepeat
        '|' +   '(:)' +                                 // [5] findPathFunction
        '|' +   '(\\[|\\()' +                           // [6] findPathCondition
        '|' +   '.+' +                                  //     END of findPathDoc
    ')\\s*';
    var regPathDoc = new RegExp( strPathDoc, 'g' );

    function findPathDoc( parent ) {
        var obj;
        // print( this, 'findPathDoc' );

        regPathDoc.lastIndex = this.index;
        var score = regPathDoc.exec( this.path );

        if ( !score ) {
            return;
        }

        this.index = regPathDoc.lastIndex;

        // print( this, 'findPathDoc', score );

        // \\.
        if ( score[1] !== undefined ) {
            obj = new PathParent( parent ).parse();
        }
        // [0-9]+|[a-z][a-z0-9\\-]*
        else if ( score[2] !== undefined ) {
            obj = new PathDoc( parent, score[2] ).parse();
        }
        // [*#+]
        else if ( score[3] !== undefined ) {
            obj = new PathRepeat( parent, score[3] ).parse();
        }
        // \\$([a-z0-9_]+)\\.?
        else if ( score[4] !== undefined ) {
            obj = new PathDoc( parent, this.valueKey( score[4] ) ).parse();
        }
        // :
        else if ( score[5] !== undefined ) {
            obj = findPathFunction.call( this, parent );
        }
        // \\[|\\(
        else if ( score[6] !== undefined ) {
            obj = new PathFilter( parent ).parse();
        }
        else {
            this.index = score.index;
            return;
        }

        return obj;
    }



    function PathFilter( parent ) {
        // this._parent = parent;
        Object.defineProperty( this, '_parent', { value: parent });
    }

    PathFilter.prototype = {
        parent: function( fn ) {
            if ( fn ) {
                return this._parent && isFunction( this._parent[ fn ] ) && this._parent[ fn ]();
            }
            else {
                return this._parent;
            }
        },

        reason: function() {
            return this._reason || this.parent('reason');
        },

        specific: function() {
            return this._specific || this.parent('specific');
        },

        parse: function() {
            this.filter = findPathCondition.call( this.reason(), this );
            this.child = findPathDoc.call( this.reason(), this );
            return this;
        },

        exec: function( node ) {
            // console.log('PathFilter.exec', !execValue( this.filter, node ) );
            // console.log('============== PathFilter.exec ============' );

            if ( !execValue( this.filter, node ) ) {
                return;
            }

            nextTick.call( this, node );
            return true;
        }
    };



    function PathParent( parent ) {
        // this._parent = parent;
        Object.defineProperty( this, '_parent', { value: parent });
    }

    PathParent.prototype = {
        parent: function( fn ) {
            if ( fn ) {
                return this._parent && isFunction( this._parent[ fn ] ) && this._parent[ fn ]();
            }
            else {
                return this._parent;
            }
        },

        reason: function() {
            return this._reason || this.parent('reason');
        },

        specific: function() {
            return this._specific || this.parent('specific');
        },

        parse: function() {
            this.child = findPathDoc.call( this.reason(), this );
            return this;
        },

        exec: function( node ) {
            // console.log('PathParent.exec' );
            nextTick.call( this, node.__parent__ );
        }
    };


    function PathDoc( reason, attr ) {
        // this._ = reason;
        Object.defineProperty( this, '_parent', { value: reason });
        this._attr = attr;
    }

    PathDoc.prototype = {
        parent: function( fn ) {
            if ( fn ) {
                return this._parent && isFunction( this._parent[ fn ] ) && this._parent[ fn ]();
            }
            else {
                return this._parent;
            }
        },

        reason: function() {
            return this._reason || this.parent('reason');
        },

        specific: function() {
            return this._specific || this.parent('specific');
        },

        parse: function() {
            // console.log('PathDoc.parse child:', this.child );
            this.child = findPathDoc.call( this.reason(), this );
            return this;
        },

        exec: function( node ) {
            // console.log('PathDoc.exec', this.attr() );
            
            if ( !node[ this.attr() ] ) {
                return;
            }

            node = node[ this.attr() ];

            nextTick.call( this, node );
        },

        attr: function() {
            return this._attr;
        }
    };



    function PathRepeat( parent, type ) {
        // this._parent = parent;
        Object.defineProperty( this, '_parent', { value: parent });
        this._type = type;
    }

    PathRepeat.prototype = {
        parent: function( fn ) {
            if ( fn ) {
                return this._parent && isFunction( this._parent[ fn ] ) && this._parent[ fn ]();
            }
            else {
                return this._parent;
            }
        },

        reason: function() {
            return this._reason || this.parent('reason');
        },

        specific: function() {
            return this._specific || this.parent('specific');
        },

        parse: function() {
            this.child = findPathDoc.call( this.reason(), this );
            return this;
        },

        exec: function( node ) {
            // console.log('PathRepeat.exec', this.type(), node );
            fnFind[ this.type() ].call( this, node );
        },

        type: function() {
            return this._type;
        }

    };




    var tplFunctionArgs = '(?:[^)\\\\]*|\\\\\\)|\\\\)+';
    var strFunction = '(?:(\\.)|(\\w+)(?:\\((' + tplFunctionArgs + ')\\))?\\.?)\\s*|.+';
    var regFunction = new RegExp( strFunction, 'g' );

    function findPathFunction( parent ) {
        var score;
        var obj;

        if ( !(parent instanceof PathFunction) ) {
            obj = new PathFunction( parent );
        }

        // print( this, 'findPathFunction' );

        regFunction.lastIndex = this.index;
        score = regFunction.exec( this.path ); 
        
        if ( !score ) {
            return obj;
        }

        this.index = regFunction.lastIndex;
        // print( this, 'findPathFunction', score );

        if ( score[1] !== undefined ) {
            obj = new PathFunction( parent );
        }
        else if ( score[2] !== undefined ) {
            obj = new PathFunction( parent, score[2] );

            if ( score[3] && score[3].length > 0 ) {
                obj._args = JSON.parse('['+score[3]+']');
            }
        }
        else {
            this.index = score.index;
            return obj;
        }

        return obj.parse();
    }


    function PathFunction( parent, name ) {
        // this._parent = parent;
        Object.defineProperty( this, '_parent', { value: parent });
        this._name = name;
        // this._name = name || 'toString';
    }

    PathFunction.prototype = {
        parent: function( fn ) {
            if ( fn ) {
                return this._parent && isFunction( this._parent[ fn ] ) && this._parent[ fn ]();
            }
            else {
                return this._parent;
            }
        },

        reason: function() {
            return this._reason || this.parent('reason');
        },

        specific: function() {
            return this._specific || this.parent('specific');
        },

        parse: function() {
            this.child = findPathFunction.call( this.reason(), this );
            return this;
        },

        exec: function( node ) {
            // console.log('PathFunction.exec', this.name() );

            if ( !isFunction( node[ this.name() ] ) ) {
                throw new Error('PathFunction ' + this.name() + ' is not defined!');
            }

            node = node[ this.name() ].apply( node, this.args() );

            nextTick.call( this, node );
        },

        name: function() {
            return this._name || 'toString';
        },

        args: function() {
            return this._args;
        }
    };



    function PathValue( parent, value ) {
        // this._parent = parent;
        Object.defineProperty( this, '_parent', { value: parent });
        this._value = value;
    }

    PathValue.prototype = {
        parent: function( fn ) {
            if ( fn ) {
                return this._parent && isFunction( this._parent[ fn ] ) && this._parent[ fn ]();
            }
            else {
                return this._parent;
            }
        },

        reason: function() {
            return this._reason || this.parent('reason');
        },

        specific: function() {
            return this._specific || this.parent('specific');
        },

        exec: function() {
            // console.log('PathValue.exec', this.name() );
            nextTick.call( this, this._value );
        }
    };






    function nextTick( node ) {
        // console.log('nextTick:', node );

        if ( this.child ) {
            return this.child.exec( node );
        }


        var reason = this.reason();
        // console.log('nextTick2:', reason );
        
        var picker = reason.eventPicker({
            cache: reason,
            action: 'complete'
        });

        reason.eventTrigger({
            action: 'success',
            // path: path,
            args: node
        });

        picker.Note({
            data: node
        });

        picker.Talk();
        
        if ( reason.limit !== -1 && picker.note.Length() >= reason.limit ) {
            // console.log('nextTick.limit', reason.limit, picker.note.list.own );
            picker.Talk();
            throw new End();
        }
    }






    function parsePath( reason ) {
        // console.log('path:', reason.path );

        var condition = findPathCondition.call( reason );
        // console.log( JSON.stringify( condition ) );
        // console.log( JSON.stringify(condition,null,"\t") );
        // throw new Error();

        // return condition.exec( this );

        try {
            condition.exec( this );
        }
        catch (err) {

            if ( err instanceof End ) {
                return;
            }
            else if ( reason.preset !== undefined ) {
                
                reason.eventTrigger({
                    action: 'success',
                    args: reason.preset
                });

                return;
            }
            else if ( err instanceof Break ) {
                return;
            }

            throw new Error(err);
        }

    }



    function Path( option ) {
        this.index = option.index;        // Zeichenposition für regexp
        this.path = option.path;
        this.values = option.values;
        this.preset = option.preset;
        this.limit = option.limit;
        this.async = option.async;
        this.level = option.level;        // console log
        this.filter = option.filter;       // delete

        // this._success = option.success;
        // this._complete = option.complete;
    }

    Path.prototype = {
        valueKey: function( key ) {
            return this.values[ key ];
        }
    };


    /**
     * Create mothods from PathJS on any Object
     * @function module:BaseJS.definePath
     * 
     * @param  {external:Object} moduleObject any Object for initiate PathJS methods
     * 
     * @return {module:PathJS} returns the given moduleObject
     *
     * @tutorial {@link http://opencrisp.wca.at/tutorials/PathJS_test.html#definePath}
     * 
     */
    $$.definePath = function( moduleObject ) {

        /**
         * @module PathJS
         * 
         * @tutorial  {@link http://opencrisp.wca.at/tutorials/PathJS_test.html}
         * 
         */

        Object.defineProperties( moduleObject, {


            pathNode: {
                value: function( opt ) {
                    var self = this,
                        node;

                    opt = opt || "";

                    if ( {}.toString.call( opt ) === "[object String]" ) {
                        opt = { path: opt };
                    }

                    opt.limit = 1;
                    opt.async = false;
                    opt.success = function(e) {
                        // console.log('pathNode: success e=', e );
                        node = e.data;
                    };

                    self.pathFind( opt );

                    if ( node === undefined ) {
                        // console.log('pathNode: node === undefined, preset=', opt.preset );
                        node = opt.preset;
                    }

                    return node;
                }
            },

            pathFind: {
                value: function( opt ) {
                    // console.log('pathFind');

                    var self = this;

                    opt = opt || {};

                    opt.limit = opt.limit || -1;
                    opt.index = opt.index || 0;
                    opt.level = 0;

                    var obj = new Path( opt );

                    $$.defineEvent( obj );

                    if ( isFunction( opt.success ) ) {
                        obj.eventListener({
                            action: 'success',
                            self: self,
                            listen: opt.success
                        });
                    }

                    if ( isFunction( opt.complete ) ) {
                        obj.eventListener({
                            action: 'complete',
                            self: self,
                            listen: opt.complete
                        });
                    }

                    utilTick( self, parsePath, obj );

                    return self;
                }
            },

            pathExists: {
                value: function( path ) {
                    return this.pathNode({ path: path }) !== undefined;
                }
            }
        });

    };


}(Crisp));
