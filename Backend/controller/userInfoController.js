const UserInfo = require("../model/userInfo");

const { pool } = require("../config/mysqldatabase");
const { formattedDateTime } = require("../config/currentDate");

const createUser = async (req, res) => {
  const sql = `insert into user_info (staffName,username,password,createdOn,createdBy,createdByName)
            values (?,?,?,?,?,?)`;
  let currentDate = formattedDateTime(new Date());
  try {
    const [rows, feilds] = await pool.execute(sql, [
      req.query.staffName,
      req.query.userName,
      req.query.password,
      currentDate,
      req.body.token_data.domainUserName,
      req.body.token_data.employeeName,
    ]);
    if (rows.affectedRows === 1) {
      res.status(200).json({ status: true, message: "success" });
    } else {
      res.status(200).json({ status: false, message: "failed}" });
    }
  } catch (error) {
    console.log("Error while creating user for call center application ");
    res.status(200).json({ status: false, message: "failed", error: error });
  }
};

const updateUser = async (req, res) => {
  const sql = `update 
	        user_info set staffName=?,password=?,
	        createdOn=?,createdBy=?,createdByName=? where id=?`;
  let currentDate = formattedDateTime(new Date());
  try {
    const [rows, feilds] = await pool.execute(sql, [
      req.query.staffName,
      req.query.password,
      currentDate,
      req.body.token_data.domainUserName,
      req.body.token_data.employeeName,
      req.query.id,
    ]);
    if (rows.affectedRows === 1) {
      res.status(200).json({ status: true, message: "success" });
    } else {
      res.status(200).json({ status: false, message: "failed" });
    }
  } catch (error) {
    console.error("Error while updating user password", error);
    res.status(200).json({ status: false, message: "failed", error: error });
  }
};

const verifyUser = async (req, res) => {
  const sql = `select staffName, username, password from user_info where isActive='Y' and username=? and password=?`;
  try {
    const [rows, feilds] = await pool.execute(sql, [
      req.query.userName,
      req.query.password,
    ]);
    if (rows.length === 1) {
      res.status(200).json({ status: true, message: "success" });
    } else {
      res.status(200).json({ status: false, message: "failed" });
    }
  } catch (error) {
    console.error("Error while validating user during log in " + error);
    res.status(200).json({ status: false, message: "failed", error: error });
  }
};

// const verifyUserLocal = async (username, password) => {
//   const sql = `select staffName,username,password from user_info where isActive='Y' and username=? and password=?`;
//   try {
//     const [rows, feilds] = await pool.execute(sql, [
//       username,
//       password,
//     ]);
//     if (rows.length === 1) {
//        return ({
//         "Code":"0",
//         "Message": "Operation Successfull",
//         "Data":{
//         'employeeName':staffName,'domainUserName':username}});
//     } else {
//       return false;
//     }
//   } catch (error) {
//     return false;
//   }
// };

const verifyUserLocal = (username, password) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT staffName, username, password FROM user_info WHERE isActive='Y' AND username=? AND password=?`;
      pool.execute(sql, [username, password])
        .then(([rows, fields]) => {
          if (rows.length === 1) {
            resolve({
              Code: "0",
              Message: "Operation Successful",
              Data: {
                employeeName: rows[0].staffName,
                domainUserName: username
              }
            });
          } else {
            resolve(false);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  


const deleteUser = async (req, res) => {
  const sql = `update user_info set isActive='N' where id=? and isActive='Y'`;
  try {
    const [rows, feilds] = await pool.execute(sql, [req.query.id]);
    if (rows.affectedRows === 1) {
      res.status(200).json({ status: true, message: "success" });
    } else {
      res.status(200).json({ status: false, message: "failed" });
    }
  } catch (error) {
    console.error("Error while deleting user login detail " + error);
    res.status(200).json({ status: false, message: "failed", error: error });
  }
};

const getAllUsers = async (req,res) =>{
  const sql =`select * from user_info `;
  try{
      const [rows,feilds] = await pool.execute(sql);
      if(rows.length ===0){
        res.status(200).json({'status':true,'message':'success','data':''});
      }else{
        res.status(200).json({'status':true,'message':'success','data':rows});
      }
  }catch(error){
    console.error("Error while fetching user list of call center "+error);
    res.status(200).json({status:false,'message':'failed','error':error});
  }
}

module.exports = {
  createUser,
  updateUser,
  verifyUser,
  verifyUserLocal,
  deleteUser,
  getAllUsers,
};
