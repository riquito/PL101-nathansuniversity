"strict";

function isNumber(x) { return typeof x === 'number'; }
function isBoolean(x) { return typeof x === 'boolean'; }

function when(bool){
    return {
        'raise' : bool ?
            function(x,message){
                throw new Error(JSON.stringify(x)+' => '+ message);
            }
            :
            function(){}
    };
}


function evalScheem(expr, env) {
    // Numbers evaluate to themselves
    if (typeof expr === 'number') {
        return expr;
    }
    // Strings are variable references
    if (typeof expr === 'string') {
        return env[expr];
    }
    // Look at head of list for operation
    switch (expr[0]) {
        case '+':
            when(expr.length > 3).raise(expr,'too many elements');
            when(expr.length < 3).raise(expr,'too few elements');
            
            var a = evalScheem(expr[1],env),
                b = evalScheem(expr[2],env);
            
            when(!isNumber(a)).raise(a,'not a number');
            when(!isNumber(b)).raise(b,'not a number');
            
            return a + b;
        
        case '-':
            when(expr.length > 3).raise(expr,'too many elements');
            when(expr.length < 3).raise(expr,'too few elements');
            
            var a = evalScheem(expr[1],env),
                b = evalScheem(expr[2],env);
            
            when(!isNumber(a)).raise(a,'not a number');
            when(!isNumber(b)).raise(b,'not a number');
            
            return a - b;
        
        case '*':
            when(expr.length > 3).raise(expr,'too many elements');
            when(expr.length < 3).raise(expr,'too few elements');
            
            var a = evalScheem(expr[1],env),
                b = evalScheem(expr[2],env);
            
            when(!isNumber(a)).raise(a,'not a number');
            when(!isNumber(b)).raise(b,'not a number');
            
            return a * b;
        
        case '/':
            when(expr.length > 3).raise(expr,'too many elements');
            when(expr.length < 3).raise(expr,'too few elements');
            
            var a = evalScheem(expr[1],env),
                b = evalScheem(expr[2],env);
            
            when(!isNumber(a)).raise(a,'not a number');
            when(!isNumber(b)).raise(b,'not a number');
            
            return a / b;
        
        case 'define':
            when(expr.length > 3).raise(expr,'too many elements');
            when(expr.length < 3).raise(expr,'too few elements');
            
            when(env[expr[1]] !== undefined).raise(expr[1],'not a new variable');
            
            env[expr[1]] = evalScheem(expr[2],env);
            return 0;
        case 'set!':
            when(expr.length > 3).raise(expr,'too many elements');
            when(expr.length < 3).raise(expr,'too few elements');
            
            when(env[expr[1]] === undefined).raise(expr[1],'variable does not exist');
            
            env[expr[1]] = evalScheem(expr[2],env);
            return 0;
        case 'begin':
            var res = 0;
            for (var i=1;i<expr.length;i++) {
                res = evalScheem(expr[i],env);
            }
            return res;
        case 'quote':
            return expr[1];
        case '=':
            var eq =
                (evalScheem(expr[1], env) ===
                 evalScheem(expr[2], env));
            return eq ? '#t' : '#f';
        case '<':
            var lt =
                (evalScheem(expr[1], env) <
                 evalScheem(expr[2], env));
            return lt ? '#t' : '#f';
        case '>':
            var gt =
                (evalScheem(expr[1], env) >
                 evalScheem(expr[2], env));
            return gt ? '#t' : '#f';
        case 'cons':
            return [evalScheem(expr[1], env)].concat(
                    evalScheem(expr[2], env));
        case 'car':
            return evalScheem(expr[1], env)[0];
        case 'cdr':
            return evalScheem(expr[1], env).slice(1);
        case 'if':
            if (evalScheem(expr[1])==='#t')
                 return evalScheem(expr[2]);
            else return evalScheem(expr[3]);
    }
}

module.exports = {
  evalScheem : evalScheem
};
