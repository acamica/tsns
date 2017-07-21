// import {exec} from 'shelljs';
import {build, IBuildOptions} from '../build/build';
import { readProjectPackageJSON, tryFiles } from '../../utils';
import {Observable} from 'rxjs';
import {exec} from '../../utils/rx-exec';
import paths from '../../utils/paths';
import {join} from 'path';
import {pipeOutput, closeWithErrorWhenStatusCode} from '../../utils/rx-exec';

// Single run recipy
export const runNode = (main: string) => exec(`node ${main}`);

export const buildAndPipeOutput = (options: IBuildOptions) =>
                                        build(options)
                                            .do(pipeOutput) // TODO: Shouldn't do side effect here
                                            .switchMap(process => closeWithErrorWhenStatusCode(process.close$))
                                            // Finish the chain once the process has finished
                                            .first();

export const runOnce = (main: string, options: IRunOptions) => {
    const buildOnce$ = buildAndPipeOutput({watch: undefined});
    // If we should build, do it once, if not send an empty element to run the next step
    const build$ = options.build ? buildOnce$ : Observable.of(null);
    return build$.switchMap(_ => {
        return runNode(main);
    });
};

// Watch mode recipy
export const nodemonBin = join(paths.libBin, 'nodemon');

export const runNodeMon = (main: string, configFile: string) =>
                                                                Observable.of(`${nodemonBin} --config ${configFile} ${main}`)
                                                                .do(cmd => console.log('cmd', cmd))
                                                                .switchMap(cmd => exec(cmd));


export const nodemonConfigFile$ = Observable
                                    .of(
                                        [
                                            join(paths.project, 'nodemon.json'),
                                            join(paths.tsnsRoot, 'src/commands/run/nodemon.json')
                                        ]
                                    )
                                    .switchMap(files => tryFiles(files));


export const runWatch = (main: string) =>
                                        Observable.merge(
                                            nodemonConfigFile$.switchMap(
                                                configFile => runNodeMon(main, configFile)
                                            ),
                                            build({watch: true})
                                        );

export interface IRunOptions {
    watch: true | undefined;
    build: boolean;
}


export const getMainFileFromPackageJSON = () => Observable
                                            .fromPromise(readProjectPackageJSON())
                                            .map(json => json.main);

export function run (options: IRunOptions) {
    return getMainFileFromPackageJSON()
        .switchMap(main => {
            if (options.watch) {
                return runWatch(main);
            } else {
                return runOnce(main, options);
            }
        })
        .do(pipeOutput)
        .switchMap(process => closeWithErrorWhenStatusCode(process.close$));
}

