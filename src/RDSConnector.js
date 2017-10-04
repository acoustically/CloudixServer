module.exports = class RDSConnector {
  constructor() {
    let mysql = require('mysql');
    this.logger = require('./logger').logger;
    this.connector = mysql.createConnection({
      host: "cloudix.crsnodt9hkzk.ap-northeast-2.rds.amazonaws.com",
      user: "acoustically",
      password: "CLsung1031!",
      database: "Cloudix",
    });
  }
  
  query(sql, callback) {
    this.connector.connect((err) => {
      if (err) {
        this.logger.log("Error : RDS connect error");
      } else {
        this.logger.log("Success : RDS connected");
        this.logger.log("Query : " + sql);
        this.connector.query(sql, (err, res) => {
          if (err) {
            this.logger.log("Error : database query error");
            let json = JSON.stringify(err);
            this.logger.log(json);
            callback(err, null);
          } else {
            this.logger.log("Success : database query result : ");
            let json = JSON.stringify(res);
            this.logger.log(json);
            callback(null, res);
          }
        });
      }
    });

  }
}

