import * as process from 'process';
import {RxChildProcess} from './RxChildProcess';
process.stderr;
process.stdin;
// process.stdout.on(;


export const pipeStdout = (child: RxChildProcess) =>
    // child.stdout.on('data', (chunk: string | Buffer) => process.stdout.emit('data', chunk));
    child.stdout.pipe(process.stdout);


export const pipeStderr = (child: RxChildProcess) =>
    // child.stderr.on('data', (chunk: string | Buffer) => process.stderr.emit('data', chunk));
    child.stderr.pipe(process.stderr);

export const pipeOutput = (child: RxChildProcess) => {
    pipeStdout(child);
    pipeStderr(child);
};

export interface IProcessStream {
    stderr: NodeJS.WritableStream;
    stdout: NodeJS.WritableStream;
    stdin: NodeJS.ReadableStream;
}
