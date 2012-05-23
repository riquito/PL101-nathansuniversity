"strict";

var assert = require('chai').assert;

var interpreter = require(__dirname+'/../interpreter.js'),
    evalTortoise = interpreter.evalTortoise,
    evalStatement = interpreter.evalStatement;


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
    
    suite('comparisons',function(){
        
        test('==', function() {
            assert.isTrue(evalTortoise({tag:'==',left:0,right:0}, {}));
            assert.isTrue(evalTortoise({tag:'==',left:1,right:1}, {}));
        });
        
        test('!=', function() {
            assert.isFalse(evalTortoise({tag:'!=',left:0,right:0}, {}));
            assert.isFalse(evalTortoise({tag:'!=',left:1,right:1}, {}));
        });
        
        test('>', function() {
            assert.isTrue(evalTortoise({tag:'>',left:1,right:0}, {}));
            assert.isTrue(evalTortoise({tag:'>',left:1,right:-1}, {}));
            
            assert.isFalse(evalTortoise({tag:'>',left:0,right:0}, {}));
            assert.isFalse(evalTortoise({tag:'>',left:1,right:1}, {}));
        });
        
        test('<', function() {
            assert.isTrue(evalTortoise({tag:'<',left:0,right:1}, {}));
            assert.isTrue(evalTortoise({tag:'<',left:-1,right:1}, {}));
            
            assert.isFalse(evalTortoise({tag:'<',left:0,right:0}, {}));
            assert.isFalse(evalTortoise({tag:'<',left:1,right:1}, {}));
        });
        
        test('>=', function() {
            assert.isTrue(evalTortoise({tag:'>=',left:1,right:0}, {}));
            assert.isTrue(evalTortoise({tag:'>=',left:1,right:-1}, {}));
            
            assert.isTrue(evalTortoise({tag:'>=',left:0,right:0}, {}));
            assert.isTrue(evalTortoise({tag:'>=',left:1,right:1}, {}));
        });
        
        test('<=', function() {
            assert.isTrue(evalTortoise({tag:'<=',left:0,right:1}, {}));
            assert.isTrue(evalTortoise({tag:'<=',left:-1,right:1}, {}));
            
            assert.isTrue(evalTortoise({tag:'<=',left:0,right:0}, {}));
            assert.isTrue(evalTortoise({tag:'<=',left:1,right:1}, {}));
        });
        
    });
    
    suite('variables',function(){
        
        var env = { bindings: { x:2, y:3 }, outer: null };
        
        test('x + y', function() {
            assert.deepEqual(
                evalTortoise({tag:'+',left:{tag:'ident',name:'x'},right:{tag:'ident',name:'y'}}, env),
                5
            );
        });
        
    });
    
    suite('statements',function(){
        
        test('expression', function() {
            assert.deepEqual(
                evalStatement({tag:'ignore',body:{tag:'+',left:1,right:2}}, {}),
                3
            );
        });
        
        test('declare variable', function() {
            var env = { bindings: { x:2, y:3 }, outer: null };
            
            assert.deepEqual(
                evalStatement({tag:'var',name:"z"}, env),
                0
            );
            
            assert.deepEqual(env.bindings,{ x:2, y:3, z:0 });
            
        });
        
        test('assignment', function() {
            var env = { bindings: { x:2, y:3 }, outer: null };
            
            assert.deepEqual(
                evalStatement({tag:':=',left:"x",right:{tag:'+',left:1,right:2}}, env),
                3
            );
            
            assert.deepEqual(env.bindings,{ x:3, y:3 });
            
            // test inner scope assignment
            var env = { bindings: { x:2, y:3 }, outer: { bindings:{ z:4 }, outer: null } };
            
            assert.deepEqual(
                evalStatement({tag:':=',left:"z",right:42}, env),
                42
            );
            
            assert.deepEqual(env.outer.bindings,{ z:42 });
            
            
        });
        
        test('if', function() {
            var env = { bindings: { x:2, y:3 }, outer: null };
            
            assert.deepEqual(
                evalStatement({tag:'if',expr:{tag:'==',left:1,right:1},body:[
                    {tag:':=',left:"x",right:5},
                    {tag:'ignore',body:{tag:'+',left:1,right:2}}
                    
                    ]}, env),
                3
            );
            
            assert.deepEqual(env.bindings,{ x:5, y:3 });
            
            assert.deepEqual(
                evalStatement({tag:'if',expr:{tag:'==',left:1,right:2},body:[
                    {tag:'ignore',body: {tag:'+',left:1,right:2}}
                    ]}, {}),
                undefined
            );
            
        });
        
        test('repeat', function() {
            var env = { bindings: { x:0, y:3 }, outer: null };
            
            evalStatement({tag:'repeat',expr:{tag:'*',left:2,right:3},
                body:[
                    {tag:':=',left:'x',right:{tag:'+',left:{tag:'ident',name:'x'},right:1}}
                ]}, env);
            
            assert.deepEqual(env.bindings,{ x:6, y:3 });
            
        });
        
        
    });
});