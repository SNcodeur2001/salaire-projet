"use strict";
const bcrypt = require('bcryptjs');
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};
module.exports = hashPassword;
//# sourceMappingURL=hash.js.map