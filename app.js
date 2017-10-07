let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let tokenAuthentication = require('./src/token-authentication');
let logger = (require('./src/logger')).logger;
let Responsor = require('./src/responsor');
let port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.set('json spaces', 40);

app.use((req, res, next) => {
  let action = req.originalUrl;
  try {
    tokenAuthentication(action, req, res);
    next();
  } catch(err) {
    Responsor.sendError(res, err.message);
  }
});

app.use("/sign", require("./src/routes/sign.js"));
app.use("/add-device", require("./src/routes/add-device.js"));

app.listen(port, ()=> {
  logger.log('start server');
});
