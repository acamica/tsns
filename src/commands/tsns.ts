#!/usr/bin/env node
import * as program from 'commander';
import {IPackageJson} from '../package.json';
import {resolve, join} from 'path';

import {readJSON} from '../utils/promise-fs';

const root = resolve(__dirname, '../../');

// Function to read the project package json
const readPackageJSON = () => readJSON<IPackageJson>(join(root, 'package.json'));

readPackageJSON()
    .then(packageJson =>
        program
            .command('run', 'Run your typescript project')
            .version(packageJson.version)
            .parse(process.argv)
    );


