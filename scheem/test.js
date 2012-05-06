var PEG = require('pegjs');
var assert = require('chai').assert;
var fs = require('fs'); // for loading files

// Read file contents
var data = fs.readFileSync(__dirname+'/scheem.peg', 'utf-8');
// Show the PEG grammar file
console.log(data);
// Create my parser
var parse = PEG.buildParser(data).parse;

// Do tests
assert.deepEqual(parse(""), undefined,"parse empty string");
assert.deepEqual(parse("atom"), "atom","parse atom");
assert.deepEqual(parse("+"), "+", "parse +");
assert.deepEqual(parse("(a b c)"),["a", "b", "c"],"parse (a b c)");
assert.deepEqual(parse("(+ x 3)"), ["+", "x", "3"],"parse (+ x 3)");
assert.deepEqual(parse("(+ 1 (f x 3 y))"), ["+", "1", ["f", "x", "3", "y"]],
    "parse (+ 1 (f x 3 y))");

assert.deepEqual(parse("( +  x 3  )"), ["+", "x", "3"],"parse ( +  x 3  )");
assert.deepEqual(parse("  ( + x 3) "), ["+", "x", "3"],"parse ( + x 3) with spaces around parentheses");

assert.deepEqual(parse("'x"), ["quote","x"],"parse 'x as (quote x)");
assert.deepEqual(parse("('x a)"), [["quote","x"],"a"],"parse ('x a) as ((quote x) a)");
assert.deepEqual(parse("'(1 2 3)"), ["quote",["1","2","3"]],"parse '(1 2 3) as (quote (1 2 3))");

assert.deepEqual(parse("'x"), ["quote","x"],"parse 'x as (quote x)");
assert.deepEqual(parse("('x a)"), [["quote","x"],"a"],"parse ('x a) as ((quote x) a)");
assert.deepEqual(parse("(1 2 3) ;;comment"), ["1","2","3"],"parse (1 2 3) --comment as (1 2 3)");
