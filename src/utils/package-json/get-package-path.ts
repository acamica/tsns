import { join } from 'path';
import paths from '../paths';

export const getTsnsPackageJSONPath = () => join(paths.tsnsRoot, 'package.json');
export const getProjectPackageJSONPath = () => join(paths.project, 'package.json');
