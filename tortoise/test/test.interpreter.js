"strict";

var assert = require('chai').assert;

var evalTortoise = require(__dirname+'/../interpreter.js').evalTortoise;


suite('interpreter',function(){
    
    suite('add', function() {
        
        test('two numbers', function() {
            assert.deepEqual(
                evalTortoise({tag:'+',left:3,right:5}, {}),
                8
            );
        });
        
        test('a number and an expression', function() {
            assert.deepEqual(
                evalTortoise({tag:'+',left:3,right:{tag:'+',left:2,right:2}}, {}),
                7
            );
        });

   });
   
   suite('subtract', function() {
        
        test('two numbers', function() {
            assert.deepEqual(
                evalTortoise({tag:'-',left:3,right:5}, {}),
                -2
            );
        });
        
        test('a number and an expression', function() {
            assert.deepEqual(
                evalTortoise({tag:'-',left:3,right:{tag:'-',left:2,right:2}}, {}),
                3
            );
        });

   });
   
   suite('multiply', function() {
        
        test('two numbers', function() {
            assert.deepEqual(
                evalTortoise({tag:'*',left:3,right:5}, {}),
                15
            );
        });
        
        test('a number and an expression', function() {
            assert.deepEqual(
                evalTortoise({tag:'*',left:-3,right:{tag:'*',left:2,right:4}}, {}),
                -24
            );
        });

   });
   
   suite('divide', function() {
        
        test('two numbers', function() {
            assert.deepEqual(
                evalTortoise({tag:'/',left:12,right:4}, {}),
                3
            );
        });
        
        test('a number and an expression', function() {
            assert.deepEqual(
                evalTortoise({tag:'/',left:81,right:{tag:'/',left:18,right:-2}}, {}),
                -9
            );
        });
        
        test('by 0', function() {
            assert.deepEqual(
                evalTortoise({tag:'/',left:3,right:0}, {}),
                Infinity
            );
        });
        
        test('0 / num', function() {
            evalTortoise({tag:'/',left:0,right:3}, {}),
            0
        });
        

   });
    
});