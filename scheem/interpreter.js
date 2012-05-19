"strict";

function isNumber(x) { return typeof x === 'number'; }
function isBoolean(x) { return typeof x === 'boolean'; }

function isInteger(n){ // note, it implies n IS a number
  return n===+n && n===(n|0);
}

function isFloat(n) { // note, it implies n IS a number
  return n===+n && n!==(n|0);
}

// _type and _class2type ideas from jQuery core.js 1.7.1
function _type(obj) {
  
  return obj == null ? // match null and undefined
    String( obj ) :
    this._class2type[ Object.prototype.toString.call(obj) ] || "object";
}

var _class2type = (function() {
  var classes = ["Boolean","Number","String","Function","Array","Date","RegExp","Object"],
      class2type = {};
  
  for (var i=0,il=classes.length;i<il;i++) {
    class2type[ "[object " + classes[i] + "]" ] = classes[i].toLowerCase();
  };
  
  return class2type;
  
})();

var isArray = Array.isArray || function( obj ) {
    return this._type(obj) === "array";
};

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
        return lookup(env,expr);
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
            
            when(lookup(env,expr[1]) !== undefined).raise(expr[1],'not a new variable');
            
            add_binding(env,expr[1],evalScheem(expr[2],env));
            
            return 0;
        case 'set!':
            when(expr.length > 3).raise(expr,'too many elements');
            when(expr.length < 3).raise(expr,'too few elements');
            
            when(lookup(env,expr[1]) === undefined).raise(expr[1],'variable does not exist');
            
            update(env,expr[1],evalScheem(expr[2],env));
            
            return 0;
        case 'begin':
            when(expr.length < 2).raise(expr,'too few elements');
            
            var res = 0;
            for (var i=1;i<expr.length;i++) {
                res = evalScheem(expr[i],env);
            }
            return res;
        case 'quote':
            when(expr.length > 2).raise(expr,'too many elements');
            
            return expr[1];
        case '=':
            when(expr.length < 3).raise(expr,'too few elements');
            when(expr.length > 3).raise(expr,'too many elements');
            
            var eq =
                (evalScheem(expr[1], env) ===
                 evalScheem(expr[2], env));
            return eq ? '#t' : '#f';
        case '<':
            when(expr.length < 3).raise(expr,'too few elements');
            when(expr.length > 3).raise(expr,'too many elements');
            
            var lt =
                (evalScheem(expr[1], env) <
                 evalScheem(expr[2], env));
            return lt ? '#t' : '#f';
        case '>':
            when(expr.length < 3).raise(expr,'too few elements');
            when(expr.length > 3).raise(expr,'too many elements');
            
            var gt =
                (evalScheem(expr[1], env) >
                 evalScheem(expr[2], env));
            return gt ? '#t' : '#f';
        case 'cons':
            when(expr.length < 3).raise(expr,'too few elements');
            when(expr.length > 3).raise(expr,'too many elements');
            
            var x = evalScheem(expr[2], env);
            
            when(!isArray(x)).raise(expr[2],'not an array');
            
            return [evalScheem(expr[1], env)].concat(x);
        case 'car':
            when(expr.length < 2).raise(expr,'too few elements');
            when(expr.length > 2).raise(expr,'too many elements');
            
            var x = evalScheem(expr[1], env);
            
            when(!isArray(x)).raise(expr[1],'not an array');
            
            return x[0];
        case 'cdr':
            when(expr.length < 2).raise(expr,'too few elements');
            when(expr.length > 2).raise(expr,'too many elements');
            
            var x = evalScheem(expr[1], env);
            
            when(!isArray(x)).raise(expr[1],'not an array');
            
            return x.slice(1);
        case 'if':
            when(expr.length < 4).raise(expr,'too few elements');
            when(expr.length > 4).raise(expr,'too many elements');
            
            if (evalScheem(expr[1])==='#t')
                 return evalScheem(expr[2]);
            else return evalScheem(expr[3]);
    }
}


function lookup(env, v) {
    if (env === undefined || !env.bindings) return undefined;
    else if (env.bindings[v]!==undefined) return env.bindings[v];
    else return lookup(env.outer,v);
}

function update(env, v, val) {
    if (env.bindings && (env.bindings[v]!==undefined || !env.outer)) {
      env.bindings[v] = val;
    } else return update(env.outer,v,val);
}

function add_binding(env, v, val) {
    env.bindings[v] = val;
};

module.exports = {
  evalScheem : evalScheem
};
