import {fileURLToPath} from 'node:url';
import {basename, dirname, extname, join} from 'node:path';
import fs from 'node:fs';
import {promisify} from 'node:util'

const open  = promisify(fs.open);
const fstat = promisify(fs.fstat);
const read  = promisify(fs.read);
const write = promisify(fs.write);
const close = promisify(fs.close);

async function copyfile(fromFile, toFile) {
    console.time('Elapsed');
    try {
        let   fd       = await open(fromFile, 'r');
        const stats    = await fstat(fd);
        const storage  = Buffer.alloc(stats.size);
        let   response = await read(fd, storage, 0, storage.length, null);
        await close(fd);
        console.log('Read  %d bytes from %s', response.bytesRead, basename(fromFile));
        
        const text    = response.buffer.toString();
        const payload = text.toString().toUpperCase();
        fd            = await open(toFile, 'w');
        response      = await write(fd, payload);
        await close(fd);
        console.log('Wrote %d bytes to %s', response.bytesWritten, basename(toFile));
    } catch (err) {
        console.error('failed: %o', err)
    } finally {
        console.timeEnd('Elapsed')
    }
}

const scriptFilePath = process.argv[2] || fileURLToPath(import.meta.url);
const scriptFileName = basename(scriptFilePath, extname(scriptFilePath));
const outputFilePath = join(dirname(scriptFilePath), scriptFileName + '-copy.txt');

await copyfile(scriptFilePath, outputFilePath);
