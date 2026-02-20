const internals = {};


export default class AssertError extends Error {

    name = 'AssertError';

    constructor(message, ctor) {

        super(message || 'Unknown error');

        if (typeof Error.captureStackTrace === 'function') {            // $lab:coverage:ignore$
            Error.captureStackTrace(this, ctor);
        }
    }
};
