/*jshint node:true, newcap:false */
/**
 * @fileOverview
 * Func Declaration File
 *
 * @author Shannon Moeller
 * @version 0.1.0
 */

'use strict';

/**
 * Modules.
 */
var copier = require('copier');

/**
 * No-op generic constructor.
 *
 * @constructor
 */
var Func = function() {};

/**
 * Creates a child of the current function.
 *
 * @param {Object} prot A prototype object.
 * @param {Object} stat A static object.
 * @this {Func} The current function.
 * @return {Function} Child function.
 */
Func.extend = function extend(prot, stat) {
    // Whether to execute `this.init()`.
    var init = false;

    // Since `extend` is a static property of a function,
    // the value of `this` here will be that function.
    var parent = new this();

    // A function which always returns an instance.
    var Child = function F() {
        var self = this;

        // Call with `new` if no one else has.
        if (!(self instanceof F)) {
            // Don't execute the init logic.
            init = false;

            // Just extend the prototype chain.
            self = new F();
        }

        if (init) {
            // Execute `this.init()`.
            self.init.apply(self, arguments);
        } else {
            // Init next time around.
            init = true;
        }

        // Return instance.
        return self;
    };

    // Instance members.
    Child.prototype = copier(parent, prot, {
        // Ensure constructor value.
        constructor: Child
    });

    // Static members.
    copier(Child, stat, {
        // Bless child with superpowers.
        extend: extend
    });

    // Our shiney new child function.
    return Child;
};

/**
 * Expose a useful Func.
 */
module.exports = Func.extend({
    /**
     * No-op default initializer.
     *
     * @return {Object}
     */
    init: function() {
        return this;
    }
});
