import fs from 'node:fs';
import {promisify} from 'node:util'
import {fileURLToPath} from 'node:url';
import {basename, dirname, extname, join} from 'node:path';

function die(err) { console.error(err); process.exit(1); }

function copyfile(fromFile, toFile) {
    const open  = promisify(fs.open);
    const fstat = promisify(fs.fstat);
    const read  = promisify(fs.read);
    const write = promisify(fs.write);
    const close = promisify(fs.close);
    const state = {};
    return open(fromFile, 'r')
        .then(fd => {
            state.fd = fd;
            return fstat(fd);
        })
        .then(stats => {
            const storage = Buffer.alloc(stats.size);
            return read(state.fd, storage, 0, storage.length, null);
        })
        .then(response => {
            console.log('Read  %d bytes from %s', response.bytesRead, basename(fromFile));
            state.text = response.buffer.toString();
            return close(state.fd);
        })
        .then(_ => {
            return open(toFile, 'w');
        })
        .then(fd => {
            state.fd = fd;
            const payload = state.text.toString().toUpperCase();
            return write(fd, payload);
        })
        .then(response => {
            console.log('Wrote %d bytes to %s', response.bytesWritten, basename(toFile));
            return close( state.fd);
        });
}

const scriptFilePath = process.argv[2] || fileURLToPath(import.meta.url);
const scriptFileName = basename(scriptFilePath, extname(scriptFilePath));
const outputFilePath = join(dirname(scriptFilePath), scriptFileName + '-copy.txt');

console.time('Elapsed');
copyfile(scriptFilePath, outputFilePath)
    .then(_     => console.log('Done'))
    .catch(err  => console.error('*** %s', err))
    .finally(() => console.timeEnd('Elapsed'));

