const {sequelize} = require("../src/models/index");

class AdminMasterService {
  static async getAdminDetailsByEmail(email) {
    try {
      return await sequelize.models.User.findOne({
        where: { email: email }
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AdminMasterService;
