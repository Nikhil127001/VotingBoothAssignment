const jwt = require("jsonwebtoken");

const generateAuthToken = (_id,name,boothSt,boothEd, isAdmin, isSuperAdmin) => {
  return jwt.sign(
    {_id,name,boothSt,boothEd, isAdmin, isSuperAdmin},
    process.env.JWT_SECRET_KEY,
    {expiresIn: "7h"}
  );
};
module.exports = generateAuthToken