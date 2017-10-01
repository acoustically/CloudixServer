let express = require('express');
let app = express();

let port = 3000;
let logger = (require('./src/logger')).logger;

app.listen(port, ()=> {
  logger.log(`start server\n`);
});
