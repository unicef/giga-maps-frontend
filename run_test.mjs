import { execSync } from 'child_process';
import fs from 'fs';
try {
  const result = execSync('npx jest src/@/admin/ui/filters/tests/edit-filterview.test.tsx', { encoding: 'utf8', env: { ...process.env, NODE_ENV: 'test' } });
  fs.writeFileSync('test_err2.txt', result, 'utf8');
} catch (e) {
  fs.writeFileSync('test_err2.txt', String(e.stdout) + '\n\n' + String(e.stderr), 'utf8');
}
