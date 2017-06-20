import {Observable} from 'rxjs';
import {IPackageJson} from '../../package.json';
import {join} from 'path';
import paths from '../paths';

import {readJSON} from '../promise-fs';


// Function to read the project package json
const readPackageJSON = (path: string) =>
                            Observable.fromPromise(
                                readJSON<IPackageJson>(path)
                            );


export const getVersionFromPackageJSON = (path: string) => readPackageJSON(path)
                                                        .map(packageJson => packageJson.version);


export const projectVersion$ = getVersionFromPackageJSON(join(paths.project, 'package.json'));
export const tsnsVersion$ = getVersionFromPackageJSON(join(paths.tsnsRoot, 'package.json'));
