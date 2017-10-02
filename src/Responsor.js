module.exports = class Responsor {
  static sendError(res, message) {
    res.json({"response":"error", "message": message});
  }
  static sendSuccess(res) {
    res.json({"response":"success"});
  }
}
