/* eslint-disable no-console */
/** An express server to serve project root to test dist build
 * bind to port 8080 and 8081
 */
const express = require('express');
const path = require('path');

const app = express();


app.use(express.static(path.resolve(__dirname, '../')));
app.listen(8081);
app.listen(8080, () => {
  console.log('Dist-test server running on http://localhost:8080/test/dist/');
});
