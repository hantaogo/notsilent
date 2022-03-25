const library = {
  'print': function(x) {
    console.log(x);
    return x;
  },
  '+': (...args) => {
    return args.reduce((acc, x) => {
      return acc + x
    })
  },
  '-': (...args) => {
    return args.reduce((acc, x) => {
      return acc - x
    })
  },
  '*': (...args) => {
    return args.reduce((acc, x) => {
      return acc * x
    })
  },
  '/': (...args) => {
    return args.reduce((acc, x) => {
      return acc / x
    })
  },
  '=': (a, b) => {
    return a == b
  },
  '==': (a, b) => {
    return a == b
  },
  '!=': (a, b) => {
    return a != b
  },
  '===': (a, b) => {
    return a === b
  },
  '!==': (a, b) => {
    return a !== b
  },
  '>': (a, b) => {
    return a > b
  },
  '<': (a, b) => {
    return a < b
  },
  '>=': (a, b) => {
    return a >= b
  },
  '<=': (a, b) => {
    return a <= b
  },
  'not': a => {
    return !a
  },
  'and': (...args) => {
    for (const arg of args) {
      if (!arg) {
        return false
      }
    }
    return true
  },
  'or': (...args) => {
    for (const arg of args) {
      if (arg) {
        return true
      }
    }
    return false
  },
  'max': (...args) => {
    return Math.max(...args)
  },
  'min': (...args) => {
    return Math.min(...args)
  },
  'include': (arrayOrString, t) => {
    return arrayOrString && arrayOrString.include(t)
  },
  'length': list => {
    return list && list ? list.length : 0
  },
  'index': (arrayOrObject, index) => {
    return arrayOrObject[index]
  },
  'first': list => {
    return list && list[0]
  },
  'second': list => {
    return list && list[1]
  },
  'rest': list => {
    return list && list.slice(1)
  },
  'last': list => {
    return list && list[list.length - 1]
  },
  'join': (list, seperator) => {
    if (Array.isArray(list)) {
      return list.join(seperator || ' ')
    } else {
      return ''
    }
  },
  'split': (list, seperator) => {
    if (typeof list === 'string') {
      return list.split(seperator || ' ')
    } else {
      return []
    }
  },
  'map': (list, func) => {
    if (Array.isArray(list)) {
      return list.map(t => func(t))
    } else {
      return []
    }
  },
  'str': v => {
    return `${v}`
  },
  'int': v => {
    return Number.parseInt(v)
  },
  'notempty': v => {
    return v !== '' ? v : undefined
  },
  'set': (obj, k, v) => {
    return {
      ...obj,
      [k]: v,
    }
  },
  'get': (obj, k) => {
    return obj[k]
  },
  'object': (...pairs) => {
    const obj = {}
    for (const pair of pairs) {
      const [k, v] = pair
      obj[k] = v
    }
    return obj
  },
};

const Context = function(scope, parent) {
  this.scope = scope;
  this.parent = parent;

  this.__get__ = function(identifier) {
    if (identifier in this.scope) {
      return this.scope[identifier];
    } else if (this.parent !== undefined) {
      return this.parent.__get__(identifier);
    }
  };
};

const special = {
  let: function(input, context) {
    const letContext = input[1].reduce(function(acc, x) {
      acc.scope[x[0].value] = interpret(x[1], context);
      return acc;
    }, new Context({}, context));

    return interpret(input[2], letContext);
  },

  lambda: function(input, context) {
    return function() {
      const lambdaArguments = arguments;
      const lambdaScope = input[1].reduce(function(acc, x, i) {
        acc[x.value] = lambdaArguments[i];
        return acc;
      }, {});
      return interpret(input[2], new Context(lambdaScope, context));
    };
  },

  if: function(input, context) {
    return interpret(input[1], context) ?
      interpret(input[2], context) :
      interpret(input[3], context);
  }
};

const interpretList = function(input, context) {
  if (input.length > 0 && input[0].value in special) {
    return special[input[0].value](input, context);
  } else {
    const list = input.map(function(x) { return interpret(x, context); });
    if (list[0] instanceof Function) {
      return list[0].apply(undefined, list.slice(1));
    } else {
      return list;
    }
  }
};

export const interpret = function(input, context) {
  if (context === undefined) {
    return interpret(input, new Context(library));
  } else if (input instanceof Array) {
    return interpretList(input, context);
  } else if (input.type === "identifier") {
    return context.__get__(input.value);
  } else if (input.type === "number" || input.type === "string") {
    return input.value;
  }
};

const categorize = function(input) {
  if (!isNaN(parseFloat(input))) {
    return { type:'number', value: parseFloat(input) };
  } else if (input[0] === '"' && input.slice(-1) === '"') {
    return { type:'string', value: input.slice(1, -1) };
  } else {
    return { type:'identifier', value: input };
  }
};

const parenthesize = function(input, list) {
  if (list === undefined) {
    return parenthesize(input, []);
  } else {
    const token = input.shift();
    if (token === undefined) {
      return list.pop();
    } else if (token === "(") {
      list.push(parenthesize(input, []));
      return parenthesize(input, list);
    } else if (token === ")") {
      return list;
    } else {
      return parenthesize(input, list.concat(categorize(token)));
    }
  }
};

const tokenize = function(input) {
  const str = (typeof input === 'string' ? input : '')
  return str.split('"')
    .map(function(x, i) {
        if (i % 2 === 0) { // not in string
          return x.replace(/\(/g, ' ( ')
                  .replace(/\)/g, ' ) ');
        } else { // in string
          return x.replace(/ /g, "!whitespace!");
        }
      })
    .join('"')
    .trim()
    .split(/\s+/)
    .map(function(x) {
      return x.replace(/!whitespace!/g, " ");
    });
};

export const parse = function(input) {
  return parenthesize(tokenize(input));
}

export const evalString = function(str, extraEnv) {
  const env = {
    ...library,
    ...extraEnv,
  }
  return interpret(parse(str), new Context(env))
}