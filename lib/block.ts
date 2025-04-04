import { ignore } from './ignore.ts';

export const block = () => new Promise<void>(ignore);
