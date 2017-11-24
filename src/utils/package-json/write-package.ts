import { getProjectPackageJSONPath } from './get-package-path';
import { IPackageJson } from '../index';
import { writeJSON } from '../promise-fs';

export const writeProjectPackageJSON = (newPackage: IPackageJson) => writeJSON(getProjectPackageJSONPath(), newPackage);
