const { exec } = require('child_process');
const { resolve, basename, dirname, extname, join } = require('path');
const { cwd } = require('process');
const { readdir, writeFile, copyFile } = require('fs').promises;

const args = process.argv;

let outputPath = '..';
if (args && args.length > 2) {
  outputPath = args[2];
}

const allowedFileTypes = ['.js', '.ts'];

async function getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map(dirent => {
      const res = resolve(dir, dirent.name);

      return dirent.isDirectory() ? getFiles(res) : res.replace(cwd() + '/dist/', '');
    })
  );
  return Array.prototype.concat(...files);
}

async function writeExportFiles(filePath) {
  const getExportEntry = fileName => `export * from './${fileName.replace('.d.ts', '')}';`;

  if (dirname(filePath) === '.') {
    return;
  }

  await writeFile(resolve('dist', basename(filePath)), getExportEntry(filePath));
}

async function buildPackage() {
  const files = await getFiles('dist');

  for (const file of files.filter(x => allowedFileTypes.includes(extname(x)))) {
    await writeExportFiles(file);
  }

  await copyFile('package.json', join('dist', 'package.json'));
  await copyFile('npm.md', join('dist', 'README.md'));
  exec(
    `npm pack --pack-destination ${outputPath}`,
    {
      cwd: resolve('dist')
    },
    (err, stdout, stderr) => {
      console.log(stdout);

      if (err) {
        console.error(stderr);
      }
    }
  );
}

buildPackage().then(() => console.log('Built package'));
