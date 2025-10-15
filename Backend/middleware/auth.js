const jwt = require("jsonwebtoken");
const { pool } = require("../config/mysqldatabase");

const checkAPIKey = (req, res, next) => {
  const { APIKey } = req.query;
  if (APIKey) {
    if (APIKey === "ABC123") {
      next();
    } else {
      return res.status(400).json({ message: "Invalid API Key" });
    }
  } else {
    return res.status(400).json({ message: "Missing API Key" });
  }
};

//To check the validity of access token
const verifyToken = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    //console.log("Token " + token);
    let [tokenCount,fieldTokenCount]=await pool.execute(`select count(*) tokenCount from user_token_list where userToken='${token}'`);
      //console.log(tokenCount[0]);
      if(tokenCount[0].tokenCount !== 1){
        res.status(401).json("Invalid Token provided");
        return;
      }
    await jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).json("Token is not valid" + err);
        console.log(jwt.decode(token).data.Data);
        console.log(err.message);
      } else {
        console.log("Token is valid");
        req.body.token_data = jwt.decode(token).data.Data;
        next();
      }
    });
  } else {
    console.log("Token is invalid or not provided");
    res.status(401).json("Token is not provided");
  }
};

module.exports = { checkAPIKey, verifyToken };
