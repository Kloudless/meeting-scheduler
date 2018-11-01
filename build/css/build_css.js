/**
 * Parse css files we use and generate new css file for meeting scheduler.
 * Vuetify CSS has some global definitions, including it will have side
 * effects on HTMLs outside the Vue app. It is not suitable
 * to be used as sub component or widget.
 *
 * Hence, this script is created to parse the CSS file and:
 * 1. prepend CSS selectors with MASTER_CLASS
 * 2. prepend keyframe names with `${MASTER_CLASS}-`
 * 3. update animation properties to use the new keyframe name
 * With the above approaches, we can wrap the original css into a scope,
 * including this stylesheet won't affect styles on the rest of the page.
 *
 * Minimization will be handled by webpack.
 */
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const MASTER_CLASS = 'kloudless-meeting-scheduler';
const sources = [
  path.resolve(__dirname, './roboto.css'),
  path.resolve(__dirname, '../../node_modules/vuetify/dist/vuetify.css'),
  path.resolve(
    __dirname,
    '../../node_modules/material-design-icons-iconfont/' +
    'dist/material-design-icons.css',
  ),
];

const outputCss = [];

function parseCssFile(filePath) {
  const stream = fs.createReadStream(filePath, 'utf8');

  const lineReader = readline.createInterface({
    input: stream,
  });
  let isInsideKeyFrame = false;

  lineReader.on('line', (line) => {
    let nextLine;

    if (isInsideKeyFrame) {
      // don't change anything inside keyframe
      nextLine = line;
      if (line.search(/^}/) === 0 ) {
        // leaving keyframe definition, revert the flag
        isInsideKeyFrame = false;
      }
    } else {
      /* eslint-disable no-lonely-if */
      if (line.search(/^\s*[^@/]+(\s*\{|,)$/) === 0) {
        // if this line is css selector
        if (line.search(/^html/) === 0) {
          // Replace html with master class
          nextLine = line.replace(/^html/, `.${MASTER_CLASS}`);
        } else {
          // For other css selectors, prepend master class to the selector
          nextLine = line.replace(
            /^(\s*)([^@]+)(\s*\{|,)$/,
            (_, p1, p2, p3) => `${p1}.${MASTER_CLASS} ${p2}${p3}`,
          );
        }
      } else if (line.search(/^@(-webkit-)?keyframe/) === 0) {
        // beginning of keyframe definition
        // set flag to true and prepend keyframe name with ${MASTER_CLASS}-
        isInsideKeyFrame = true;
        nextLine = line.replace(/\s([a-z-]+)\s*{$/g, (_, p1) =>
          ` ${MASTER_CLASS}-${p1} {`);
      } else if (line.search(/^\s*(-webkit-)?animation/) === 0) {
        // for animation properties, change name to  ${MASTER_CLASS}-${name}
        nextLine = line.replace(/(-webkit-)?animation: /, match =>
          `${match}${MASTER_CLASS}-`);
      } else {
        nextLine = line;
      }
    }
    outputCss.push(nextLine);
  });

  lineReader.on('close', () => {
    sources.shift();
    if (sources.length > 0) {
      parseCssFile(sources[0]);
    } else {
      fs.writeFileSync(
        path.resolve(__dirname, './MeetingScheduler.css'),
        outputCss.join('\n'),
        'utf8',
      );
    }
  });
}
parseCssFile(sources[0]);
