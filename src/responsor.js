let logger = (require("./logger")).logger;

module.exports = class Responsor {
  static sendError(req, res, message) {
    let action = req.originalUrl;
    let body = JSON.stringify(req.body).toString();
    let error = `Error: ${action} / ${body}`;
    logger.log(error);
    logger.log("\t " + message);
    res.json({"response":"error", "message": message});
  }
  static sendSuccess(req, res) {
    let action = req.originalUrl;
    let body = JSON.stringify(req.body).toString();
    let success = `Success: ${action} / ${body}`;
    
    logger.log(success);
    res.json({"response":"success"});
  }
}
