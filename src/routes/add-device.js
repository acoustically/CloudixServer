let logger = require("../logger").logger;
let Responsor = require("../responsor");
let RDSConnector = require("../rds-connector");
let tokenAuthentication = require("../token-authentication");
let dbError = "database error"

let express = require("express");
let router = express.Router();


router.post("/check.json", (req, res) => {
  let userId = req.body.user_id;
  let serial = req.body.serial;
  let password = req.body.password;
  let body = JSON.stringify(req.body).toString();
  
  let rdsConnector = new RDSConnector();
  sql = `select * from switchs where serial="${serial}"`;
  logger.log(sql);
  rdsConnector.query(sql, (err, result) => {
    if(err) {
      Responsor.sendError(req, res, dbError);
    } else {
      if(result.length == 0) {
        Responsor.sendError(req, res, "device not exist");
      } else { // if result is exist
        if(result[0].password == null) { // if new password is not exist
          if(result[0].original_password == password) { //if password is equal to original password
            logger.log(`Success : ${req.orginalUrl} / ${JSON.stringify(req.body).toString()}`);
            res.json({"response":"success", "isOriginalPasswordDirty":false});
          } else { //if password is not equal
            Responsor.sendError(req, res, "wrong password");
          }
        } else { // if new password is exist
          if(result[0].password == password) { // if password is equal to new password
            logger.log(`Success : ${req.orginalUrl} / ${JSON.stringify(req.body).toString()}`);
            res.json({"response":"success", "isOriginalPasswordDirty":true});
          } else { // if password is not equal to new password
            if(result[0].original_password == password) { //if password is equal to original password
              Responsor.sendError(req, res, "original password is dirty");
            } else { //if password is not equal to new password and original password
              Responsor.sendError(req, res, "wrong password");
            }
          }
        }
      }
    }
  });
});

router.post("/new-password.json", (req, res) => {
  let serial = req.body.serial;
  let password = req.body.password;
  let rdsConnector = new RDSConnector();
  sql = `update switchs set password="${password}" where serial="${serial}"`;
  rdsConnector.query(sql, (err, result) => {
    if(err) {
      Responsor.sendError(req, res, dbError);
    } else {
      Responsor.sendSuccess(req, res);
    }
  });
});

module.exports = router;
