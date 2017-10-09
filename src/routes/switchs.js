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

router.post("/new-users-switchs.json", async (req, res) => {
  let serial = req.body.serial;
  let userId = req.body.user_id;
  let buttons = req.body.buttons;
  let rdsConnector = new RDSConnector();
  let sql = `insert into users_switchs(switch_serial, user_id) values("${serial}", "${userId}")`;
  let error = false;
  try { // insert users_switchs
    let rdsConnector = new RDSConnector();
    await rdsConnector.asyncQuery(sql);
    for (let button of buttons) {
      let position = button.position;
      let name = button.name;
      try { // insert button
        let rdsConnector = new RDSConnector();
        let sql = `insert into switch_buttons(switch_serial, user_id, position, name) values("${serial}", "${userId}", ${position}, "${name}")`;
        await rdsConnector.asyncQuery(sql);
      } catch (err) {
        Responsor.sendError(req, res, "database error");
        return;
      }
    }
    Responsor.sendSuccess(req, res);
  } catch(err) { // error is occurred in insert users_switchs;
    if(err.errno = 1062) { // if users_switchs is exist
      for (let button of buttons) {
        let position = button.position;
        let name = button.name;
        try { // insert buttons
          let rdsConnector = new RDSConnector();
          let sql = `insert into switch_buttons(switch_serial, user_id, position, name) values("${serial}", "${userId}", ${position}, "${name}")`;
          await rdsConnector.asyncQuery(sql);
        } catch (err1) { // error is occurred in insert button
          if(err1.errno == 1062) { // if button is exist
            try { // modify button
              let rdsConnector = new RDSConnector();
              let sql = `update switch_buttons set name="${name}" where switch_serial="${serial}" and user_id="${userId}" and position=${position}`;
              await rdsConnector.asyncQuery(sql);
            } catch (err2) { // error is occurred in modify button
              Responsor.sendError(req, res, "database error");
              return;
            }
          } else { 
            Responsor.sendError(req, res, "database error");
            return;
          }
        }
      }
      Responsor.sendSuccess(req, res);
    } else {
      Responsor.sendError(req, res, "database error");
      return;
    }    
  }
});

router.post("/all.json", (req, res) => {
  let userId = req.body.user_id;
  let sql = `select switch_serial, position, name from switch_buttons where user_id="${userId}"`;
  let connector = new RDSConnector();
  connector.query(sql, (err, result) => {
    if(err) {
      Responsor.sendError(req, res, err.errno);
    } else {
      res.json(result);
    }
  });
});


module.exports = router;



















