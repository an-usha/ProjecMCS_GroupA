const express = require("express");
const router = express.Router();

const {
  createUser,
  updateUser,
  verifyUser,
  deleteUser,
  getAllUsers,
  createUserList
} = require("../controller/userInfoController");

// Use POST for creating a new user
router.post("/createUser", createUser);

router.post("/createUserList", createUserList)

// Use PUT for updating an existing user
router.put("/updateUser", updateUser);

// Use GET for verifying a user
router.get("/verifyUser", verifyUser);

// Use DELETE for removing a user
router.delete("/deleteUser", deleteUser);

// Use GET for retrieving all users
router.get("/getAllUsers", getAllUsers);

module.exports = router;
