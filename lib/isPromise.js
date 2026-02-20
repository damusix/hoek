const internals = {};


export default function (promise) {

    return typeof promise?.then === 'function';
};
