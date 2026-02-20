import * as Code from '@hapi/code';
import * as Lab from '@hapi/lab';
import * as Hoek from '../lib/index.js';


const internals = {};


const lab = Lab.script();
export { lab };
const { describe, it } = lab;
const expect = Code.expect;


internals.uncapitalize = (str) => {

    // Used capitalized classes like "Bench" and "Error"

    return str[0].toLowerCase() + str.slice(1);
};


describe('exports', () => {

    it('exposes all methods and classes as named imports', () => {

        const list = Object.keys(Hoek).sort();

        expect(list.length).to.be.greaterThan(0);
        expect(list).to.contain(['assert', 'clone', 'merge', 'deepEqual', 'Bench', 'AssertError']);
    });

    it('can call an exported destructured method', () => {

        const { assert } = Hoek;

        expect(() => assert(false, 'oops')).to.throw('oops');
    });

    it('does not export unlisted modules', async () => {

        await expect(import('@hapi/hoek/types')).to.reject();
        await expect(import('@hapi/hoek/utils')).to.reject();
    });
});
