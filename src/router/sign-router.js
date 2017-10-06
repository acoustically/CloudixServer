let Responsor = require('../responsor');
let logger = (require('../logger')).logger;
let RDSConnector = require('../rds-connector');
let tokenAuthentication = require('../token-authentication');
let dbError = "database error";
let idAlreadyRegistedError = "id is already registed";
let idNotExistError = "id is not exist";

module.exports = (app) => {
  app.post('/sign-up-id.json', (req, res) => {
    let userId = req.body.id;
   
    let rdsConnector = new RDSConnector();
    sql = `select id from users where id="${userId}";`;
    rdsConnector.query(sql, (err, result) => {
      if(err) {
        Responsor.sendError(req, res, dbError);
      } else {
        if(result.length == 0) {
          Responsor.sendSuccess(req, res);
        } else {
          Responsor.sendError(req, res, idAlreadyRegistedError);
        }
      }
    });
  });

  app.post('/sign-up.json', (req, res) => {
    let userId = req.body.id;
    let password = req.body.password;
 
    let rdsConnector = new RDSConnector();
    sql = `insert into users(id, password) values("${userId}", "${password}")`;
    rdsConnector.query(sql, (err, result) => {
      if(err) {
        Responsor.sendError(req, res, dbError);
        if(err.errno == 1062) {
          Responsor.sendError(req, res, idAlreadyRegistedError);
        } else {
          Responsor.sendError(req, res, dbError);
        }
      } else {
        Responsor.sendSuccess(req, res);
      }
    });
  });

  app.post('/sign-in-id.json', (req, res) => {
    let userId = req.body.id;

    let rdsConnector = new RDSConnector();
    sql = `select id from users where id="${userId}"`;
    rdsConnector.query(sql, (err, result) => {
      if(err) {
        Responsor.sendError(req, res, dbError);
      } else {
        if(result.length == 0) {
          Responsor.sendError(req, res, idNotExistError);
        } else {
          Responsor.sendSuccess(req, res);
        }
      }
    });
  });

  app.post('/sign-in.json', (req, res) => {
    let userId = req.body.id;
    let password = req.body.password;

    let rdsConnector = new RDSConnector();
    sql = `select * from users where id="${userId}" and password="${password}";`;
    rdsConnector.query(sql, (err, result) => {
      if(err) {
        Responsor.sendError(req, res, dbError);
      } else {
        if(result.length == 0) {
          Responsor.sendError(req, res, "password is incorrect");
        } else {
          Responsor.sendSuccess(req, res);
        }
      }
    });
  });
}
