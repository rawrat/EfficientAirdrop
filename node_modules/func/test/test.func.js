/*jshint node:true, newcap:false */
/*global assert, describe, it */
/**
 * @fileOverview
 * Func Tests File
 *
 * @author Shannon Moeller
 * @version 0.1.0
 */

'use strict';

var Func = require('func');

describe('Func()', function() {
    it('should always return an instance of Func', function() {
        // Call normally
        assert(Func() instanceof Func);

        // Call with new
        assert(new Func() instanceof Func);

        // Call and bind context
        assert(Func.call(this) instanceof Func);
        assert(Func.apply(null) instanceof Func);
    });
});

describe('Func.extend([prot], [stat])', function() {
    it('should return a child function whose prototype is an instance of the parent', function() {
        // Extend Func
        var Child = Func.extend();

        // Extend Child
        var Grandchild = Child.extend();

        // Create instance
        var obj = Grandchild();

        // Check chain
        assert.ok(obj instanceof Func);
        assert.ok(obj instanceof Child);
        assert.ok(obj instanceof Grandchild);
    });

    it('should copy given instance and static members to the appropriate objects', function() {
        // Extend Func
        var Child = Func.extend(
            { a: 1 }, // instance members
            { b: 2 }  // static members
        );

        // Create instance
        var obj = Child();

        // Check prototype
        assert.strictEqual(Child.a, undefined);
        assert.strictEqual(Child.prototype.a, 1);
        assert.strictEqual(obj.a, 1);

        // Check static
        assert.strictEqual(Child.b, 2);
        assert.strictEqual(Child.prototype.b, undefined);
        assert.strictEqual(obj.b, undefined);
    });
});
