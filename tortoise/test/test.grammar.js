var PEG = require('pegjs');
var assert = require('chai').assert;
var fs = require('fs'); // for loading files

// Read file contents
var data = fs.readFileSync(__dirname+'/../tortoise.peg', 'utf-8');

// Create my parser
var parse = PEG.buildParser(data).parse;

// Do tests

suite('general',function(){
    
    test("parse empty string",function(){
        assert.deepEqual(parse(""), undefined);
    });
    
});

suite('numbers',function(){
    
    test("0",function(){
        assert.deepEqual(parse("0"), 0);
    });
    
    test("natural",function(){
        assert.deepEqual(parse("3"), 3);
        
        assert.deepEqual(parse("42"), 42);
    });
    
    test("integer",function(){
        assert.deepEqual(parse("+3"), 3);
        assert.deepEqual(parse("+42"), 42);
        assert.deepEqual(parse("-3"), -3);
        assert.deepEqual(parse("-42"), -42);
        assert.deepEqual(parse("+0"), 0);
        assert.deepEqual(parse("-0"), -0);
    });
    
    test("real",function(){
        assert.deepEqual(parse(".1"), 0.1);
        assert.deepEqual(parse(".12"), 0.12);
        assert.deepEqual(parse("0.1"), 0.1);
        assert.deepEqual(parse("0.12"), 0.12);
        assert.deepEqual(parse("5.1"), 5.1);
        assert.deepEqual(parse("123.456"), 123.456);
        assert.deepEqual(parse("-1.2"), -1.2);
        assert.deepEqual(parse("-123.456"), -123.456);
    });

});

suite('identifiers',function(){
    
    test("valid names",function(){
        assert.deepEqual(parse("name"), {tag:"ident",name:"name"});
        
        assert.deepEqual(parse("name123"), {tag:"ident",name:"name123"});
        
        assert.deepEqual(parse("name_123"), {tag:"ident",name:"name_123"});
        
        assert.deepEqual(parse("an_identifier"), {tag:"ident",name:"an_identifier"});
        
        assert.deepEqual(parse("_identifier"), {tag:"ident",name:"_identifier"});
        
        assert.throws(function(){
            parse("0_bad_identifer");
        });
    });
    
});

suite('arithmetic expressions',function(){
    
    test("without spaces",function(){
        assert.deepEqual(parse("1+2"), {tag:"+",left:1,right:2});
        assert.deepEqual(parse("1-2"), {tag:"-",left:1,right:2});
        assert.deepEqual(parse("1*2"), {tag:"*",left:1,right:2});
        assert.deepEqual(parse("1/2"), {tag:"/",left:1,right:2});
        
        assert.deepEqual(parse("-1+2"), {tag:"+",left:-1,right:2});
        assert.deepEqual(parse("-1-2"), {tag:"-",left:-1,right:2});
        assert.deepEqual(parse("-1*2"), {tag:"*",left:-1,right:2});
        assert.deepEqual(parse("-1/2"), {tag:"/",left:-1,right:2});
    });
    
    test("with spaces",function(){
        assert.deepEqual(parse("1 + 2"), {tag:"+",left:1,right:2});
        assert.deepEqual(parse("1 - 2"), {tag:"-",left:1,right:2});
        assert.deepEqual(parse("1 * 2"), {tag:"*",left:1,right:2});
        assert.deepEqual(parse("1 / 2"), {tag:"/",left:1,right:2});
        
        assert.deepEqual(parse("1 + -2"), {tag:"+",left:1,right:-2});
        assert.deepEqual(parse("1 - -2"), {tag:"-",left:1,right:-2});
        assert.deepEqual(parse("1 * -2"), {tag:"*",left:1,right:-2});
        assert.deepEqual(parse("1 / -2"), {tag:"/",left:1,right:-2});
    });
    
    test("with parenthesis but no spaces",function(){
        assert.deepEqual(parse("(1)+2"), {tag:"+",left:1,right:2});
        assert.deepEqual(parse("1+(2)"), {tag:"+",left:1,right:2});
        
        assert.deepEqual(parse("(1)-2"), {tag:"-",left:1,right:2});
        assert.deepEqual(parse("1-(2)"), {tag:"-",left:1,right:2});
        
        assert.deepEqual(parse("(1)*2"), {tag:"*",left:1,right:2});
        assert.deepEqual(parse("1*(2)"), {tag:"*",left:1,right:2});
        
        assert.deepEqual(parse("(1)/2"), {tag:"/",left:1,right:2});
        assert.deepEqual(parse("1/(2)"), {tag:"/",left:1,right:2});
        
        assert.deepEqual(parse("1+(2+3)"), {tag:"+",left:1,right:{tag:"+",left:2,right:3}});
        assert.deepEqual(parse("1+(2+3)"), {tag:"+",left:1,right:{tag:"+",left:2,right:3}});
        
        assert.deepEqual(parse("1-(2-3)"), {tag:"-",left:1,right:{tag:"-",left:2,right:3}});
        assert.deepEqual(parse("1-(2-3)"), {tag:"-",left:1,right:{tag:"-",left:2,right:3}});
        
        assert.deepEqual(parse("1*(2+3)"), {tag:"*",left:1,right:{tag:"+",left:2,right:3}});
        assert.deepEqual(parse("1*(2+3)"), {tag:"*",left:1,right:{tag:"+",left:2,right:3}});
        
        assert.deepEqual(parse("1/(2+2)"), {tag:"/",left:1,right:{tag:"+",left:2,right:2}});
        assert.deepEqual(parse("1/(2+2)"), {tag:"/",left:1,right:{tag:"+",left:2,right:2}});
    });
    
    test("with parenthesis and spaces",function(){
        assert.deepEqual(parse("( 1)+2"),    {tag:"+",left:1,right:2});
        assert.deepEqual(parse("1 + ( 2)"),  {tag:"+",left:1,right:2});
        
        assert.deepEqual(parse("( 1 ) - 2"), {tag:"-",left:1,right:2});
        assert.deepEqual(parse("1 - ( 2)"),  {tag:"-",left:1,right:2});
        
        assert.deepEqual(parse("(  1) * 2"), {tag:"*",left:1,right:2});
        assert.deepEqual(parse("1 * ( 2  )"),{tag:"*",left:1,right:2});
        
        assert.deepEqual(parse("(  1) / 2"), {tag:"/",left:1,right:2});
        assert.deepEqual(parse("1 / ( 2  )"),{tag:"/",left:1,right:2});
    });
    
    test("operators precedence",function(){
        assert.deepEqual(parse("1+2*3"),   {tag:"+",left:1,right:{tag:"*",left:2,right:3}});
        assert.deepEqual(parse("(1+2)*3"), {tag:"*",left:{tag:"+",left:1,right:2},right:3});
        
        assert.deepEqual(parse("3*4+5"),   {tag:"+",left:{tag:"*",left:3,right:4},right:5});
        assert.deepEqual(parse("3*(4+5)"), {tag:"*",left:3,right:{tag:"+",left:4,right:5}});
    });
    
});

suite('comparison operators',function(){
    
    test("without spaces",function(){
        assert.deepEqual(parse("1==2"), {tag:"==",left:1,right:2});
        assert.deepEqual(parse("1!=2"), {tag:"!=",left:1,right:2});
        assert.deepEqual(parse("1>2"),  {tag:">", left:1,right:2});
        assert.deepEqual(parse("1<2"),  {tag:"<", left:1,right:2});
        assert.deepEqual(parse("1>=2"), {tag:">=",left:1,right:2});
        assert.deepEqual(parse("1<=2"), {tag:"<=",left:1,right:2});
    });
    
    test("with spaces",function(){
        assert.deepEqual(parse("1 == 2"), {tag:"==",left:1,right:2});
        assert.deepEqual(parse("1 != 2"), {tag:"!=",left:1,right:2});
        assert.deepEqual(parse("1 > 2"),  {tag:">", left:1,right:2});
        assert.deepEqual(parse("1 < 2"),  {tag:"<", left:1,right:2});
        assert.deepEqual(parse("1 >= 2"), {tag:">=",left:1,right:2});
        assert.deepEqual(parse("1 <= 2"), {tag:"<=",left:1,right:2});
    });
    
    test("operators precedence",function(){
        assert.deepEqual(parse("1 > 2+3"),   {tag:">",left:1,right:{tag:"+",left:2,right:3}});
        assert.deepEqual(parse("1 + 2 > 3"), {tag:">",left:{tag:"+",left:1,right:2},right:3});
        assert.deepEqual(parse("1 > 2 < 5"),   {tag:">",left:1,right:{tag:"<",left:2,right:5}});
    });
    
});

suite('function calls',function(){
    
    test("function call without parameters",function(){
        assert.deepEqual(parse("foo()"), {tag:"call",name:"foo",args:[]});
    });
    
    test("function call with a single parameter",function(){
        assert.deepEqual(parse("foo(1)"),    {tag:"call",name:"foo",args:[1]});
        assert.deepEqual(parse("foo(bar)"),  {tag:"call",name:"foo",args:[{tag:"ident",name:"bar"}]});
        assert.deepEqual(parse("foo( baz )"),{tag:"call",name:"foo",args:[{tag:"ident",name:"baz"}]});
    });
    
    test("function call with many parameters",function(){
        assert.deepEqual(parse("foo(1,bar)"), {tag:"call",name:"foo",args:[1,{tag:"ident",name:"bar"}]});
        assert.deepEqual(parse("foo( 1, bar,baz )"), {tag:"call",name:"foo",args:[1,{tag:"ident",name:"bar"},{tag:"ident",name:"baz"}]});
    });
    
    test("function call with expressions",function(){
        assert.deepEqual(parse("foo(1+2)"), {tag:"call",name:"foo",args:[{tag:"+",left:1,right:2}]});
        assert.deepEqual(parse("foo(1,2+3)"), {tag:"call",name:"foo",args:[1,{tag:"+",left:2,right:3}]});
        assert.deepEqual(parse("foo(1>2)"), {tag:"call",name:"foo",args:[{tag:">",left:1,right:2}]});
    });
    
});