import {resolve} from 'path';
export default {
    commands: resolve(__dirname, '../commands'),
    libBin: resolve(__dirname, '../../node_modules/.bin'),
    tsnsRoot: resolve(__dirname, '../../'),
    project: process.cwd()
};
