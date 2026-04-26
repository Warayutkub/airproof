import { readFile, access } from 'node:fs/promises';
import { join } from 'node:path';

export default {
  name: 'env-in-git',
  severity: 'critical',
  scope: 'repo',

  async check(rootDir) {
    const issues = [];

    let envExists = false;
    try {
      await access(join(rootDir, '.env'));
      envExists = true;
    } catch {}

    if (!envExists) return issues;

    let gitignoreCovers = false;
    try {
      const gi = await readFile(join(rootDir, '.gitignore'), 'utf-8');
      gitignoreCovers = gi.split('\n').some(line => {
        const t = line.trim();
        return t === '.env' || t === '.env*' || t === '*.env';
      });
    } catch {}

    if (!gitignoreCovers) {
      issues.push({
        rule: 'env-in-git',
        severity: 'critical',
        file: '.env',
        line: 0,
        message: 'พบ .env ในโปรเจกต์ แต่ไม่ถูก ignore โดย .gitignore — secrets อาจรั่วไป git',
        fix: 'เพิ่มบรรทัด `.env` ใน .gitignore + rotate secrets ถ้าเคย commit แล้ว',
      });
    }

    return issues;
  },
};
