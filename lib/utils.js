const internals = {};


export function keys(obj, options = {}) {

    return options.symbols !== false ? Reflect.ownKeys(obj) : Object.getOwnPropertyNames(obj);  // Defaults to true
};
