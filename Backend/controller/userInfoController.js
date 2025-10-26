const { pool } = require("../config/mysqldatabase");
const { formattedDateTime } = require("../config/currentDate");

const createUser = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      gender,
      phonenumber,
      email,
      department,
      created_by
    } = req.body;

    console.log(JSON.stringify(req.body),"here data");
    console.log(JSON.stringify(req.body),"here data");
    console.log(JSON.stringify(req.body),"here data");
    

    // Validate required fields
    if (!first_name || !last_name || !phonenumber || !email || !department || !created_by) {
      return res.status(400).json({
        status: false,
        message: "Missing required fields. first_name, last_name, phonenumber, emailid, department, created_by are required."
      });
    }

    // Step 1: Get userId from userlist by emailid (optional)
    let userId = null;
    const [userRows] = await pool.execute(
      "SELECT id FROM userlist WHERE email = ?",
      [email]
    );

    if (userRows.length > 0) {
      userId = userRows[0].id;
    }

    // Step 2: Insert into userdetails
    const sql = `
      INSERT INTO userdetails
      (userid, first_name, last_name, gender, phonenumber, emailid, department, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [rows] = await pool.execute(sql, [
      userId,
      first_name,
      last_name,
      gender,
      phonenumber,
      email,
      department,
      created_by
    ]);

    if (rows.affectedRows === 1) {
      res.status(201).json({
        status: true,
        message: "User details created successfully",
        userdetailId: rows.insertId
      });
    } else {
      res.status(400).json({ status: false, message: "Failed to create user details" });
    }
  } catch (error) {
    console.error("Error while creating user details:", error);
    res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
};


const createUserList = async (req, res) => {
  try {
    const { fullname, emailid } = req.body;

    if (!fullname || !emailid) {
      return res.status(400).json({ status: false, message: "fullname and emailid are required" });
    }

    // Step 1: Check if user already exists
    const [existingUsers] = await pool.execute(
      "SELECT id FROM userlist WHERE emailid = ?",
      [emailid]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ status: false, message: "User already exists" });
    }

    // Step 2: Insert new user
    const sql = `
      INSERT INTO userlist (fullname, emailid)
      VALUES (?, ?)
    `;
    const [result] = await pool.execute(sql, [fullname, emailid]);

    if (result.affectedRows === 1) {
      res.status(201).json({ status: true, message: "User added successfully", userId: result.insertId });
    } else {
      res.status(500).json({ status: false, message: "Failed to add user" });
    }
  } catch (error) {
    console.error("Error adding user to userlist:", error);
    res.status(500).json({ status: false, message: "Server error", error: error.message });
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
  const sql =`select * from userdetails `;
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
  deleteUser,
  getAllUsers,
  createUserList
};
