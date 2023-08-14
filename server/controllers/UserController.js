const AdminMasterService = require("../services/AdminMasterService");
const Util = require("../Utils");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const util = new Util();

class UserController {
  static async adminLogin(req, res) {
    if (!req.body.email || !req.body.password) {
      util.setError(400, "Please provide complete details");
      return util.send(res);
    }
    const getAdminDetails = await AdminMasterService.getAdminDetailsByEmail(
      req.body.email
    );
    if (getAdminDetails) {
      console.log(getAdminDetails.password);
      bcrypt
        .compare(req.body.password, getAdminDetails.password)
        .then(match => {
          if (match) {
            const payload = {
              username: getAdminDetails.username,
              full_name: getAdminDetails.full_name,
              id: getAdminDetails.id
            };
            const options = { expiresIn: "2d" };
            const secret = process.env.JWT_SECRET;
            const token = jwt.sign(payload, secret, options);
            const response = {};
            response.token = token;
            response.result = getAdminDetails;
            util.setSuccess(200, "logged in successfully", response);
          } else {
            util.setError(401, `Authentication error`);
          }
          return util.send(res);
        });
    } else {
      util.setError(
        404,
        `Cannot find user with the username: ${req.body.username}`
      );
    }
  }
}


module.exports = UserController;
