import { readJSON } from '../promise-fs';
import { IPackageJson } from '../index';
import { getTsnsPackageJSONPath, getProjectPackageJSONPath } from './get-package-path';

export const readTsnsPackageJSON = () => readJSON<IPackageJson>(getTsnsPackageJSONPath());
export const readProjectPackageJSON = () => readJSON<IPackageJson>(getProjectPackageJSONPath());
