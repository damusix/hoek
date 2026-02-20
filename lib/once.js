const internals = {
    wrapped: Symbol('wrapped')
};


export default function (method) {

    if (method[internals.wrapped]) {
        return method;
    }

    let once = false;
    const wrappedFn = function (...args) {

        if (!once) {
            once = true;
            method(...args);
        }
    };

    wrappedFn[internals.wrapped] = true;
    return wrappedFn;
};
