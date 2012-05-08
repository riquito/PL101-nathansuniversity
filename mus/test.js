var PEG = require('pegjs');
var assert = require('chai').assert;
var fs = require('fs'); // for loading files

// Read file contents
var data = fs.readFileSync(__dirname+'/mus.peg', 'utf-8');
// Show the PEG grammar file
console.log(data);
// Create my parser
var parse = PEG.buildParser(data).parse;

// Do tests
assert.deepEqual(parse(""), undefined,"parse empty string");

assert.deepEqual(parse("a1[1]"),{'tag':'note','pitch':'a1','dur':1});

assert.deepEqual(parse("a1[1] b2[2]"), 
    {'tag':'seq',
    'left': {'tag':'note','pitch':'a1','dur':1},
    'right':{'tag':'note','pitch':'b2','dur':2}
    }
);

assert.deepEqual(parse("a1[1] b2[2] c3[3]"),
    {'tag':'seq',
    'left': {'tag':'note','pitch':'a1','dur':1},
    'right':{'tag':'seq',
            'left':{'tag':'note','pitch':'b2','dur':2},
            'right': {'tag':'note','pitch':'c3','dur':3}
            }
    }
);

assert.deepEqual(parse("a1[1],b2[2]"), 
    {'tag':'par',
    'left': {'tag':'note','pitch':'a1','dur':1},
    'right':{'tag':'note','pitch':'b2','dur':2}
    }
);

assert.deepEqual(parse("a1[1],b2[2],c3[3]"),
    {'tag':'par',
    'left': {'tag':'note','pitch':'a1','dur':1},
    'right':{'tag':'par',
            'left':{'tag':'note','pitch':'b2','dur':2},
            'right': {'tag':'note','pitch':'c3','dur':3}
            }
    }
);


assert.deepEqual(parse("a1[1] b2[2],c3[3]"),
    {'tag':'seq',
    'left': {'tag':'note','pitch':'a1','dur':1},
    'right':{'tag':'par',
            'left':{'tag':'note','pitch':'b2','dur':2},
            'right': {'tag':'note','pitch':'c3','dur':3}
            }
    }
);

assert.deepEqual(parse("a1[1],b2[2] a1[1]"),
    {'tag':'seq',
    'left': {'tag':'par',
            'left':{'tag':'note','pitch':'a1','dur':1},
            'right': {'tag':'note','pitch':'b2','dur':2}
            },
    'right':{'tag':'note','pitch':'a1','dur':1}
    }
);

assert.deepEqual(parse("a1[1] b2[2] c3[3],d4[4]"),
    {'tag':'seq',
    'left': {'tag':'note','pitch':'a1','dur':1},
    'right':{'tag':'seq',
            'left':{'tag':'note','pitch':'b2','dur':2},
            'right': {'tag':'par',
                     'left':{'tag':'note','pitch':'c3','dur':3},
                     'right': {'tag':'note','pitch':'d4','dur':4}
                     }
            }
    }
);

