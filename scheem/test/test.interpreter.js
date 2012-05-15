"strict";

var assert = require('chai').assert;

var evalScheem = require(__dirname+'/../interpreter.js').evalScheem;

suite('interpreter',function(){
            
    suite('add', function() {
        
        test('two numbers', function() {
            assert.deepEqual(
                evalScheem(['+', 3, 5], {}),
                8
            );
        });
        
        test('a number and an expression', function() {
            assert.deepEqual(
                evalScheem(['+', 3, ['+', 2, 2]], {}),
                7
            );
        });

   });
   
   suite('subtract', function() {
        
        test('two numbers', function() {
            assert.deepEqual(
                evalScheem(['-', 3, 5], {}),
                -2
            );
        });
        
        test('a number and an expression', function() {
            assert.deepEqual(
                evalScheem(['-', 3, ['-', 2, 2]], {}),
                3
            );
        });

   });
   
   suite('multiply', function() {
        
        test('two numbers', function() {
            assert.deepEqual(
                evalScheem(['*', 3, 5], {}),
                15
            );
        });
        
        test('a number and an expression', function() {
            assert.deepEqual(
                evalScheem(['*', -3, ['*', 2, 4]], {}),
                -24
            );
        });

   });
   
   suite('divide', function() {
        
        test('two numbers', function() {
            assert.deepEqual(
                evalScheem(['/', 12, 4], {}),
                3
            );
        });
        
        test('a number and an expression', function() {
            assert.deepEqual(
                evalScheem(['/', 81, ['/', 18, -2]], {}),
                -9
            );
        });
        
        test('by 0', function() {
            assert.deepEqual(
                evalScheem(['/', 3, 0], {}),
                Infinity
            );
        });
        
        
        test('0 / num', function() {
            assert.deepEqual(
                evalScheem(['/', 0, 3], {}),
                0
            );
        });

   });
   
   suite('define', function() {
        
        test('new variable', function() {
            var env = {'a':2,'b':3};
            
            assert.deepEqual(
                evalScheem(['define', 'x', 4], env),
                0
            );
            
            assert.deepEqual(env,{'a':2,'b':3,'x':4});
            
        });

   });
   
   suite('set!', function() {
        
        test('modify variable', function() {
            var env = {'a':2,'b':3};
            
            assert.deepEqual(
                evalScheem(['set!', 'b', 5], env),
                0
            );
            
            assert.deepEqual(env,{'a':2,'b':5});
            
        });

   });
   
});

