
const compose = (...fns) => (...args) => fns.reduce((res, fn) => [fn.call(null, ...res)], args)[0];

function curry(fn) {
    const arity = fn.length;

    return function $curry(...args) {
        if (args.length < arity) return $curry.bind(null, ...args);
        return fn.call(null, ...args);
    };
}

const map = curry((fn, functor) => functor.map(fn));

const join = curry((char, arr) => arr.join(char));

// recursiveApply :: fn => [a] => ()
const recursiveApply = curry((fn, [head, ...tail]) => {
    if (head) fn(head);
    if (tail.length > 0) recursiveApply(fn, tail);
});

const ensureArray = x => x instanceof Array ? x : [x];

export { compose, curry, ensureArray, map, join, recursiveApply };