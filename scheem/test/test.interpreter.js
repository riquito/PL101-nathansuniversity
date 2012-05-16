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
        
        test('only numbers are accepted', function() {
            assert.throws(function(){
                evalScheem(['+',1,['quote',[1,2]]], {});
            });
        });
        
        test('only two numbers', function() {
            assert.throws(function(){
                evalScheem(['+',1,2,3], {});
            });
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
        
        test('only numbers are accepted', function() {
            assert.throws(function(){
                evalScheem(['-',1,['quote',[1,2]]], {});
            });
        });
        
        test('only two numbers', function() {
            assert.throws(function(){
                evalScheem(['-',1,2,3], {});
            });
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
        
        test('only numbers are accepted', function() {
            assert.throws(function(){
                evalScheem(['*',1,['quote',[1,2]]], {});
            });
        });
        
        test('only two numbers', function() {
            assert.throws(function(){
                evalScheem(['*',1,2,3], {});
            });
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
        
        test('only numbers are accepted', function() {
            assert.throws(function(){
                evalScheem(['/',1,['quote',[1,2]]], {});
            });
        });
        
        test('only two numbers', function() {
            assert.throws(function(){
                evalScheem(['/',1,2,3], {});
            });
        });

   });
   
   suite('define', function() {
        
        test('assign variable', function() {
            var env = {'a':2,'b':3};
            
            assert.deepEqual(
                evalScheem(['define', 'x', 4], env),
                0
            );
            
            assert.deepEqual(env,{'a':2,'b':3,'x':4});
            
        });
        
        test('variable must not exist', function() {
            var env = {'a':2,'b':3};
            
            assert.throws(function(){
                evalScheem(['define', 'a', 4], env)
            });
            
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
        
        test('variable must exist', function() {
            var env = {'a':2,'b':3};
            
            assert.throws(function(){
                evalScheem(['set!', 'c', 4], env)
            });
            
        });

   });
   
   
   suite('begin', function() {
        
        test('(begin 1 2 3)', function() {
            
            assert.deepEqual(
                evalScheem(['begin',1,2,3],{}),
                3
            );
            
        });
        
        test('(begin (+ 2 2))', function() {
            
            assert.deepEqual(
                evalScheem(['begin',['+',2,2]],{}),
                4
            );
            
        });
        
        test('(begin x y x)', function() {
            
            assert.deepEqual(
                evalScheem(['begin','x','y','x'],{x:1, y:2}),
                1
            );
            
        });
        
        test('(begin (set! x 5) (set! x (+ y x) x))', function() {
            
            assert.deepEqual(
                evalScheem(['begin', ['set!', 'x', 5], 
                                     ['set!', 'x', ['+', 'y', 'x']],
                                     'x'
                           ],{x:1, y:2}),
                7
            );
            
        });
        
        test('must have at least an expression to evaluate', function() {
            
            assert.throws(function(){
                evalScheem(['begin'], env);
            });
            
        });

   });
   
   
   suite('quote', function() {
        
        test('(quote (+ 2 3))', function() {
            assert.deepEqual(
                evalScheem(['quote',['+',2,3]],{}),
                ['+',2,3]
            );
        });
        
        test('(quote (quote (+ 2 3)))', function() {
            assert.deepEqual(
                evalScheem(['quote',['quote',['+',2,3]]],{}),
                ['quote',['+',2,3]]
            );
        });
        
        test('must have at most an expression to quote', function() {
            
            assert.throws(function(){
                evalScheem(['quote',1,2], env);
            });
            
        });
        
   });
   
   suite('equality', function() {
        
        test('(= 2 2)', function() {
            assert.deepEqual(
                evalScheem(['=',2,2],{}),
                '#t'
            );
        });
        
        test('(= 2 3)', function() {
            assert.deepEqual(
                evalScheem(['=',2,3],{}),
                '#f'
            );
        });
        
        test('(= 2 (+ 1 1))', function() {
            assert.deepEqual(
                evalScheem(['=',2,['+',1,1]],{}),
                '#t'
            );
        });
        
        test('(= 2 (+ 2 1))', function() {
            assert.deepEqual(
                evalScheem(['=',2,['+',2,1]],{}),
                '#f'
            );
        });
        
        test('must have exactly two parameters', function() {
            
            assert.throws(function(){
                evalScheem(['=',1,2,3], {});
            });
            
            assert.throws(function(){
                evalScheem(['=',1], {});
            });
            
        });
        
   });
   
   suite('greater than', function() {
        
        test('(> 2 1)', function() {
            assert.deepEqual(
                evalScheem(['>',2,1],{}),
                '#t'
            );
        });
        
        test('(> 2 3)', function() {
            assert.deepEqual(
                evalScheem(['>',2,3],{}),
                '#f'
            );
        });
        
        test('(> 2 (+ 0 1))', function() {
            assert.deepEqual(
                evalScheem(['>',2,['+',0,1]],{}),
                '#t'
            );
        });
        
        test('(> 2 (+ 2 1))', function() {
            assert.deepEqual(
                evalScheem(['>',2,['+',2,1]],{}),
                '#f'
            );
        });
        
        test('must have exactly two parameters', function() {
            
            assert.throws(function(){
                evalScheem(['>',1,2,3], {});
            });
            
            assert.throws(function(){
                evalScheem(['>',1], {});
            });
            
        });
        
   });
   
   suite('lesser than', function() {
        
        test('(< 1 2)', function() {
            assert.deepEqual(
                evalScheem(['<',1,2],{}),
                '#t'
            );
        });
        
        test('(< 3 2)', function() {
            assert.deepEqual(
                evalScheem(['<',3,2],{}),
                '#f'
            );
        });
        
        test('(< 2 (+ 0 1))', function() {
            assert.deepEqual(
                evalScheem(['<',1,['+',0,2]],{}),
                '#t'
            );
        });
        
        test('(< 3 (+ 2 1))', function() {
            assert.deepEqual(
                evalScheem(['<',3,['+',2,1]],{}),
                '#f'
            );
        });
        
        test('must have exactly two parameters', function() {
            
            assert.throws(function(){
                evalScheem(['<',1,2,3], {});
            });
            
            assert.throws(function(){
                evalScheem(['<',1], {});
            });
            
        });
        
   });
   
   suite('cons', function() {
        
        test('cons 1 \'(2 3)', function() {
            assert.deepEqual(
                evalScheem(['cons',1,['quote',[2,3]]],{}),
                [1,2,3]
            );
        });
        
        test('cons \'(1 2) \'(3 4)', function() {
            assert.deepEqual(
                evalScheem(['cons',['quote',[1,2]],['quote',[3,4]]],{}),
                [[1,2],3,4]
            );
        });
        
  });
        
  suite('car', function() {
        
        test('car \'((1 2) 3 4))', function() {
            assert.deepEqual(
                evalScheem(['car',['quote',[[1,2],3,4]]],{}),
                [1,2]
            );
        });
  });
  
  suite('cdr', function() {
        
        test('cdr \'((1 2) 3 4)', function() {
            assert.deepEqual(
                evalScheem(['cdr',['quote',[[1,2],3,4]]],{}),
                [3,4]
            );
        });
        
  });
  
  
  suite('if', function() {
        
        test('(if (= 1 1) 2 3)', function() {
            assert.deepEqual(evalScheem(['if', ['=', 1, 1], 2, 3], {}),
            2)
            ;
        });
        
        test('(if (= 1 0) 2 3)', function() {
            assert.deepEqual(evalScheem(['if', ['=', 1, 0], 2, 3], {}), 3)
            ;
        });
  
        test('(if (= 1 1) 2 error)', function() {
            assert.deepEqual(evalScheem(['if', ['=', 1, 1], 2, 'error'], {}), 2)
            ;
        });

        test('(if (= 1 1) error 3)', function() {
            assert.deepEqual(evalScheem(['if', ['=', 1, 0], 'error', 3], {}), 3)
            ;
        });
        
        test('(if (= 1 1) (if (= 2 3) 10 11) 12)', function() {
            assert.deepEqual(evalScheem(
                ['if', ['=', 1, 1],
                       ['if', ['=', 2, 3], 10, 11],
                       12],
                {}),
            11)
            ;
        });
        
        test('must have exactly four parameters', function() {
            
            assert.throws(function(){
                evalScheem(['if',true,1,2,3], {});
            });
            
            assert.throws(function(){
                evalScheem(['if',true,1], {});
            });
            
        });
        
  });
   
});

