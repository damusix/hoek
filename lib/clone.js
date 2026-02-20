import Reach from './reach.js';
import Types from './types.js';
import { keys } from './utils.js';


const internals = {
    needsProtoHack: new Set([Types.set, Types.map, Types.weakSet, Types.weakMap]),
    structuredCloneExists: typeof structuredClone === 'function'
};


const clone = internals.clone = function (obj, options = {}, _seen = null) {

    if (typeof obj !== 'object' ||
        obj === null) {

        return obj;
    }

    let cloneFn = internals.clone;
    let seen = _seen;

    if (options.shallow) {
        if (options.shallow !== true) {
            return internals.cloneWithShallow(obj, options);
        }

        cloneFn = (value) => value;
    }
    else if (seen) {
        const lookup = seen.get(obj);
        if (lookup) {
            return lookup;
        }
    }
    else {
        seen = new Map();
    }

    // Built-in object types

    const baseProto = Types.getInternalProto(obj);
    switch (baseProto) {
        case Types.buffer:
            return Buffer?.from(obj);
        case Types.date:
            return new Date(obj.getTime());
        case Types.regex:
        case Types.url:
            return new baseProto.constructor(obj);
    }

    // Generic objects

    const newObj = internals.base(obj, baseProto, options);
    if (newObj === obj) {
        return obj;
    }

    if (seen) {
        seen.set(obj, newObj);                              // Set seen, since obj could recurse
    }

    if (baseProto === Types.set) {
        for (const value of obj) {
            newObj.add(cloneFn(value, options, seen));
        }
    }
    else if (baseProto === Types.map) {
        for (const [key, value] of obj) {
            newObj.set(key, cloneFn(value, options, seen));
        }
    }

    const objKeys = keys(obj, options);
    for (const key of objKeys) {
        if (key === '__proto__') {
            continue;
        }

        if (baseProto === Types.array &&
            key === 'length') {

            newObj.length = obj.length;
            continue;
        }

        // Can only be covered in node 21+
        /* $lab:coverage:off$ */
        if (internals.structuredCloneExists &&
            baseProto === Types.error &&
            key === 'stack') {

            continue;       // Already a part of the base object
        }
        /* $lab:coverage:on$ */

        const descriptor = Object.getOwnPropertyDescriptor(obj, key);
        if (descriptor) {
            if (descriptor.get ||
                descriptor.set) {

                Object.defineProperty(newObj, key, descriptor);
            }
            else if (descriptor.enumerable) {
                newObj[key] = cloneFn(obj[key], options, seen);
            }
            else {
                Object.defineProperty(newObj, key, { enumerable: false, writable: true, configurable: true, value: cloneFn(obj[key], options, seen) });
            }
        }
        else {
            Object.defineProperty(newObj, key, {
                enumerable: true,
                writable: true,
                configurable: true,
                value: cloneFn(obj[key], options, seen)
            });
        }
    }

    return newObj;
};

export default clone;


internals.cloneWithShallow = function (source, options) {

    const shallowKeys = options.shallow;
    options = Object.assign({}, options);
    options.shallow = false;

    const seen = new Map();

    for (const key of shallowKeys) {
        const ref = Reach(source, key);
        if (typeof ref === 'object' ||
            typeof ref === 'function') {

            seen.set(ref, ref);
        }
    }

    return internals.clone(source, options, seen);
};


internals.base = function (obj, baseProto, options) {

    if (options.prototype === false) {                  // Defaults to true
        if (internals.needsProtoHack.has(baseProto)) {
            return new baseProto.constructor();
        }

        return baseProto === Types.array ? [] : {};
    }

    const proto = Object.getPrototypeOf(obj);
    if (proto &&
        proto.isImmutable) {

        return obj;
    }

    if (baseProto === Types.array) {
        const newObj = [];
        if (proto !== baseProto) {
            Object.setPrototypeOf(newObj, proto);
        }

        return newObj;
    }
    // Can only be covered in node 21+
    /* $lab:coverage:off$ */
    else if (baseProto === Types.error && internals.structuredCloneExists &&
        (proto === baseProto || Error.isPrototypeOf(proto.constructor))) {      // Don't match Util.inherit() subclassed errors

        const err = structuredClone(obj);                                       // Needed to copy internal stack state
        if (Object.getPrototypeOf(err) !== proto) {
            Object.setPrototypeOf(err, proto);                                  // Fix prototype
        }

        return err;
    }
    /* $lab:coverage:on$ */

    if (internals.needsProtoHack.has(baseProto)) {
        const newObj = new proto.constructor();
        if (proto !== baseProto) {
            Object.setPrototypeOf(newObj, proto);
        }

        return newObj;
    }

    return Object.create(proto);
};
