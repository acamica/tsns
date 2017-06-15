import {exec} from 'shelljs';
import {build} from '../build/build';
import {readProjectPackageJSON} from '../../utils';

export interface IRunOptions {
    watch: true | undefined;
    build: boolean;
}

export const node = (main: string) => exec(`node ${main}`);

export const runNodeMain = () => readProjectPackageJSON().then(json => node(json.main));
// runNodeMain
export function run (options: IRunOptions) {
    if (options.build) {
        build(options);
    }
    return runNodeMain();
}
