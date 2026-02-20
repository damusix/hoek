const internals = {};


export default function (...args) {

    try {
        return JSON.stringify(...args);
    }
    catch (err) {
        return '[Cannot display object: ' + err.message + ']';
    }
};
