import {
    readFile as read,
    writeFile as write,
    access as fsAccess
} from 'fs';

export const readFile = (path: string) => new Promise<Buffer>(
    (resolve, reject) => read(path, (err, buffer) => {
        if (err) {
            return reject(`Can\'t read ${path}: ${err}`);
        }
        return resolve(buffer);
    })
);

export const writeFile = (path: string, data: any) => new Promise<void>(
    (resolve, reject) => write(path, data, (err) => {
        if (err) {
            return reject();
        }
        return resolve();
    })
);

export const readJSON = <T>(path: string) => readFile(path)
                                            .then(buffer => JSON.parse(buffer.toString()) as T);
export const access = (path: string, options?: number) => new Promise<boolean>(
    resolve => {
        // If error resolve(false) else resolve(true)
        const cb = (err: any) => resolve(!err);

        if (options === null || typeof options === 'undefined') {
            fsAccess(path, cb);
        } else {
            fsAccess(path, options, cb);
        }
    }
);

export function tryFiles (files: string[]): Promise<string> {
    if (files.length === 0) {
        return Promise.reject('File not found');
    }
    return access(files[0]).then(
        exists => exists ?
            Promise.resolve(files[0])
            :
            tryFiles(files.slice(1)).catch(_ => Promise.reject(`Can't access any of these files [${files.toString()}]`))
    );
}
