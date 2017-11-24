#!/usr/bin/env node
import * as program from 'commander';
import { readTsnsPackageJSON } from '../utils/package-json';

readTsnsPackageJSON()
    .then(packageJson =>
        program
            .command('run', 'Builds and run the project')
            .command('build', 'Builds the typescript project')
            .command('init', 'Inits the project (to be runned after npm install)')
            .version(packageJson.version)
            .parse(process.argv)
    );


