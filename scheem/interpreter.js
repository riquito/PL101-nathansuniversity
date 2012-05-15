"strict";

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
            return evalScheem(expr[1],env) + evalScheem(expr[2],env);
        case '-':
            return evalScheem(expr[1],env) - evalScheem(expr[2],env);
        case '*':
            return evalScheem(expr[1],env) * evalScheem(expr[2],env);
        case '/':
            return evalScheem(expr[1],env) / evalScheem(expr[2],env);
        case 'define':
            env[expr[1]] = evalScheem(expr[2],env);
            return 0;
        case 'set!':
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
    }
}

module.exports = {
  evalScheem : evalScheem
};
