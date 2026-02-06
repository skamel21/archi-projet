import * as fs from 'fs';
import * as path from 'path';

function getAllFiles(dir: string, ext: string): string[] {
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath, ext));
    } else if (entry.name.endsWith(ext)) {
      files.push(fullPath);
    }
  }
  return files;
}

describe('Architecture constraints', () => {
  it('domain layer should not import from infrastructure', () => {
    const domainDir = path.join(__dirname, '../src/domain');
    const files = getAllFiles(domainDir, '.ts');

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      expect(content).not.toMatch(/from ['"].*infrastructure/);
      expect(content).not.toMatch(/require\(['"].*infrastructure/);
    }
  });

  it('domain layer should not import from interface', () => {
    const domainDir = path.join(__dirname, '../src/domain');
    const files = getAllFiles(domainDir, '.ts');

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      expect(content).not.toMatch(/from ['"].*interface/);
      expect(content).not.toMatch(/require\(['"].*interface/);
    }
  });

  it('domain layer should not import express or database libraries', () => {
    const domainDir = path.join(__dirname, '../src/domain');
    const files = getAllFiles(domainDir, '.ts');

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      expect(content).not.toMatch(/from ['"]express['"]/);
      expect(content).not.toMatch(/from ['"]better-sqlite3['"]/);
      expect(content).not.toMatch(/from ['"]mysql2/);
      expect(content).not.toMatch(/from ['"]sqlite3['"]/);
    }
  });

  it('test files should not import sqlite3 or better-sqlite3', () => {
    const testsDir = path.join(__dirname);
    const files = getAllFiles(testsDir, '.ts');

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      expect(content).not.toMatch(/from ['"]sqlite3['"]/);
      expect(content).not.toMatch(/require\(['"]sqlite3['"]\)/);
      expect(content).not.toMatch(/from ['"]better-sqlite3['"]/);
      expect(content).not.toMatch(/require\(['"]better-sqlite3['"]\)/);
    }
  });
});
