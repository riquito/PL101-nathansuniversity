
var PEG = require('pegjs');
var fs = require('fs'); // for loading files

// Read file contents
var data = fs.readFileSync(__dirname+'/scheem.peg', 'utf-8');

// Create my parser
var parse = PEG.buildParser(data).parse;

// Load the interpreter
var evalScheem = require('./interpreter.js').evalScheem;

function evalScheemString(code,env) {
    return evalScheem(parse(code),env);
}

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.once('data', function(data) {
   data = data.toString().trim();
   
   var res = '';
   
   try {
     res = evalScheemString(data,{});
   } catch (e) {
     res = e;
   }
   
   process.stdout.write(res+'\n');
   
 });