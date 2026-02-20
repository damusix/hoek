const internals = {};


const Types = {
    array: Array.prototype,
    buffer: Buffer && Buffer.prototype,             // $lab:coverage:ignore$
    date: Date.prototype,
    error: Error.prototype,
    generic: Object.prototype,
    map: Map.prototype,
    promise: Promise.prototype,
    regex: RegExp.prototype,
    set: Set.prototype,
    url: URL.prototype,
    weakMap: WeakMap.prototype,
    weakSet: WeakSet.prototype
};

export default Types;


internals.typeMap = new Map([
    ['[object Error]', Types.error],
    ['[object Map]', Types.map],
    ['[object Promise]', Types.promise],
    ['[object Set]', Types.set],
    ['[object URL]', Types.url],
    ['[object WeakMap]', Types.weakMap],
    ['[object WeakSet]', Types.weakSet]
]);


Types.getInternalProto = function (obj) {

    if (Array.isArray(obj)) {
        return Types.array;
    }

    if (Buffer && obj instanceof Buffer) {          // $lab:coverage:ignore$
        return Types.buffer;
    }

    if (obj instanceof Date) {
        return Types.date;
    }

    if (obj instanceof RegExp) {
        return Types.regex;
    }

    if (obj instanceof Error) {
        return Types.error;
    }

    const objName = Object.prototype.toString.call(obj);
    return internals.typeMap.get(objName) || Types.generic;
};
