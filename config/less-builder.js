/**
 * Build the less file for recompiling in browser when customStyleVars is used.
 * The purpose is to merge less files into one less file, and apply postcss
 * beforehand, since we can't apply postcss in browser. In production build,
 * minification will also be applied.
 *
 * Usage:
 * For development, call watch() function for hot reload support
 * For deployment, use command line node less-builder.js {output_file_path}
 *
 * Note that this output less file is only used to handle customStyleVars in
 * browser, the default css files for this project are still handled by webpack.
 */

/* eslint-disable no-console */
const watch = require('node-watch');
const fs = require('fs');
const readline = require('readline');
const path = require('path');
const postcss = require('postcss');
const postcssLessSyntax = require('postcss-less');
const getPostCssPlugins = require('./post-css-plugins');

const LESS_FOLDER_PATH = path.resolve(__dirname, '../src/view/less/');
const LESS_INDEX_PATH = path.resolve(LESS_FOLDER_PATH, 'index.less');

// TODO: minimize breaks font variables, disable it for now
const IS_PRODUCTION = false; // process.env.NODE_ENV === 'production';

/**
 * Read a less file and handle "@import" syntax to read more less files.
 *
 * @param {string} filePath input less file path
 * @param {object} loadedFiles
 *   a map to record if a file has been imported before, in format of
 *   {[filePath]: true}
 * @returns
 *   a string that is the content of the input file, while all import
 *   calls has been replaced with actual contents of the import file
 *
 * TODO: Ideally it should done by using fs.WriteStream instead of array,
 * but the file sizes are too small to make a difference at this point
 */
async function doCombine(filePath, loadedFiles) {
  const readStream = fs.createReadStream(filePath);
  const lineReader = readline.createInterface({
    input: readStream,
  });
  const contents = [];
  const processFilePromise = new Promise((resolve, reject) => {
    lineReader.on('line', (line) => { contents.push(line); });
    lineReader.on('close', () => {
      readStream.close();
      resolve();
    });
    lineReader.on('error', () => {
      readStream.close();
      reject();
    });
  });
  await processFilePromise;
  /** handle @import
   * Read import files and replace @import with actual file content.
   * Assume the syntax is always @import '[filepath]';
   */
  const regExp = /^@import ['"]([^'"]+)['"];$/;
  const currentFileDir = path.dirname(filePath);
  for (let index = 0; index < contents.length; index += 1) {
    if (regExp.test(contents[index])) {
      const importFilePath = path.resolve(
        currentFileDir,
        contents[index].replace(
          regExp,
          (match, p1) => p1,
        ),
      );
      if (!loadedFiles[importFilePath]) {
        loadedFiles[importFilePath] = true;
        // Join files synchronously to prevent from importing the
        // same file multiple times.
        /* eslint-disable-next-line no-await-in-loop */
        contents[index] = await doCombine(importFilePath, loadedFiles);
      } else {
        contents[index] = '';
      }
    }
  }
  return contents.join('\n');
}

const lessBuilder = {
  async delete(filePath) {
    try {
      await fs.promises.unlink(filePath);
      console.log(`Deleted: ${filePath}`);
    } catch (e) {
      // It's fine if there is no previous build
    }
  },
  /**
   * Merge less files into one single less file and apply postcss for browser
   * less.js to build custom styles.
   * @param {String} outputPath output file path
   */
  async combine(outputPath) {
    const source = await doCombine(LESS_INDEX_PATH, {});
    const result = await postcss(
      getPostCssPlugins(IS_PRODUCTION, false),
    ).process(
      source,
      { syntax: postcssLessSyntax, from: undefined },
    );
    await fs.promises.writeFile(outputPath, result.content, 'utf-8');
    console.log(`Wrote: ${outputPath}`);
  },
  /**
   * Watch less file changes and build the less file for browser less
   * @param {String} outputPath output file path
   */
  watch(outputPath) {
    watch(
      LESS_FOLDER_PATH,
      {
        filter: /\.less$/,
        recursive: true,
      },
      (evt, filePath) => {
        console.log(`Updated: ${filePath}`);
        lessBuilder.combine(outputPath);
      },
    );
  },
};

if (require.main === module) {
  (async function main() {
    // see top comment for command line usage
    await lessBuilder.delete(process.argv[2]);
    await lessBuilder.combine(process.argv[2]);
  }());
} else {
  module.exports = lessBuilder;
}
