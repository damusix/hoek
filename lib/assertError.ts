export class AssertError extends Error {

    name = 'AssertError';

    constructor(message:string, ctor: Function) {

        super(message || 'Unknown error');

        if (typeof Error.captureStackTrace === 'function') {            // $lab:coverage:ignore$
            Error.captureStackTrace(this, ctor);
        }
    }
}