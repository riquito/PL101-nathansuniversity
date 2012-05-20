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
        case 'if':
            when(expr.length < 4).raise(expr,'too few elements');
            when(expr.length > 4).raise(expr,'too many elements');
            
            if (evalScheem(expr[1],env)==='#t')
                 return evalScheem(expr[2],env);
            else return evalScheem(expr[3],env);
        case 'lambda':
            return function(){
                var newEnv = create_env({},env);
                
                if (typeof expr[1] === 'string') {
                    expr[1] = [expr[1]];
                }
                
                when(expr[1].length !== arguments.length).raise(expr,'The function expects '+expr[1].length+' parameters');
                
                for (var i=0,il=expr.length;i<il;i++){
                    add_binding(newEnv,expr[1][i],arguments[i]);
                }
                
                return evalScheem(expr[2],newEnv);
                
            };
        default:
            var func = evalScheem(expr[0], env),
                args = [];
            for (var i=1,il=expr.length;i<il;i++){
                args.push(evalScheem(expr[i], env));
            }
            return func.apply(null,args);
    }
}


function lookup(env, v) {
    if (env === null) return undefined;
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

function create_env(bindings,outer){
    return {
        'bindings' : bindings || {},
        'outer' : outer || null
    };
}

var defaultBindings = {
    '+' : function(a,b){
        var args =  Array.prototype.slice.call(arguments);
        
        when(args.length > 2).raise(['+'].concat(args),'too many elements');
        when(args.length < 2).raise(['+'].concat(args),'too few elements');
        
        when(!isNumber(a)).raise(a,'not a number');
        when(!isNumber(b)).raise(b,'not a number');
        
        return a + b;
    },
    '-' : function(a,b){
        var args =  Array.prototype.slice.call(arguments);
        
        when(args.length > 2).raise(['-'].concat(args),'too many elements');
        when(args.length < 2).raise(['-'].concat(args),'too few elements');
        
        when(!isNumber(a)).raise(a,'not a number');
        when(!isNumber(b)).raise(b,'not a number');
        
        return a - b;
    },
    '*' : function(a,b){
        var args =  Array.prototype.slice.call(arguments);
        
        when(args.length > 2).raise(['*'].concat(args),'too many elements');
        when(args.length < 2).raise(['*'].concat(args),'too few elements');
        
        when(!isNumber(a)).raise(a,'not a number');
        when(!isNumber(b)).raise(b,'not a number');
        
        return a * b;
    },
    '/' : function(a,b){
        var args =  Array.prototype.slice.call(arguments);
        
        when(args.length > 2).raise(['/'].concat(args),'too many elements');
        when(args.length < 2).raise(['/'].concat(args),'too few elements');
        
        when(!isNumber(a)).raise(a,'not a number');
        when(!isNumber(b)).raise(b,'not a number');
        
        return a / b;
    },
    '=' : function(a,b){
            var args =  Array.prototype.slice.call(arguments);
            
            when(args.length < 2).raise(['='].concat(args),'too few elements');
            when(args.length > 2).raise(['='].concat(args),'too many elements');
            
            return a === b ? '#t' : '#f';
    },
    '<' : function(a,b){
            var args =  Array.prototype.slice.call(arguments);
            
            when(args.length < 2).raise(['<'].concat(args),'too few elements');
            when(args.length > 2).raise(['<'].concat(args),'too many elements');
            
            return a < b ? '#t' : '#f';
    },
    '>' : function(a,b){
            var args =  Array.prototype.slice.call(arguments);
            
            when(args.length < 2).raise(['>'].concat(args),'too few elements');
            when(args.length > 2).raise(['>'].concat(args),'too many elements');
            
            return a > b ? '#t' : '#f';
    },
    'cons' : function(head,tail){
            var args =  Array.prototype.slice.call(arguments);
            
            when(args.length < 2).raise(['cons'].concat(args),'too few elements');
            when(args.length > 2).raise(['cons'].concat(args),'too many elements');
            
            when(!isArray(tail)).raise(tail,'not an array');
            
            return [head].concat(tail);
    },
    'car' : function(list){
            var args =  Array.prototype.slice.call(arguments);
            
            when(args.length < 1).raise(['car'].concat(args),'too few elements');
            when(args.length > 1).raise(['car'].concat(args),'too many elements');
            
            when(!isArray(list)).raise(list,'not an array');
            
            return list[0];
    },
    'cdr' : function(list){
            var args =  Array.prototype.slice.call(arguments);
            
            when(args.length < 1).raise(['cdr'].concat(args),'too few elements');
            when(args.length > 1).raise(['cdr'].concat(args),'too many elements');
            
            when(!isArray(list)).raise(list,'not an array');
            
            return list.slice(1);
    }
};

module.exports = {
  evalScheem : function(expr,env){
    env = env || {bindings:{},outer:null};
    
    // normalize the environment, so that we accept {} but use always the
    // structure {bindings:{},outer:null}
    if (env.bindings === undefined) env.bindings = {};
    if (env.outer === undefined) env.outer = null;
    
    var baseEnv = create_env();
    
    // copy the default bindings (ensure they'll be untouched but overwritable)
    for (var key in defaultBindings){
        add_binding(baseEnv,key,defaultBindings[key]);
    }
    
    env.outer = baseEnv;
    
    return evalScheem(expr,env);
    
  }
};
