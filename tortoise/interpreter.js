"strict";

function evalExpr(expr, env) {
    // Numbers evaluate to themselves
    if (typeof expr === 'number') {
        return expr;
    }
    // Strings are variable references
    if (typeof expr === 'string') {
        return lookup(env,expr);
    }
    // Look at head of list for operation
    switch (expr.tag) {
        case '+':
        case '-':
        case '*':
        case '/':
            return evalExpr({tag:'call',name:expr.tag,args:[expr.left,expr.right]},env);
        case 'call':
            // Get function value
            var func = lookup(env, expr.name);
            
            // Evaluate arguments to pass
            var ev_args = [];
            for(var i=0,il=expr.args.length;i<il;i++) {
                ev_args.push(evalExpr(expr.args[i],env));
            }
            return func.apply(null, ev_args);
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

function arithmeticOperators(op,args,cb){
    
    when(args.length > 2).raise([op].concat(args),'too many elements');
    when(args.length < 2).raise([op].concat(args),'too few elements');
    
    when(!isNumber(args[0])).raise(args[0],'not a number');
    when(!isNumber(args[1])).raise(args[1],'not a number');
    
    return cb.apply(null,args);
}

var defaultBindings = {
    '+' : function(a,b){
        return arithmeticOperators('+',[a,b],function(a,b){ return a + b; });
    },
    '-' : function(a,b){
        return arithmeticOperators('-',[a,b],function(a,b){ return a - b; });
    },
    '*' : function(a,b){
        return arithmeticOperators('*',[a,b],function(a,b){ return a * b; });
    },
    '/' : function(a,b){
        return arithmeticOperators('/',[a,b],function(a,b){ return a / b; });
    }
};


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

module.exports = {
  evalTortoise : function(expr,env){
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
    
    return evalExpr(expr,env);
    
  }
};
