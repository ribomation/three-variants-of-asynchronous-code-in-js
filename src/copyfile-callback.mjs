import {close, fstat, open, read, write} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {basename, dirname, extname, join} from 'node:path';

function die(err) { console.error(err); process.exit(1); }

function copyfile(fromFile, toFile) {
    open(fromFile, 'r', (err, fd) => {
       if (err) die(err);
       fstat(fd, (err, stats) => {
           if (err) die(err);
           const storage = Buffer.alloc(stats.size);
           read(fd, storage,0, storage.length,null, (err, bytesIn, data) => {
               if (err) die(err);
               console.log('Read  %d bytes from %s', bytesIn, basename(fromFile));
               close(fd, (err) => {
                   if (err) die(err);
                   open(toFile, 'w', (err, fd) => {
                       if (err) die(err);
                       const payload = data.toString().toUpperCase();
                       write(fd, payload, (err, bytesOut) => {
                           if (err) die(err);
                           close(fd, (err) => {
                               console.log('Wrote %d bytes to %s', bytesOut, basename(toFile));
                           });
                       });
                   });
               });
           });
       })
    });
}

const scriptFilePath = fileURLToPath(import.meta.url);
const scriptFileName = basename(scriptFilePath, extname(scriptFilePath));
const outputFilePath = join(dirname(scriptFilePath), scriptFileName + '-copy.txt');

copyfile(scriptFilePath, outputFilePath);
