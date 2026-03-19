import { build } from 'vite';
import fs from 'fs';
build().catch(e => {
  let log = 'ERROR MESSAGE: ' + e.message + '\n';
  if (e.errors) {
    for (let err of e.errors) {
      log += '---\n' + err.message + '\n' + err.stack + '\n';
    }
  } else {
    log += e.stack;
  }
  fs.writeFileSync('err.txt', log, 'utf8');
});
