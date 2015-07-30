
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
    var isType          = $$.isType;
    

    var Break = $$.ns('util.control.Break');
    var End = $$.ns('util.control.End');


    /**
     * Regular Expresion to find /\"/g 
     * @private
     * @type {RegExp}
     *
     * @memberOf util.path
     */
    var regDoubleQuote = /\\"/g;
    
    /**
     * Regular Expresion to find /\'/g 
     * @private
     * @type {RegExp}
     *
     * @memberOf util.path
     */
    var regSingleQuote = /\\'/g;


    /**
     * @namespace util.path.pathOperator
     */
    var pathOperator = {
        /**
         * @function util.path.pathOperator.'>'
         * @private
         * 
         * @param  {*} val0 Value a
         * @param  {*} val1 Value b
         * 
         * @return {external:Boolean}
         */
        '>': function( val0, val1 ) {
            return val0 > val1;
        },
        
        /**
         * @function util.path.pathOperator.'<'
         * @private
         * 
         * @param  {*} val0 Value a
         * @param  {*} val1 Value b
         * 
         * @return {external:Boolean}
         */
        '<': function( val0, val1 ) {
            return val0 < val1;
        },
        
        /**
         * @function util.path.pathOperator.'>='
         * @private
         * 
         * @param  {*} val0 Value a
         * @param  {*} val1 Value b
         * 
         * @return {external:Boolean}
         */
        '>=': function( val0, val1 ) {
            return val0 >= val1;
        },

        /**
         * @function util.path.pathOperator.'<='
         * @private
         * 
         * @param  {*} val0 Value a
         * @param  {*} val1 Value b
         * 
         * @return {external:Boolean}
         */
        '<=': function( val0, val1 ) {
            return val0 <= val1;
        },

        /**
         * @function util.path.pathOperator.'=='
         * @private
         * 
         * @param  {*} val0 Value a
         * @param  {*} val1 Value b
         * 
         * @return {external:Boolean}
         */
        '==': function( val0, val1 ) {
            return val0 === val1;
        },

        /**
         * @function util.path.pathOperator.'!='
         * @private
         * 
         * @param  {*} val0 Value a
         * @param  {*} val1 Value b
         * 
         * @return {external:Boolean}
         */
        '!=': function( val0, val1 ) {
            return val0 !== val1;
        }
    };


    /**
     * @namespace util.path.pathFind
     */
    var pathFind = {

        /**
         * @function util.path.pathFind.'*'
         * @private
         * 
         * @param  {*} node
         */
        '*': function( node ) {
            node.xEach({
                self: this,
                success: function( item ) {
                    nextTick.call( this, item );
                }
            });
        },

        /**
         * @function util.path.pathFind.'+'
         * @private
         * 
         * @param  {*} node
         */
        '+': function( node ) {
            // console.log('pathFind.#', node.docPath(), testSpecific );
            
            if ( this.child ) {
                this._specific = this.child.filter;
            }

            if ( !execValue( this.specific(), node ) ) {
                return;
            }

            this.child.exec( node );
        },

        /**
         * @function util.path.pathFind.'#'
         * @private
         * 
         * @param  {*} node
         */
        '#': function( node ) {
            var specific = this.specific();
            var testSpecific = specific ? execValue( specific, node ) : true;
            // console.log('pathFind.#', node.docPath(), testSpecific );

            if ( !testSpecific ) {
                // console.log('pathFind.#.isField');
                return;
            }

            this.child.exec( node );

            // if ( node.isField() ) {
            if ( !isType( node.xEach, 'Function' ) ) {
                // console.log('pathFind.#.isField');
                return;
            }

            // if ( node.docNotuse() ) {
            //  return;
            // }

            node.xEach({
                self: this,
                success: function( item ) {
                    // console.log('\x1B[31mpathFind.#.xEach', item.docPath(), '\x1B[39m' );

                    pathFind['#'].call( this, item );
                }
            });
        }
        
    };


    /**
     * check of fn is a function
     * 
     * @private
     * @param  {*} fn
     * @return {external:Boolean}
     *
     * @memberOf util.path
     */
    function isFunction( fn ) {
        return isType( fn, 'Function' );
    }


    /**
     * reverse given node
     * 
     * @private
     * @param  {external:Number} reverse
     * @param  {*}               node
     * @return {external:Boolean}
     *
     * @memberOf util.path
     */
    function execReverse( reverse, node ) {
        var i=0;

        for (; i<reverse; i+=1 ) {
            // console.log('execReverse:', typeof node, node );
            node = (node==='false' || node===false) ? true : !node;
        }

        return node;
    }


    /**
     * @private
     * @param  {*}               ref
     * @param  {*}               node
     * @return {*}
     *
     * @memberOf util.path
     */
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


    /**
     * @private
     * @type {external:String}
     *
     * @memberOf util.path
     */
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
    

    /**
     * @private
     * @type {external:RegExp}
     *
     * @memberOf util.path
     */
    var regCondition = new RegExp( strCondition, 'g' );
    // console.log( strCondition );

    var countContition = 0;


    /**
     * @private
     * @param  {*} parent
     * @return {util.path.PathConditionGroup}
     */
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


    /**
     * @private
     * @param  {*} item
     * @return {*}
     */
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


    /**
     * @class
     * @private
     * @param {*} reason
     * @param {*} parent
     *
     * @memberOf util.path
     */
    function PathConditionGroup( reason, parent ) {
        if ( !parent ) {
            this._reason = reason;
        }

        // this._parent = parent;
        Object.defineProperty( this, '_parent', { value: parent });
        this.condition = [];
    }

    PathConditionGroup.prototype = {

        /**
         * @param  {external:String} name
         * @return {*}
         */
        parent: function( name ) {
            if ( name ) {
                return this._parent && isFunction( this._parent[ name ] ) && this._parent[ name ]();
            }
            else {
                return this._parent;
            }
        },

        /**
         * @return {*}
         */
        reason: function() {
            return this._reason || this.parent('reason');
        },

        /**
         * @return {*}
         */
        specific: function() {
            return this._specific || this.parent('specific');
        },

        /**
         * @param  {external:Boolean} include
         * @return {util.path.PathCondition}
         */
        add: function( include ) {
            var condition = new PathCondition( this );
            if ( include ) {
                this.condition.push( condition );
            }
            return condition;
        },

        /**
         * @param  {external:String} node
         * @return {*}
         */
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


    /**
     * @class
     * @private
     * @param {*} parent
     *
     * @memberOf util.path
     */
    function PathCondition( parent ) {
        // this._parent = parent;
        Object.defineProperty( this, '_parent', { value: parent });
    }

    PathCondition.prototype = {

        /**
         * @param  {external:String} name
         * @return {*}
         */
        parent: function( name ) {
            if ( name ) {
                return this._parent && isFunction( this._parent[ name ] ) && this._parent[ name ]();
            }
            else {
                return this._parent;
            }
        },

        /**
         * @return {*}
         */
        reason: function() {
            return this._reason || this.parent('reason');
        },

        /**
         * @return {*}
         */
        specific: function() {
            return this._specific || this.parent('specific');
        },

        /**
         * @return {util.path.PathCondition}
         */
        parse: function() {
            this.child = findPathDoc.call( this.reason(), this );
            return this;
        },

        /**
         * @param  {*} node
         * @return {*}
         */
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

                child = pathOperator[ this.operator() ]( child, value );
                // console.log('-- operator:', this.operator(), child, value );
            }
            
            this.reason().eventTrigger({
                action: 'success',
                args: child
            });
        },

        /**
         * @return {*}
         */
        reverse: function() {
            return this._reverse || 0;
        },

        /**
         * @return {*}
         */
        operator: function() {
            return this._operator || 0;
        },

        /**
         * @param {*} next
         * @return {*}
         */
        next: function( next ) {
            return next ? this._next === next : this._next;
        }
    };


    /**
     * @private
     * @type {external:String}
     */
    var strPathDoc = '\\s*(?:' +
                '(\\.)' +                                   // [1] Parent Doc
        '|' +   '(?:(-?[0-9]+)~([0-9]+)|(-[0-9]+))\\.?' +   // [2] Limit items
        '|' +    '([0-9]+|[a-z][a-z0-9\\-]*)\\.?' +         // [5] Doc Attribute-Name
        '|' +    '([*#+])\\.?' +                            // [6] Value Node
        '|' +    '\\$([a-z0-9_]+)\\.?' +                    // [7] Repeat
        '|' +    '(:)' +                                    // [8] findFunction
        '|' +    '(\\[|\\()' +                              // [9] findCondition
        '|' +    '.+' +                                     //     END of findDoc
    ')\\s*';
    
    /**
     * @private
     * @type {external:RegExp}
     */
    var regPathDoc = new RegExp( strPathDoc, 'g' );

    /**
     * @private
     * @param  {*} parent
     * @return {util.path.PathParent|util.path.PathDoc|util.path.PathRepeat|util.path.PathFilter}
     *
     * @memberOf util.path
     */
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
        // (?:(-[0-9]+)|(-?[0-9]+)~([0-9]+))\\.?
        else if ( score[2] !== undefined || score[4] !== undefined ) {
            obj = new PathLimit( parent, ( score[2] || score[4] ), score[3] ).parse();
        }
        // [0-9]+|[a-z][a-z0-9\\-]*
        else if ( score[5] !== undefined ) {
            obj = new PathDoc( parent, score[5] ).parse();
        }
        // [*#+]
        else if ( score[6] !== undefined ) {
            obj = new PathRepeat( parent, score[6] ).parse();
        }
        // \\$([a-z0-9_]+)\\.?
        else if ( score[7] !== undefined ) {
            obj = new PathDoc( parent, this.valueKey( score[7] ) ).parse();
        }
        // :
        else if ( score[8] !== undefined ) {
            obj = findPathFunction.call( this, parent );
        }
        // \\[|\\(
        else if ( score[9] !== undefined ) {
            obj = new PathFilter( parent ).parse();
        }
        else {
            this.index = score.index;
            return;
        }

        return obj;
    }


    /**
     * @class
     * @private
     * @param {*} parent
     *
     * @memberOf util.path
     */
    function PathFilter( parent ) {
        // this._parent = parent;
        Object.defineProperty( this, '_parent', { value: parent });
    }

    PathFilter.prototype = {
        /**
         * @return {*}
         */
        parent: function( fn ) {
            if ( fn ) {
                return this._parent && isFunction( this._parent[ fn ] ) && this._parent[ fn ]();
            }
            else {
                return this._parent;
            }
        },

        /**
         * @return {*}
         */
        reason: function() {
            return this._reason || this.parent('reason');
        },

        /**
         * @return {*}
         */
        specific: function() {
            return this._specific || this.parent('specific');
        },

        /**
         * @return {*}
         */
        parse: function() {
            this.filter = findPathCondition.call( this.reason(), this );
            this.child = findPathDoc.call( this.reason(), this );
            return this;
        },

        /**
         * @return {*}
         */
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


    /**
     * @class
     * @private
     * @param {*} parent
     *
     * @memberOf util.path
     */
    function PathLimit( parent, start, limit ) {
        // this._parent = parent;
        Object.defineProperty( this, '_parent', { value: parent });

        // this._start = 0;
        // this._limit = 2;

        this._start = Number(start);
        this._limit = limit && Math.abs(limit);
    }

    PathLimit.prototype = {
        /**
         * @return {*}
         */
        parent: function( fn ) {
            if ( fn ) {
                return this._parent && isFunction( this._parent[ fn ] ) && this._parent[ fn ]();
            }
            else {
                return this._parent;
            }
        },

        /**
         * @return {*}
         */
        reason: function() {
            return this._reason || this.parent('reason');
        },

        /**
         * @return {*}
         */
        specific: function() {
            return this._specific || this.parent('specific');
        },

        /**
         * @return {*}
         */
        parse: function() {
            this.child = findPathDoc.call( this.reason(), this );
            return this;
        },

        /**
         * @return {*}
         */
        exec: function( node ) {
            node.xEach({
                self: this,
                start: this._start,
                limit: this._limit,
                success: function( item ) {
                    nextTick.call( this, item );
                }
            });
        }
    };


    /**
     * @class
     * @private
     * @param {*} parent
     *
     * @memberOf util.path
     */
    function PathParent( parent ) {
        // this._parent = parent;
        Object.defineProperty( this, '_parent', { value: parent });
    }

    PathParent.prototype = {
        /**
         * @return {*}
         */
        parent: function( fn ) {
            if ( fn ) {
                return this._parent && isFunction( this._parent[ fn ] ) && this._parent[ fn ]();
            }
            else {
                return this._parent;
            }
        },

        /**
         * @return {*}
         */
        reason: function() {
            return this._reason || this.parent('reason');
        },

        /**
         * @return {*}
         */
        specific: function() {
            return this._specific || this.parent('specific');
        },

        /**
         * @return {*}
         */
        parse: function() {
            this.child = findPathDoc.call( this.reason(), this );
            return this;
        },

        /**
         * @return {*}
         */
        exec: function( node ) {
            // console.log('PathParent.exec' );
            nextTick.call( this, node.__parent__ );
        }
    };


    /**
     * @todo  expand with eachLimit
     */

    /**
     * @class
     * @private
     * @param {*} reason
     * @param {external:String} attr
     *
     * @memberOf util.path
     */
    function PathDoc( reason, attr ) {
        // this._ = reason;
        Object.defineProperty( this, '_parent', { value: reason });
        this._attr = attr;
    }

    PathDoc.prototype = {
        /**
         * @return {*}
         */
        parent: function( fn ) {
            if ( fn ) {
                return this._parent && isFunction( this._parent[ fn ] ) && this._parent[ fn ]();
            }
            else {
                return this._parent;
            }
        },

        /**
         * @return {*}
         */
        reason: function() {
            return this._reason || this.parent('reason');
        },

        /**
         * @return {*}
         */
        specific: function() {
            return this._specific || this.parent('specific');
        },

        /**
         * @return {*}
         */
        parse: function() {
            // console.log('PathDoc.parse child:', this.child );
            this.child = findPathDoc.call( this.reason(), this );
            return this;
        },

        /**
         * @return {*}
         */
        exec: function( node ) {
            // console.log('PathDoc.exec', this.attr() );
            
            if ( !node[ this.attr() ] ) {
                return;
            }

            node = node[ this.attr() ];

            nextTick.call( this, node );
        },

        /**
         * @return {*}
         */
        attr: function() {
            return this._attr;
        }
    };



    /**
     * @class
     * @private
     * @param {*} parent
     * @param {*} type
     *
     * @memberOf util.path
     */
    function PathRepeat( parent, type ) {
        // this._parent = parent;
        Object.defineProperty( this, '_parent', { value: parent });
        this._type = type;
    }

    PathRepeat.prototype = {
        /**
         * @return {*}
         */
        parent: function( fn ) {
            if ( fn ) {
                return this._parent && isFunction( this._parent[ fn ] ) && this._parent[ fn ]();
            }
            else {
                return this._parent;
            }
        },

        /**
         * @return {*}
         */
        reason: function() {
            return this._reason || this.parent('reason');
        },

        /**
         * @return {*}
         */
        specific: function() {
            return this._specific || this.parent('specific');
        },

        /**
         * @return {*}
         */
        parse: function() {
            this.child = findPathDoc.call( this.reason(), this );
            return this;
        },

        /**
         * @return {*}
         */
        exec: function( node ) {
            // console.log('PathRepeat.exec', this.type(), node );
            pathFind[ this.type() ].call( this, node );
        },

        /**
         * @return {*}
         */
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


    /**
     * @class
     * @private
     * @param {*} parent
     * @param {*} name
     *
     * @memberOf util.path
     */
    function PathFunction( parent, name ) {
        // this._parent = parent;
        Object.defineProperty( this, '_parent', { value: parent });
        this._name = name;
        // this._name = name || 'toString';
    }

    PathFunction.prototype = {
        /**
         * @return {*}
         */
        parent: function( fn ) {
            if ( fn ) {
                return this._parent && isFunction( this._parent[ fn ] ) && this._parent[ fn ]();
            }
            else {
                return this._parent;
            }
        },

        /**
         * @return {*}
         */
        reason: function() {
            return this._reason || this.parent('reason');
        },

        /**
         * @return {*}
         */
        specific: function() {
            return this._specific || this.parent('specific');
        },

        /**
         * @return {*}
         */
        parse: function() {
            this.child = findPathFunction.call( this.reason(), this );
            return this;
        },

        /**
         * @return {*}
         */
        exec: function( node ) {
            // console.log('PathFunction.exec', this.name() );

            if ( !isFunction( node[ this.name() ] ) ) {
                throw new Error('PathFunction ' + this.name() + ' is not defined!');
            }

            node = node[ this.name() ].apply( node, this.args() );

            nextTick.call( this, node );
        },

        /**
         * @return {*}
         */
        name: function() {
            return this._name || 'toString';
        },

        /**
         * @return {*}
         */
        args: function() {
            return this._args;
        }
    };



    /**
     * @class
     * @private
     * @param {*} parent
     * @param {*} value
     *
     * @memberOf util.path
     */
    function PathValue( parent, value ) {
        // this._parent = parent;
        Object.defineProperty( this, '_parent', { value: parent });
        this._value = value;
    }

    PathValue.prototype = {
        /**
         * @return {*}
         */
        parent: function( fn ) {
            if ( fn ) {
                return this._parent && isFunction( this._parent[ fn ] ) && this._parent[ fn ]();
            }
            else {
                return this._parent;
            }
        },

        /**
         * @return {*}
         */
        reason: function() {
            return this._reason || this.parent('reason');
        },

        /**
         * @return {*}
         */
        specific: function() {
            return this._specific || this.parent('specific');
        },

        /**
         * @return {*}
         */
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



    /**
     * @class
     * @private
     * @param {*} option
     *
     * @memberOf util.path
     */
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
        /**
         * @return {*}
         */
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
         * OpenCrisp module of PathJS allows to navigate in JavaScript objects
         * 
         * @module PathJS
         * 
         * @tutorial  {@link http://opencrisp.wca.at/tutorials/PathJS_test.html}
         * 
         */

        Object.defineProperties( moduleObject, {

            /**
             * @function
             * @memberOf module:PathJS
             */
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
                        node = e.data;
                    };

                    self.pathFind( opt );

                    if ( node === undefined ) {
                        node = opt.preset;
                    }

                    return node;
                }
            },

            /**
             * @function
             * @memberOf module:PathJS
             */
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

            /**
             * @function
             * @memberOf module:PathJS
             */
            pathExists: {
                value: function( path ) {
                    return this.pathNode({ path: path }) !== undefined;
                }
            }
        });

    };


}(Crisp));
