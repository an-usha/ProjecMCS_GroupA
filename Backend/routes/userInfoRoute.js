const express = require("express");
const router = express.Router();

const {
  createUser,
  updateUser,
  verifyUser,
  deleteUser,
  getAllUsers
} = require("../controller/userInfoController");

router.get("/createUser", createUser);
router.get("/updateUser", updateUser);
router.get("/verifyUser", verifyUser);
router.get("/deleteUser", deleteUser);
router.get("/getAllUsers", getAllUsers);

module.exports = router;
