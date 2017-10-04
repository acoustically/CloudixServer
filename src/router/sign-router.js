let Responsor = require('../responsor');
let logger = (require('../logger')).logger;
let RDSConnector = require('../rds-connector');
let tokenAuthentication = require('./token-authentication');
let dbError = "database error";
let idAlreadyRegistedError = "id is already registed";
let idNotExistError = "id is not exist";

module.exports = (app) => {
  app.post('/sign-up-id.json', (req, res) => {
    try {
      tokenAuthentication('/sign-up-id.json', req, res);
    } catch (err) {
      Responsor.sendError(res, err.message);
      return;
    }

    let userId = req.body.id;
    let error = "Error : sign up id \t id : " + userId;
    let success = "Success : sign up id \t id : " + userId;
   
    let rdsConnector = new RDSConnector();
    sql = "select id from users where id=" + "\"" + userId + "\"" + ";";
    rdsConnector.query(sql, (err, result) => {
      if(err) {
        logger.log(error);
        logger.log("\t" + dbError);
        Responsor.sendError(res, dbError);
      } else {
        if(result.length == 0) {
          logger.log(success);
          Responsor.sendSuccess(res);
        } else {
          logger.log(error);
          logger.log("\t" + idAlreadyRegistedError);
          Responsor.sendError(res, idAlreadyRegistedError);
        }
      }
    });
  });

  app.post('/sign-up.json', (req, res) => {
    try {
      tokenAuthentication('/sign-up.json', req, res);
    } catch (err) {
      Responsor.sendError(res, err.message);
      return;
    }

    let userId = req.body.id;
    let password = req.body.password;
    let error = "Error : sign up \t id : " + userId + " password : "  + password;
    let success = "Success : sign up \t id : " + userId + " password : "  + password;

    let rdsConnector = new RDSConnector();
    //sql = "select * from users where id=" + "\"" + userId + "\"" + ";";
    sql = "insert into users(id, password) values(" + "\"" + userId + "\", \"" + password + "\");";
    rdsConnector.query(sql, (err, result) => {
      if(err) {
        logger.log(error);
        if(err.errno == 1062) {
          logger.log("\t" + idAlreadyRegistedError);
          Responsor.sendError(res, idAlreadyRegistedError);
        } else {
          logger.log("\t" + dbError);
          Responsor.sendError(res, dbError);
        }
      } else {
        logger.log(success);
        Responsor.sendSuccess(res);
      }
    });
  });

  app.post('/sign-in-id.json', (req, res) => {
    try {
      tokenAuthentication('/sign-in-id.json', req, res);
    } catch (err) {
      Responsor.sendError(res, err.message);
      return;
    }

    let userId = req.body.id;
    let error = "Error : sign in id \t id : " + userId;
    let success = "Success : sign in id \t id : " + userId;

    let rdsConnector = new RDSConnector();
    sql = "select id from users where id=" + "\"" + userId + "\"" + ";";
    rdsConnector.query(sql, (err, result) => {
      if(err) {
        logger.log(error);
        logger.log("\t" + dbError);
        Responsor.sendError(res, dbError);
      } else {
        if(result.length == 0) {
          logger.log(error);
          logger.log("\t" + idNotExistError);
          Responsor.sendError(res, idNotExistError);
        } else {
          logger.log(success);
          Responsor.sendSuccess(res);
        }
      }
    });
  });

  app.post('/sign-in.json', (req, res) => {
    try {
      tokenAuthentication('/sign-in.json', req, res);
    } catch (err) {
      Responsor.sendError(res, err.message);
      return;
    }

    let userId = req.body.id;
    let password = req.body.password;
    let error = "Error : sign in \t id : " + userId + ", password : " + password;
    let success = "Success : sign in \t id : " + userId + ", password : " + password;

    let rdsConnector = new RDSConnector();
    sql = "select * from users where id=" + "\"" + userId + "\"" + "and password=\"" + password + "\";";
    rdsConnector.query(sql, (err, result) => {
      if(err) {
        logger.log(error);
        logger.log("\t" + dbError);
        Responsor.sendError(res, dbError);
      } else {
        if(result.length == 0) {
          logger.log(error);
          logger.log("\t" + idNotExistError);
          Responsor.sendError(res, idNotExistError);
        } else {
          logger.log(success);
          Responsor.sendSuccess(res);
        }
      }
    });
  });
}
