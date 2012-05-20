var PEG = require('pegjs');
var assert = require('chai').assert;
var fs = require('fs'); // for loading files

// Read file contents
var data = fs.readFileSync(__dirname+'/../scheem.peg', 'utf-8');

// Create my parser
var parse = PEG.buildParser(data).parse;

// Do tests

suite('grammar',function(){
    
    test("parse empty string",function(){
        assert.deepEqual(parse(""), undefined);
    });
    
    test("parse: atom",function(){
        assert.deepEqual(parse("atom"), "atom");
    });
    
    test("parse: integer",function(){
        assert.deepEqual(parse("42"), 42);
    });
    
    test("parse: +",function(){
        assert.deepEqual(parse("+"), "+");
    });
    
    test("parse: (a b c)",function(){
        assert.deepEqual(parse("(a b c)"),["a", "b", "c"]);
    });
    
    test("parse: (a (b))",function(){
        assert.deepEqual(parse("(a (b))"),["a", ["b"]]);
    });
    
    test("parse: ((a) b)",function(){
        assert.deepEqual(parse("((a) b)"),[["a"], "b"]);
    });
    
    test("parse: ((a) (b))",function(){
        assert.deepEqual(parse("((a) (b))"),[["a"], ["b"]]);
    });
    
    test("parse: (+ x 3)",function(){
        assert.deepEqual(parse("(+ x 3)"), ["+", "x", 3],"parse (+ x 3)");
    });
    
    test("parse: (+ 1 (f x 3 y))",function(){
        assert.deepEqual(parse("(+ 1 (f x 3 y))"), ["+", 1, ["f", "x", 3, "y"]]);
    });
    
    test("parse: ( +  x 3  )",function(){
        assert.deepEqual(parse("( +  x 3  )"), ["+", "x", 3]);
    });
    
    test("parse:  ( + x 3) ",function(){
        assert.deepEqual(parse("  ( + x 3) "), ["+", "x", 3]);
    });
    
    test("parse: 'x as (quote x)",function(){
        assert.deepEqual(parse("'x"), ["quote","x"]);
    });
    
    test("parse: ('x a)",function(){
        assert.deepEqual(parse("('x a)"), [["quote","x"],"a"]);
    });
    
    test("parse: '(1 2 3)",function(){
        assert.deepEqual(parse("'(1 2 3)"), ["quote",[1,2,3]]);
    });
    
    test("parse: ('x a)",function(){
        assert.deepEqual(parse("('x a)"), [["quote","x"],"a"]);
    });
    
    test("parse: (1 2 3) ;;anything until end of line",function(){
        assert.deepEqual(parse("(1 2 3) ;;comment"), [1,2,3]);
    });

});
