import {Observable} from 'rxjs';
import { readTsnsPackageJSON } from './read-package';

const readTsnsPackageJSON$ = () =>
                            Observable.fromPromise(
                                readTsnsPackageJSON()
                            );


const getVersionFromPackageJSON = () => readTsnsPackageJSON$()
                                                        .map(packageJson => packageJson.version);

export const tsnsVersion$ = getVersionFromPackageJSON();
