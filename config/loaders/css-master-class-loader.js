/**
 * Custom CSS Loader for Meeting Scheduler.
 * Vuetify CSS has some global definitions, including it will have side
 * effects on HTMLs outside the Vue app. It is not suitable
 * to be used as sub component or widget.
 *
 * Hence, this loader is created to parse the input CSS and:
 * 1. prepend CSS selectors with MASTER_CLASS
 * 2. prepend keyframe names with `${MASTER_CLASS}-`
 * 3. update animation properties to use the new keyframe name
 * With the above approaches, we can wrap the original css into a scope,
 * including this stylesheet won't affect styles on the rest of the page.
 *
 */
const MASTER_CLASS = 'kloudless-meeting-scheduler';


module.exports = function cssLoader(source) {
  const sourceLines = source.split(/\r?\n|\r(?!\n)/);
  const outputCss = [];

  let isInsideKeyFrame = false;
  sourceLines.forEach((line) => {
    let nextLine;

    if (isInsideKeyFrame) {
      // don't change anything inside keyframe
      nextLine = line;
      if (/^}/.test(line)) {
        // leaving keyframe definition, revert the flag
        isInsideKeyFrame = false;
      }
    } else {
      /* eslint-disable no-lonely-if */
      if (/^\s*[^@/]+(\s*\{|,)$/.test(line)) {
        // if this line is css selector
        if (/^html/.test(line)) {
          // Replace html with master class
          nextLine = line.replace(/^html/, `.${MASTER_CLASS}`);
        } else {
          // For other css selectors, prepend master class to the selector
          nextLine = line.replace(
            /^(\s*)([^@]+)(\s*\{|,)$/,
            (_, p1, p2, p3) => `${p1}.${MASTER_CLASS} ${p2}${p3}`,
          );
        }
      } else if (/^@(-webkit-)?keyframe/.test(line)) {
        // beginning of keyframe definition
        // set flag to true and prepend keyframe name with ${MASTER_CLASS}-
        isInsideKeyFrame = true;
        nextLine = line.replace(/\s([a-z-]+)\s*{$/g, (_, p1) => (
          ` ${MASTER_CLASS}-${p1} {`));
      } else if (/^\s*(-webkit-)?animation/.test(line)) {
        // for animation properties, change name to  ${MASTER_CLASS}-${name}
        nextLine = line.replace(/(-webkit-)?animation: /, match => (
          `${match}${MASTER_CLASS}-`));
      } else {
        nextLine = line;
      }
    }
    outputCss.push(nextLine);
  });
  return outputCss.join('\n');
};
