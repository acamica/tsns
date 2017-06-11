#!/usr/bin/env node
import * as program from 'commander';
import {IPackageJson} from '../package.json';
import {resolve, join} from 'path';
import {build} from './build/build';

import {readJSON} from '../utils/promise-fs';

const root = resolve(__dirname, '../../');

// Function to read the project package json
const readPackageJSON = () => readJSON<IPackageJson>(join(root, 'package.json'));

readPackageJSON()
    .then(packageJson => {
        program
            .version(packageJson.version)
            .description('Builds your app using the tsc from your node modules')
            .option('-w, --watch', 'Watch for changes')
            .parse(process.argv);
        build(<any>program);
    }
    )
    .catch(err => console.error('There was an error building the program', err));

