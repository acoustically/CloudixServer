class Logger {
  constructor() {
    this.fs = require('fs');
  }
  log(string) {
    let log = this._get_current_time() + "\t" + string;
    console.log(log);
    this.fs.appendFile("./log/server_log.txt", log, 'utf8', (err)=> {
      if(err) {
        console.log("file log failed");
      }
    });
  }
  _get_current_time() {
    let date = new Date();
    let time = (date.getDay() + 1) + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + "/" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    return time;
  }
}

let logger = new Logger();
module.exports.logger = logger;
