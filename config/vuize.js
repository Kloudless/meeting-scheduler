/* eslint-disable no-console */
const watch = require('node-watch');
const path = require('path');
const fs = require('fs').promises;
const combine = require('./vuize-combine');

const vueComponentsRoot = path.resolve(__dirname, '../src/view/components/');

/**
 * Asynchronously read vue component script js file and combine it with
 * template and styles under the same folder, generate single file
 * vue component and write it as index.vue.
 * @param {*} filePath script/style/component file full path
 */
async function vuizeScript(filePath) {
  const vueFilename = path.resolve(
    path.dirname(filePath), 'index.vue',
  );
  const data = await fs.readFile(path.resolve(
    path.dirname(filePath), 'index.js',
  ), 'utf-8');
  const result = combine(data, filePath);
  await fs.writeFile(vueFilename, result, 'utf8');
  console.log(`Wrote: ${vueFilename}`);
}

async function deleteVueFile(filePath) {
  await fs.unlink(filePath);
  console.log(`Deleted: ${filePath}`);
}

async function getFiles(folder, match) {
  let result = [];
  const resources = await fs.readdir(folder);
  const promises = resources.map(async (res) => {
    const resPath = path.resolve(folder, res);
    const stat = await fs.stat(resPath);
    if (stat.isDirectory()) {
      const subDirResult = await getFiles(resPath, match);
      result = result.concat(subDirResult);
    } else if (match.test(resPath)) {
      result.push(resPath);
    }
  });
  await Promise.all(promises);
  return result;
}


const vuize = {
  deleteAll: async () => {
    const filePaths = await getFiles(vueComponentsRoot, /\/index.vue$/);
    await Promise.all(filePaths.map(deleteVueFile));
  },
  writeAll: async () => {
    // write .vue files for all components
    const filePaths = await getFiles(vueComponentsRoot, /\/index.js$/);
    await Promise.all(filePaths.map(vuizeScript));
  },

  /**
 * Given a folder, this function watch changes on individual files
 * and automatically combine index.vue files
 */
  watch: () => {
    // watch file changes in components folder and rebuild .vue files
    watch(
      vueComponentsRoot,
      {
        filter: f => !/\.vue$/.test(f),
        recursive: true,
      },
      (evt, filePath) => {
        console.log(`Updated: ${filePath}`);
        vuizeScript(filePath);
      },
    );
  },
};

if (require.main === module) {
  (async function main() {
    await vuize.deleteAll();
    await vuize.writeAll();
  }());
} else {
  module.exports = vuize;
}
