let express = require('express');
let app = express();
let bodyParser = require('body-parser');

let logger = (require('./src/logger')).logger;

let port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.set('json spaces', 40);

let signRouter = require("./src/router/sign-router");
signRouter(app);
let addDeviceRouter = require("./src/router/add-device");
addDeviceRouter(app);


app.listen(port, ()=> {
  logger.log('start server');
});
