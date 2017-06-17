import {exec as doexec, ExecOptions} from 'child_process';
// import {stream} from 'stream';
import {Observable, Observer} from 'rxjs';
import {RxChildProcess, fromChildProcess} from './RxChildProcess';

export * from './process-map';
export * from './RxChildProcess';

export const exec = (command: string, options?: ExecOptions): Observable<RxChildProcess> =>
    Observable.create((observer: Observer<RxChildProcess>) => {
        const process = fromChildProcess(doexec(command, options as any));
        observer.next(process);


        return () => {
            process.kill();
        };
    });


