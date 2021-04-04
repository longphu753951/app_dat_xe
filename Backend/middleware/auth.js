require('dotenv').config();
const jwt = require('jsonwebtoken');
const api_key = process.env.API_KEY;

module.exports = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      const error = new Error("Authorization header is missing Bearer token");
      error.statusCode = 401;
      throw error;
    }
  
    try {
      const token = authHeader;
      const decodedToken = jwt.verify(token, api_key);
    } catch (err) {
      err.statusCode = 401;
      throw err;
    }
    next();
  };