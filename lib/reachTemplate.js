import Reach from './reach.js';


const internals = {};


export default function (obj, template, options) {

    return template.replace(/{([^{}]+)}/g, ($0, chain) => {

        const value = Reach(obj, chain, options);
        return value ?? '';
    });
};
