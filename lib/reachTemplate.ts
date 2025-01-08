/* eslint-disable @hapi/scope-start */

import { reach, ReachOptions } from './reach';


/**
 * Replace string parameters (using format "{path.to.key}") with their corresponding object key values using `Hoek.reach()`.
 *
 * @param obj - the object from which to look up the value.
 * @param template - the string containing {} enclosed key paths to be replaced.
 *
 * @return The template string with the {} enclosed keys replaced with looked-up values.
 */
export const reachTemplate = (
    obj: object | null,
    template: string,
    options?: ReachOptions
) => {

    return template.replace(/{([^{}]+)}/g, (_: string, chain: string) => {

        const value = reach(obj, chain, options) as string | null;
        return value ?? '';
    });

};