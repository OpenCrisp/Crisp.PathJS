
/**
 * PathJS Crisp functions
 * @namespace util.path
 * 
 * @tutorial {@link http://opencrisp.wca.at/tutorials/PathJS_test.html|use PathJS}
 * 
 * @see  define with {@link module:BaseJS.definePath}
 * 
 * @example <caption>inherit namespace with {@link module:CreateJS}</caption>
 * var myObject = Crisp.utilCreate({
 *     ns: 'util.path'
 * }).objIni().objData({
 *     a: {
 *         b: 'B',
 *         c: 'C'
 *     }
 * });
 * 
 * myObject.pathFind({
 *     path: 'a.*:',
 *     success: function( e ) {
 *         console.log('success:', e );
 *     },
 *     complete: function( e ) {
 *         console.log('complete:', e );
 *     }
 * });
 * // logs:
 * // success: B
 * // success: C
 * // complete: [ { data: 'B' }, { data: 'C' } ]
 * 
 */

(function($$) {

    console.log( (function ( _ ) {

        function printFill( str, m, fill ) {
            fill = fill || ' ';
            str = ''.concat(str);
            for ( var i = str.length; i<m; i+=1 ) {
             str += fill;
            }
            return str;
        }

        _.view = function ( self, name, set ) {
            // return;
            // console.warn(self);
            var level;
            
            if ( set === 1 ) {
                self._level = self.reason().level = self.reason().level + 1;
            }
            
            level = 4 * self._level;
            
            var str = printFill( '', level ) + name;

            if ( !set ) {
                self.reason().level = self._level - 1;
            }

            // str = printFill( str, 200, '-');

            if (1) {
                return;
            }
            _.log( str );
        };

        return "set: console.view()";
    })( console ));

    var utilTick      = $$.utilTick;
    var type          = $$.type;
    

    var Break = $$.ns('util.control.Break');
    var End = $$.ns('util.control.End');

    function BreakPath() {}
    function EndPath() {}
    // function EndPicker() {}



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


    // var PICK_COMPLETE = true;


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


    function pathFindEach( node, events, success ) {
        // console.log('type of each', type.call( node.itemEach ) );
        var fn = type.call( node.itemEach, 'Function' ) ? node.itemEach : node.xEach;
        var self = this;

        success = success || function ( doc ) {
            nextTick.call( this, doc, null, events );
        };

        fn.callback.call(
            node,
            {   
                self: this,
                reverse: this._revlist
            },
            function () {
                success.apply( self, arguments );
            }
            // success
        );
    }

    function pathFindEachAll( node, events ) {
        if ( this.child ) {
            this.child.exec({ node: node }, events );
        }
        else {
            console.log('node', node );
            console.log( this );
        }

        if ( !type.call( node, 'Array' ) && !type.call( node, 'Object' ) ) {
            return;
        }

        if ( node.isField && node.isField() ) {
            return;
        }

        pathFindEach.call( this, node, events, function( item ) {
            pathFind['#'].call( this, item, events );
        });
    }

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
        // '*': pathFindEach,
        '*': function( node, events ) {
            var specific = this.specific();

            pathFindEach.call( this, node, events, function (item) {
                
                if ( specific ) {
                    try {
                        pickValue.call(
                            this,
                            specific,
                            item,
                            function ( valueNode ) {
                                // console.log(' spec', valueNode );
                                if ( valueNode ) {
                                    this.child.exec({ node: item }, events );
                                }
                                else {
                                    // console.log('* BreakPath')
                                    throw new BreakPath();
                                }
                            },
                            End
                        );
                    }
                    catch (err) {
                        if (err instanceof BreakPath) {
                            throw new Break();
                        }
                    }
                }
                else {
                    this.child.exec({ node: item }, events );
                }
            });

        },

        /**
         * @function util.path.pathFind.'+'
         * @private
         * 
         * @param  {*} node
         */
        '+': function( node, events ) {
            // console.log('pathFind.#', node.docPath(), testSpecific );

            if ( this.child ) {
                this._specific = this.child.filter;
            }

            nextTick.call( this.child, node, null, events );
        },

        /**
         * @function util.path.pathFind.'#'
         * @private
         * 
         * @param  {*} node
         */
        '#': function( node, events ) {
            var specific = this.specific();
            // console.log('#', this );

            if ( specific ) {
                pickValue.call(
                    this,
                    specific,
                    node,
                    function ( valueNode ) {
                        // console.log(' spec', valueNode );
                        if ( valueNode ) {
                            pathFindEachAll.call( this, node, events );
                        }
                    },
                    End
                );
            }
            else {
                pathFindEachAll.call( this, node, events );
            }

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
        return type.call( fn, 'Function' );
    }


    /**
     * @private
     * @param  {*}               ref
     * @param  {*}               node
     * @return {*}
     *
     * @memberOf util.path
     */
    function pickValue( ref, node, success, complete ) {

        if ( !ref ) {
            console.error('pickValue !ref return');
            return;
        }

        var events = {};
        $$.defineEvent( events );

        events.eventListener({
            // limit: 1,
            self: this,
            action: 'success',
            listen: success
        });

        events.eventListener({
            self: this,
            action: 'complete',
            listen: complete
        });

        ref.exec({ node: node }, events );
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

        '|' +   '(-?\\d+(?:\\.\\d+)?)(?![\\.:~\\d])' +                      // [6] Number
        '|' +   '(true|false)' +                                            // [7] Boolean String
        '|' +   '"((?:[^"\\\\]*|\\\\"|\\\\)*)"' +                           // [8] DoubleQuotet String
        '|' +   "'((?:[^'\\\\]*|\\\\'|\\\\)*)'" +                           // [9] SingleQuotet String
        '|' +   '\\/((?:[^\\/\\\\]*|\\\\\\/|\\\\)+)\\/([igm]{1,3})?' +      // [10] RegExp inclusive Flags
        '|' +   '\\$([\\w]+)\\s?(?![\\w\\.:])' +                            // [11] varName for includet values
        
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
        // this.level += 1;

        regCondition.lastIndex = this._index;

        for (; !stop && ( score = regCondition.exec( this._path ) ); ) {
            this._index = regCondition.lastIndex;
            countContition += 1;

            // console.log('findPathCondition', score.xTo() );
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
            // (\\d+(?:\\.\\d+)?)(?!\\.|:)
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
                condition.child = new PathValue( condition, this._values, score[12] );
            }
            else {
                this._index = score.index;
                condition.parse();
            }

            regCondition.lastIndex = this._index;

            // if ( countContition > 20 ) {
            //  throw new Error();
            // }
        }

        // this.level -= 1;
        // print( this, 'findPathCondition END' );

        return conditionGroup;
    }


    /**
     * @class
     * @private
     * @memberOf util.path
     */
    function PathBaseProto() {}

    PathBaseProto.prototype = {

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
            if ( this._specific === null ) {
                return;
            }

            return this._specific || this.parent('specific');
        }

    };



    /**
     * @class
                    //     complete.call( this );
                    // }
                    // else {
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

        this._parent = parent;
        // Object.defineProperty( this, '_parent', { value: parent });
        this.condition = [];
    }

    var pathConditionGroupProto = PathConditionGroup.prototype = new PathBaseProto();

    /**
     * @param  {external:Boolean} include
     * @return {util.path.PathCondition}
     */
    pathConditionGroupProto.add = function( include ) {
        var condition = new PathCondition( this );
        if ( include ) {
            this.condition.push( condition );
        }
        return condition;
    };

    /**
     * @private
     * @param  {*} item
     * @return {*}
     */
    

    /**
     * @param  {external:String} node
     * @return {*}
     */
    // pathConditionGroupProto.exec = Crisp.utilPick( function ( option, success ) {
    pathConditionGroupProto.exec = function ( option, events ) {
        // console.log('pathConditionGroupProto.exec');
        console.view( this, '(', 1 );
        // console.log(this.condition);

        var picker = events.eventPicker({
            cache: events,
            action: 'complete',
            empty: true
        });
        
        this.condition.xEach(
            {
                self: this
            },
            function conditionGroupExecSuccess( item ) {
                // console.log('PathConditionGroup.exec', this.node.xTo() );
                
                picker.Wait();

                if ( item.next('&') ) {
                    // console.log('== next &&&&&&&&&&&&');

                    pickValue.call(
                        this,
                        item,
                        option.node,
                        function ( valueNode ) {
                            // valuePicker.Talk();

                            if ( !valueNode ) {
                                picker.Talk();
                                throw new End();
                            }
                        },
                        function () {
                            picker.Talk();
                        }
                    );

                    return;
                }
                else if ( item.next('|') ) {
                    // console.log('== next |||||||||||||');
                    console.view( this, '|', 2 );

                    pickValue.call(
                        this,
                        item,
                        option.node,
                        function ( valueNode ) {
                            // console.log('.. ', valueNode, (picker === valuePicker) );
                            // console.log('--', valueNode );
                            if ( valueNode ) {
                                nextTick.call( this, valueNode, picker, events );
                                picker.Talk();
                                throw new End();
                            }
                        },
                        function () {
                            picker.Talk();
                        }
                    );

                    return;
                }

                item.exec({ node: option.node }, events );
                picker.Talk();
            },
            function () {
                // console.warn('pathConditionGroupProto.exec complete')
                console.view( arguments[0].self, ')' );
                picker.Talk();
            }
        );
    };


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
    


    function pickReverseEach( reverse, node, callback ) {
        var test = type.call( node, 'Undefined' ) ||
            node==='false' ||
            node===false ||
            (
                type.call( node, 'Boolean' ) && 
                !node.valueOf()
            );

        if ( test ) {
            pickReverse.call( this, reverse, true, callback );
        }
        else if ( type.call( node.isBoolean, 'Function' ) ) {
            if ( node.isBoolean.tick ) {

            }
            else {
                pickReverse.call( this, reverse, ( ( node.isBoolean() && !node.valueOf() ) || !node ), callback );
            }
        }
        else {
            pickReverse.call( this, reverse, !node, callback );
        }
    }


    function pickReverse( reverse, node, callback ) {
        // console.error('pickReverse', reverse);

        if ( reverse > 0 ) {
            reverse = reverse - 1;
            pickReverseEach.apply( this, arguments );
        }
        else {
            callback.call( this, node );
        }
    }


    function pickOperator( operator, nodeFirst, nodeSecond, success, complete ) {
        if ( !operator ) {
            success.call( this, nodeFirst );
            complete.call( this );
            console.view( this, 'no operator', 2 );
            return;
        }

        // console.view( this, operator, 2 );
        // console.warn( nodeFirst );

        pickValue.call(
            this,
            this.value,
            nodeSecond,
            function ( valueNode ) {

                if ( valueNode instanceof RegExp ) {
                    nodeFirst = valueNode.test( nodeFirst );
                    valueNode = true;
                }

                nodeFirst = pathOperator[ operator ]( nodeFirst, valueNode );

                // console.warn('-- operator:', operator, nodeFirst, valueNode );
                success.call( this, nodeFirst );
            },
            complete
        );
        
        // console.view( this, operator );

    }


    /**
     * @class
     * @private
     * @param {*} parent
     *
     * @memberOf util.path
     */
    function PathCondition( parent ) {
        this._parent = parent;
        // Object.defineProperty( this, '_parent', { value: parent });
    }

    var pathConditionProto = PathCondition.prototype = new PathBaseProto();

    /**
     * @return {util.path.PathCondition}
     */
    pathConditionProto.parse = function() {
        this.child = findPathDoc.call( this.reason(), this );
        return this;
    };

    /**
     * @param  {*} node
     * @return {*}
     */
    pathConditionProto.exec = function ( option, events )  {
        // console.log('pathConditionProto.exec', option.node.xTo(), ( !this.reverse() && !this.operator() ) );
        console.view( this, '>', 1 );

        var picker = events.eventPicker({
            cache: events,
            action: 'complete',
            empty: true
        });
        
        if ( !this.reverse() && !this.operator() ) {
            // callback.call( this, option.node );
            // console.log('no reverse|operator');
            nextTick.call( this, option.node, picker, events );
            picker.Talk();
            console.view( this, '< simple' );
            return;
        }

        // child = execValue( this.child, option.node );
        // console.log('start', option.node );
        pickValue.call(
            this,
            this.child,
            option.node,
            function ( valueNode ) {
                // console.log('valueNode', valueNode );
                pickReverse.call(
                    this,
                    this.reverse(),
                    valueNode,
                    function ( reverseNode ) {
                        // console.log('reverseNode', reverseNode );
                        picker.Wait();
                        pickOperator.call(
                            this,
                            this.operator(),
                            reverseNode,
                            option.node,
                            function ( operatorNode ) {
                                // console.log('operatorNode', operatorNode );
                                events.eventTrigger({
                                    action: 'success',
                                    args: operatorNode
                                });
                            },
                            function () {
                                picker.Talk();
                            }
                        );
                    }
                );
            },
            function () {
                picker.Talk();
                console.view( this, '<' );
            }
        );
    };


    /**
     * @return {*}
     */
    pathConditionProto.reverse = function() {
        return this._reverse || 0;
    };

    /**
     * @return {*}
     */
    pathConditionProto.operator = function() {
        return this._operator || 0;
    };

    /**
     * @param {*} next
     * @return {*}
     */
    pathConditionProto.next = function( next ) {
        return next ? this._next === next : this._next;
    };


    /**
     * @private
     * @type {external:String}
     */
    var strPathDoc = '\\s*(?:' +
                '(\\.)' +                                  // [1]   Parent Doc
        '|' +   '(\\^)?(-?\\d*~\\d*|-\\d+)\\.?' +          // [2,3] Limit items
        '|' +   '(\\d+|[a-z_][a-z\\d\\-_]*)\\.?' +           // [4]   Doc Attribute-Name
        '|' +   '(\\^)?([*#+])\\.?' +                      // [5,6] Value Node
        '|' +   '\\$([a-z\\d_]+)\\.?' +                    // [7]   Repeat
        '|' +   '(:)' +                                    // [8]   findFunction
        '|' +   '(\\[|\\()' +                              // [9]   findCondition
        '|' +   '.+' +                                     //       END of findDoc
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

        regPathDoc.lastIndex = this._index;
        var score = regPathDoc.exec( this._path );

        if ( !score ) {
            // console.warn('findPathDoc');
            return new PathDoc( parent );
        }

        this._index = regPathDoc.lastIndex;

        // console.log( 'findPathDoc', score.xTo() );
        // print( this, 'findPathDoc', score );

        // (\\.)
        if ( score[1] !== undefined ) {
            obj = new PathParent( parent ).parse();
        }
        // (\\^)?(-?\\d*~\\d*|-\\d+)\\.?
        else if ( score[3] !== undefined ) {
            obj = new PathLimit( parent, score[3] ).parse();
            obj._revlist = score[2];
        }
        // (\\d+|[a-z][a-z\\d\\-]*)\\.?
        else if ( score[4] !== undefined ) {
            obj = new PathDoc( parent, score[4] ).parse();
        }
        // (\\^)?([*#+])\\.?
        else if ( score[6] !== undefined ) {
            obj = new PathRepeat( parent, score[6] ).parse();
            obj._revlist = score[5];
        }
        // \\$([a-z\\d_]+)\\.?
        else if ( score[7] !== undefined ) {
            // console.log('PathDoc:', score[7] );
            obj = new PathDoc( parent, this.valueKey( score[7] ) ).parse();
            // obj = new PathDoc( parent ).parse();
            obj._valkey = score[7];
            // obj._values = this._values;
        }
        // (:)
        else if ( score[8] !== undefined ) {
            obj = findPathFunction.call( this, parent );
        }
        // (\\[|\\()
        else if ( score[9] !== undefined ) {
            obj = new PathFilter( parent ).parse();
        }
        else {
            this._index = score.index;
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
        this._parent = parent;
        // Object.defineProperty( this, '_parent', { value: parent });
    }

    var pathFilterProto = PathFilter.prototype = new PathBaseProto();

    /**
     * @return {*}
     */
    pathFilterProto.parse = function() {
        this.filter = findPathCondition.call( this.reason(), this );
        this.child = findPathDoc.call( this.reason(), this );
        return this;
    };

    /**
     * @return {*}
     */
    // var filterCount = 0;
    pathFilterProto.exec = function ( option, events ) {
        // console.log('PathFilter.exec', option.node );
        var node = option.node;
        // var filter = filterCount = filterCount + 1;
        console.view( this, '[', 1 );

        // console.log('PathFilter.exec', !execValue( this.filter, node ) );
        // console.log('============== PathFilter.exec ============' );

        var picker = events.eventPicker({
            cache: events,
            action: 'complete',
            empty: true
        });

        // console.log('-- filter', node );

        var self = this;



        
        pickValue.call(
            this,
            this.filter,
            node,
            function ( valueNode ) {
                // console.log('filter', filter, valueNode );
                // node = valueNode;
                // console.log('pathFilterProto', filter, valueNode );
                if ( valueNode ) {
                    nextTick.call( self, node, picker, events );
                }
                // picker.Talk();
            },
            function () {
                console.view( this, ']' );
                // console.log('pathFilterProto', filter, node );
                // if ( node ) {
                //     nextTick.call( this, option.node, picker );
                // }
                picker.Talk();
            }
        );
    };


    var regPathLimit = /^(-?\d+)?~(\d+)?$/;

    /**
     * interface fore util.props
     * @param  {external:String} fn   uitl.props config function
     * @param  {external:Number}   conf [description]
     * @param  {external:Number}   alt  [description]
     * @return {external:Number}        [description]
     */
    // function configPropsTop( fn, conf, alt ) {
    //     try {
    //         return this._('config')[ fn ]( conf );
    //     }
    //     catch (e) {
    //         return conf || alt;
    //     }
    // }


    /**
     * @class
     * @private
     * @param {*} parent
     *
     * @memberOf util.path
     */
    // function PathLimit( parent, start, limit ) {
    function PathLimit( parent, conf ) {
        this._parent = parent;
        
        // console.log('PathLimit', conf );

        if ( regPathLimit.test( conf ) ) {
            conf = regPathLimit.exec( conf );

            this._start = conf[1];
            this._limit = conf[2];
        }
        else {
            this._start = conf;
        }
    }

    var pathLimitProto = PathLimit.prototype = new PathBaseProto();

    /**
     * @return {*}
     */
    pathLimitProto.parse = function() {
        this.child = findPathDoc.call( this.reason(), this );
        return this;
    };

    /**
     * @return {*}
     */
    pathLimitProto.exec = function( option, events ) {
        // console.log('== limit', option.node );
        console.view( this, '>~', 1 );

        var picker = events.eventPicker({
            cache: events,
            action: 'complete',
            empty: true
        });


        function success( item ) {
            // nextTick.call( this, item, null, events );
            var specific = this.specific();
            // // this._specific = null;

            // console.log('limit:', item );
            // // throw new Break();
            // // nextTick.call( this, item, null, events );
            // // return;

            if ( specific ) {
                // console.log( this );
                try {
                    pickValue.call(
                        this,
                        specific,
                        item,
                        function ( valueNode ) {
                            // console.log(' spec', valueNode, picker._wait, item );
                            if ( valueNode ) {
                                nextTick.call( this, item, null, events );
                            }
                            else {
                                throw new BreakPath();
                            }
                        },
                        function () {}
                    );
                }
                catch (err) {
                    if (err instanceof BreakPath) {
                        throw new Break();
                    }
                }

            }
            else {
                nextTick.call( this, item, null, events );
            }
        }

        var opt = {
            self: this,
            reverse: this._revlist
        };

        var fn;

        if ( type.call( option.node.itemLimit, 'Function' ) ) {
            opt.start = this._start;
            opt.limit = this._limit;

            // console.log('opt:', opt );

            // console.log('limit.exec itemLimit', opt );
            // option.node.itemLimit( opt, success, complete );
            fn = option.node.itemLimit;
        }
        else {
            opt.start = this._start || 0;
            opt.limit = this._limit || 10;

            // console.log('limit.exec xEach', opt );
            // option.node.xEach( opt, success, complete );
            fn = option.node.xEach;
        }

        fn.callback.call( option.node, opt, success );
        picker.Talk();
        
        console.view( this, '<~' );
    };
    

    /**
     * @class
     * @private
     * @param {*} parent
     *
     * @memberOf util.path
     */
    function PathParent( parent ) {
        this._parent = parent;
        // Object.defineProperty( this, '_parent', { value: parent });
    }

    var pathParentProto = PathParent.prototype = new PathBaseProto();

    /**
     * @return {*}
     */
    pathParentProto.parse = function() {
        this.child = findPathDoc.call( this.reason(), this );
        return this;
    };

    /**
     * @return {*}
     */
    pathParentProto.exec = function( option, events ) {
        // console.log('PathParent.exec' );
        console.view( this, '..', 1 );
        nextTick.call( this, option.node.__parent__, null, events );
    };


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

    var pathDocProto = PathDoc.prototype = new PathBaseProto();

    /**
     * @return {*}
     */
    pathDocProto.parse = function() {
        // console.log('PathDoc.parse child:', this.child );
        this.child = findPathDoc.call( this.reason(), this );
        return this;
    };

    /**
     * @return {*}
     */
    pathDocProto.exec = function( option, events ) {
        // console.log('PathDoc.exec', this.attr() );
        var self = this;

        var picker = events.eventPicker({
            cache: events,
            action: 'complete',
            empty: true
        });

        if ( type.call(option.node.itemFetch, 'Function') ) {
            return option.node.itemFetch(
                { name: self.attr() },
                function (doc) {
                    nextTick.call( self, doc, picker, events );
                },
                function () {
                    picker.Talk();
                }
            );
        }

        if (
                (
                    type.call(option.node, 'Object') && 
                    Object.keys(option.node).indexOf( self.attr() ) !== -1
                ) ||
                (
                    type.call(option.node, 'Array') && 
                    option.node[ self.attr() ]
                )
            ) {
            
            // console.log( self.attr(), option.node[ self.attr() ] );
            nextTick.call( self, option.node[ self.attr() ], picker, events );
            // picker.Talk();
            // return;
        }
        else if ( self._valkey ) {
            // console.log('value', self._values[ self._valkey ].is.toString() );  
            option.node = self.child.exec({ node: self.attr() }, events);
            // option.node = self.child.exec({ node: self._values[ self._valkey ] }, events);
        }
        else if ( !self.attr() ) {
            nextTick.call( self, option.node, picker, events );
        }
        
        picker.Talk();
    };

    /**
     * @return {*}
     */
    pathDocProto.attr = function() {
        return this._attr;
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
        this._parent = parent;
        // Object.defineProperty( this, '_parent', { value: parent });
        this._type = type;
    }

    var pathRepeatProto = PathRepeat.prototype = new PathBaseProto();

    /**
     * @return {*}
     */
    pathRepeatProto.parse = function() {
        this.child = findPathDoc.call( this.reason(), this );
        return this;
    };

    /**
     * @return {*}
     */
    pathRepeatProto.exec = function( option, events ) {
        // console.log('PathRepeat.exec', this.type(), option.node );
        console.view( this, '>' + this.type(), 1 );

        pathFind[ this.type() ].call( this, option.node, events );
        console.view( this, '<' + this.type() );
    };

    /**
     * @return {*}
     */
    pathRepeatProto.type = function() {
        return this._type;
    };




    var tplFunctionArgs = '(?:[^)\\\\]*|\\\\\\)|\\\\)+';
    var strFunction = '(?:(\\.)|(\\w+)(?:\\((' + tplFunctionArgs + ')\\))?\\.?)\\s*|.+';
    var regFunction = new RegExp( strFunction, 'g' );
    var reqFunctionEscape = /\\([\(\)])/g;

    function findPathFunction( parent ) {
        var score;
        var obj;

        if ( !(parent instanceof PathFunction) ) {
            obj = new PathFunction( parent );
        }

        // print( this, 'findPathFunction' );

        regFunction.lastIndex = this._index;
        score = regFunction.exec( this._path ); 
        
        if ( !score ) {
            return obj;
        }

        this._index = regFunction.lastIndex;
        // print( this, 'findPathFunction', score );

        if ( score[1] !== undefined ) {
            obj = new PathFunction( parent );
        }
        else if ( score[2] !== undefined ) {
            obj = new PathFunction( parent, score[2] );

            if ( score[3] && score[3].length > 0 ) {
                obj._args = JSON.parse('[' + score[3].replace( reqFunctionEscape, '$1' ) + ']');
            }
        }
        else {
            this._index = score.index;
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
        this._parent = parent;
        // Object.defineProperty( this, '_parent', { value: parent });
        this._name = name;
        // this._name = name || 'toString';
    }

    var pathFunctionProto = PathFunction.prototype = new PathBaseProto();

    /**
     * @return {*}
     */
    pathFunctionProto.parse = function() {
        this.child = findPathFunction.call( this.reason(), this );
        return this;
    };

    /**
     * @return {*}
     */
    pathFunctionProto.exec = function( option, events ) {
        // console.log('PathFunction.exec', this.name() );
        var opt, picker;
        var self = this;
        var fn = option.node[ this.name() ];

        if ( !isFunction( fn ) ) {
            // throw new Error('PathFunction ' + this.name() + ' is not defined!');
            return;
        }

        console.view( this, '>:' + this.name(), 1 );

        
        picker = events.eventPicker({
            cache: events,
            action: 'complete',
            empty: true
        });

        if ( !fn.tick ) {
            option.node = fn.apply( option.node, this.args() );
            // console.log('-- fn:', option.node );
            nextTick.call( this, option.node, picker, events );
            picker.Talk();
            console.view( this, '<:' + this.name() );
            return;
        }

        opt = $$.callSchema( fn.schema || fn.tick, this.args() );
        // console.log('pathFunctionProto');

        function successExec( doc ) {
            // console.log( self.name(), 'pathFunctionProto successExec', option.node);
            console.view( self, '- ' + option.node.xTo(), 2 );
            // console.log('successExec:', doc );
            nextTick.call( self, doc, picker, events );
        }
        
        function completeExec() {
            // console.log( self.name(), 'pathFunctionProto completeExec', option.node);
            console.view( self, '<::' + self.name() );
            picker.Talk();
        }
        
        fn.call( option.node, opt, successExec, completeExec, picker );
    };

    /**
     * @return {*}
     */
    pathFunctionProto.name = function() {
        return this._name || 'toString';
    };

    /**
     * @return {*}
     */
    pathFunctionProto.args = function() {
        return [].xAdd( this._args );
    };



    /**
     * @class
     * @private
     * @param {*} parent
     * @param {*} value
     *
     * @memberOf util.path
     */
    function PathValue( parent, value, key ) {
        this._parent = parent;
        // Object.defineProperty( this, '_parent', { value: parent });
        this._value = value;
        this._key = key;
    }

    var pathValueProto = PathValue.prototype = new PathBaseProto();

    /**
     * @return {*}
     */
    pathValueProto.exec = function( option, events ) {
        // console.log('PathValue.exec', this.name() );
        
        var picker = events.eventPicker({
            cache: events,
            action: 'complete',
            empty: true
        });

        var value = this._key ? this._value[ this._key ] : this._value;
        // console.log('pathValueProto', this._key, value );

        nextTick.call( this, value, picker, events );
        picker.Talk();
    };





    function nextTick( node, picker, events ) {
        var end;
        // console.log('nextTick:', node );

        if ( this.child ) {
            this.child.exec({ node: node }, events );
            return;
        }

        var reason = this.reason();

        // stop callback of success if ._start > 0
        if ( ( reason._count += 1 ) <= reason._start ) {
            return;
        }

        try {
            events.eventTrigger({
                action: 'success',
                // path: path,
                args: [ node ]
            });
        }
        catch (err) {
            if (err instanceof Break) {
                end = true;
            }
            else {
                throw err;
            }
        }

        // console.log('--- nextTick', reason._count, reason._limit );

        if ( end || ( reason._limit !== -1 && reason._count >= reason._limit ) ) {
            // console.log('nextTick.limit', reason._limit, picker.note.list.own );
            
            picker = events.eventPicker({
                cache: events,
                action: 'complete',
                empty: true
            });

            picker.End();
            throw new EndPath();
        }
    }






    function _parsePath( reason, events ) {
        // console.log('path:', reason.path );

        var condition = findPathCondition.call( reason );
        // console.log( JSON.stringify( condition ) );
        // console.log( JSON.stringify(condition,null,"\t") );
        // throw new Error();

        // return condition.exec( this );

        try {
            condition.exec({ node: this }, events );
        }
        catch (err) {
            // console.log('ERR _parsePath'  );

            if ( err instanceof EndPath ) {
                // console.log('EndPath');
                // console.error( err );
                return;
            }
            else if ( reason._preset !== undefined ) {
                
                events.eventTrigger({
                    action: 'success',
                    args: reason._preset
                });

                console.error( err );

                return;
            }
            // else if ( err instanceof Break ) {
            //     console.log('Break');
            //     return;
            // }
            else if ( err instanceof End ) {
                // console.log('_parsePath End');
                return;
            }
            console.log('other');

            throw err;
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
        this._path = option.path;
        this._values = option.values;
        this._preset = option.preset;
        this._limit = option.limit;
        this._start = option.start;
        this._async = option.async;
        
        this._count = 0;        // count of finde node for ._start
        this._index = 0;        // Zeichenposition für regexp
        // this.level = option.level;        // console log
        // this.filter = option.filter;       // delete

        // this._success = option.success;
        // this._complete = option.complete;
    }

    Path.prototype = {
        /**
         * @return {*}
         */
        valueKey: function( key ) {
            var val = this._values[ key ];

            if ( type.call(val, 'Function') ) {
                return val.call( this );
            }
            else {
                return val;
            }
        }, 
        rootSelf: function () {
            var note = this._values.self;

            while (note.__parent__) {
                note = note.__parent__;
            }

            return note;
        }
    };


    /**
     * _pathNode
     *
     * @deprecated use _pathFinde
     * @private
     * 
     * @param  {external:Object} option
     *
     * @this {this}
     * @return {*}
     *
     * @memberOf util.path
     *
     * @see  util.path#pathNode
     * @see  module:PathJS.pathNode
     *
     * @tutorial {@link http://opencrisp.wca.at/tutorials/PathJS_test.html#pathNode|use pathNode}
     * @tutorial {@link http://opencrisp.wca.at/tutorials/PathJS-path_test.html|more Examples}
     *
     * @example
     * myObject.pathNode('a:'); // 'A'
     */
    function _pathNode( option ) {
        var node;

        option = option || "";

        if ( option.xType('String') ) {
            option = { path: option };
        }

        option.limit = 1;
        option.async = false;
        option.success = function(e) {
            node = e;
        };

        this.pathFind( option );

        if ( type.call( node, 'Undefined' ) ) {
            if ( type.call( option.preset, 'Function' ) ) {
                node = option.preset.call( this );
            }
            else {
                node = option.preset;
            }
        }

        return node;
    }


    /**
     * _pathFind
     * @private
     * 
     * @param  {external:Object} option
     * @param {AnyItem} option.self alternate thisArg of callback
     *
     * @this {this}
     * @return {*}
     *
     * @memberOf util.path
     * 
     * @see  util.path#pathFind
     * @see  module:PathJS.pathFind
//     {
//         path: [
//             '+( :xType("Array").. == "false" ).#:xTo',
//             // '+(!:xType("Array"))#:xTo',
//             // '+.(!:xType("Array")).#.:xTo.',
//             // ' + ( !:xType("Array") ) # : xTo ',
//         ],
//         value: [
//             { data: '{"a":{"b":"B","c":"C"},"g":[{"h":"H0","i":"I0"},{"h":"H1","i":"I1"},{"h":"H2","i":"I2"},{"h":"H3","i":"I3"},{"h":"H4","i":"I4"},{"h":"H5","i":"I5"}]}' },
//             { data: '{"b":"B","c":"C"}' },
//             { data: '"B"' },
//             { data: '"C"' }
//         ]
//     }
// ];
     *
     * @tutorial {@link http://opencrisp.wca.at/tutorials/PathJS_test.html#pathFind|use pathFind}
     * @tutorial {@link http://opencrisp.wca.at/tutorials/PathJS-path_test.html|more Examples}
     *
     */
    function _pathFind( option, success, complete ) {
        // console.log('_pathFind');
        var self;

        option = option || {};
        success = success || option.success;
        complete = complete || option.complete;

        self = option.self || this;
        option.limit = option.limit || -1;
        option.start = option.start || 0;
        
        option.values = option.values || {};
        option.values.self = option.values.self || this;
        option.values.root = option.values.root || function () {
            return this.rootSelf();
        };


        var object = new Path( option );
        object.level = 0;

        var events = {};

        $$.defineEvent( events );

        if ( isFunction( success ) ) {
            events.eventListener({
                action: 'success',
                self: self,
                listen: success
            });
        }

        if ( isFunction( complete ) ) {
            events.eventListener({
                action: 'complete',
                self: self,
                listen: complete
            });
        }

        // _parsePath.call( this, object, events );
        utilTick( this, _parsePath, [ object, events ], option.async );

        return this;
    }

    /**
     * _pathExists
     * @private
     * @deprecated use _pathFind
     * 
     * @param  {external:String} path
     *
     * @this {this}
     * @return {external:Boolean}
     *
     * @memberOf util.path
     * 
     * @see  util.path#pathExists
     * @see  module:PathJS.pathExists
     *
     * @tutorial {@link http://opencrisp.wca.at/tutorials/PathJS_test.html#pathExists|use pathExists}
     * @tutorial {@link http://opencrisp.wca.at/tutorials/PathJS-path_test.html|more Examples}
     *
     */
    function _pathExists( path ) {
        return this.pathNode({ path: path }) !== undefined;
    }

    $$.ns('util.path').prototypes = {

        /**
         * @deprecated use pathFind
         * @function
         * @implements {util.path._pathNode}
         * @memberOf   util.path.prototype
         *
         * @example
         * var myObject = Crisp.utilCreate({ ns: 'util.path' });
         */
        pathNode: _pathNode,

        /**
         * @function
         * @implements {util.path._pathFind}
         * @memberOf   util.path.prototype
         *
         */
        pathFind: _pathFind,

        /**
         * @deprecated use pathFind
         * @function
         * @implements {util.path._pathExists}
         * @memberOf   util.path.prototype
         *
         */
        pathExists: _pathExists

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
             * @deprecated use pathFind
             * @function
             * @implements {util.path._pathNode}
             * @memberOf module:PathJS
             */
            pathNode: {
                value: _pathNode
            },

            /**
             * @function
             * @implements {util.path._pathFind}
             * @memberOf module:PathJS
             */
            pathFind: {
                value: _pathFind
            },

            /**
             * @deprecated use pathFind
             * @function
             * @implements {util.path._pathExists}
             * @memberOf module:PathJS
             */
            pathExists: {
                value: _pathExists
            }
        });

    };


}(Crisp));
