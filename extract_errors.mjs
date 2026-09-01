import fs from 'fs';
const text = fs.readFileSync('test_err4.txt', 'utf8');
const lines = text.split('\n');
const errors = new Map();
let currentError = [];
let currentTest = null;
let inError = false;

for (let line of lines) {
  if (line.includes(' FAIL ')) {
    currentTest = line.trim();
  }
  if (line.includes('● ')) {
    currentError = [];
    inError = true;
  }
  if (inError) {
    currentError.push(line.replace(/\x1b\[[0-9;]*m/g, '').trim());
    if (line.trim() === '' && currentError.length > 3) {
      inError = false;
      const msg = currentError.slice(1, 4).join(' ').trim();
      const count = errors.get(msg) || [];
      errors.set(msg, [...count, currentTest]);
    }
  }
}

let out = '';
for (const [msg, tests] of errors.entries()) {
  out += `\nERROR: ${msg}\nAPPEARS IN: ${tests.length} tests.\nEXAMPLES:\n  ${tests.slice(0, 5).join('\n  ')}\n`;
}
fs.writeFileSync('summary.txt', out);
