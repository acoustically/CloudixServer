let logger = require("./logger").logger;

module.exports = (action, req, res) => {
  let token = req.body.token;
  let user_id = req.body.user_id;
  let requestBody = JSON.stringify(req.body).toString();
  logger.log(`action : ${action}`);
  logger.log(`body : ${requestBody}`);
  if (token != "acoustically") {
    logger.log("Error : token is not equal");
    throw new Error("token is not equal");
  }
}
