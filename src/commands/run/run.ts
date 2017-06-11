import {exec} from 'shelljs';
import {build} from '../build/build';
import {readProjectPackageJSON} from '../../utils';

export interface IRunOptions {
    watch: true | undefined;
}

export const node = (main: string) => exec(`node ${main}`);

export const runNodeMain = () => readProjectPackageJSON().then(json => node(json.main));
// runNodeMain
export function run (options: IRunOptions) {
    build(options);
    return runNodeMain();
}
