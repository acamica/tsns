import {resolve} from 'path';
export default {
    commands: resolve(__dirname, '../commands'),
    libBin: resolve(__dirname, '../../node_modules/.bin'),
    project: process.cwd()
};
