import {ChildProcess} from 'child_process';
import {Socket, Server} from 'net';
import {Observable, Observer} from 'rxjs';
import * as stream from 'stream';

export const fromChildProcess = (process: ChildProcess) => new RxChildProcess(process);
export function closeWithErrorWhenStatusCode (close$: Observable<ISignalEvent>) {
    return close$.switchMap(closeReason => {
        if (closeReason.code === 0) {
            return Observable.of(closeReason);
        } else {
            return Observable.throw(`Program exited with status code ${closeReason.code}`);
        }
    });
}
export interface ISignalEvent {
    code: number | null;
    signal: string | null;
}

export interface IMessageEvent {
    message: any;
    sendHandle: Socket | Server;
}

export class RxChildProcess {
    constructor (private process: ChildProcess) {
    }
    // TODO: Refactor all events extracting common parts
    message$ = Observable.create((observer: Observer<IMessageEvent>) => {
        const innerHandler = (message: any, sendHandle: Socket | Server) => observer.next({message, sendHandle});
        this.process.on('error', innerHandler);
        return () => this.process.addListener('error', innerHandler);
    }) as Observable<IMessageEvent>;

    error$ = Observable.create((observer: Observer<Error>) => {
        const innerHandler = (err: Error) => observer.next(err);
        this.process.on('error', innerHandler);
        return () => this.process.addListener('error', innerHandler);
    }) as Observable<Error>;

    disconnect$ = Observable.create((observer: Observer<void>) => {
        const innerHandler = () => observer.next(void 0);
        this.process.on('disconnect', innerHandler);
        return () => this.process.addListener('disconnect', innerHandler);
    }) as Observable<void>;


    close$ = Observable.create((observer: Observer<ISignalEvent>) => {
        const innerHandler = (code: number, signal: string) => observer.next({code, signal});
        this.process.on('close', innerHandler);
        return () => this.process.addListener('close', innerHandler);
    }) as Observable<ISignalEvent>;


    exit$ = Observable.create((observer: Observer<ISignalEvent>) => {
        const innerHandler = (code: number, signal: string) => observer.next({code, signal});
        this.process.on('exit', innerHandler);
        return () => this.process.addListener('exit', innerHandler);
    }) as Observable<ISignalEvent>;

    get stdin (): stream.Writable {
        return this.process.stdin;
    }

    get stdout (): stream.Readable {
        return this.process.stdout;
    }

    get stderr (): stream.Readable {
        return this.process.stderr;
    }

    stdio: [stream.Writable, stream.Readable, stream.Readable];

    get pid (): number {
        return this.process.pid;
    }

    kill (signal?: string) {
        this.process.kill(signal);
    }
    send (message: any, sendHandle?: any): boolean {
        return this.process.send(message, sendHandle);
    }

    get connected () {
        return this.process.connected;
    }

    disconnect () {
        this.process.disconnect();
    }

    unref () {
        this.process.unref();
    }

    ref () {
        this.process.ref();
    }
}
