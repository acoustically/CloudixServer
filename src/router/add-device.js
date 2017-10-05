let logger = require("../logger").logger;
let Responsor = require("../responsor");
let RDSConnector = require("../rds-connector");
let tokenAuthentication = require("./token-authentication");
let dbError = "database error"


module.exports = (app) => {
  app.post("/check-device.json", (req, res) => {
    try {
      tokenAuthentication('/sign-up-id.json', req, res);
    } catch (err) {
      Responsor.sendError(res, err.message);
      return;
    }

    let userId = req.body.user_id;
    let serial = req.body.serial;
    let password = req.body.password;
    let body = JSON.stringify(req.body).toString();
    let error = `Error: check device / ${body};
    let success = `Success: check device / ${body};
    
    let rdsConnector = new RDSConnector();
    sql = `select * from switchs where serial="${serial}"`;
    logger.log(sql);
    rdsConnector.query(sql, (err, result) => {
      if(err) {
        logger.log(error);
        logger.log("\t" + dbError);
        Responsor.sendError(res, dbError);
      } else {
        if(result.length == 0) {
          logger.log(error);
          logger.log("\t " + "device not exist");
          Responsor.sendError(res, "device not exist");
        } else { // if result is exist
          if(result[0].password == null) { // if new password is not exist
            if(result[0].original_password == password) { //if password is equal to original password
              logger.log(success);
              res.json({"response":"success", "isOriginalPasswordDirty":false});
            } else { //if password is not equal
              logger.log(error);
              logger.log("\t wrong password");
              Responsor.sendError(res, "wrong password");
            }
          } else { // if new password is exist
            if(result[0].password == password) { // if password is equal to new password
              logger.log(success);
              res.json({"response":"success", "isOriginalPasswordDirty":true});
            } else { // if password is not equal to new password
              if(result[0].original_password == password) { //if password is equal to original password
                logger.log(error);
                logger.log("\t original password is dirty");
                Responsor.sendError(res, "original password is dirty");
              } else { //if password is not equal to new password and original password
                logger.log(error);
                logger.log("\t wrong password");
                Responsor.sendError(res, "wrong password");
              }
            }
          }
        }
      }
    });
  });
}
