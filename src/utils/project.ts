import {IPackageJson} from '../package.json';
import {join} from 'path';
import paths from './paths';

import {readJSON} from '../utils/promise-fs';

// Function to read the project package json
export const readProjectPackageJSON = () => readJSON<IPackageJson>(join(paths.project, 'package.json'));
