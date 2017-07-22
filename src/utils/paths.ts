import {resolve, join} from 'path';
const tsnsRoot = resolve(__dirname, '../../');

export default {
    commands: resolve(__dirname, '../commands'),
    libBin: resolve(__dirname, '../../node_modules/.bin'),
    tsnsRoot,
    defaultConfig: join(tsnsRoot, 'default-config'),
    project: process.cwd()
};
