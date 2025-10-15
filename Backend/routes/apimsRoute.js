const express = require("express");
const router = express.Router();

const {
  getDataFromApims,
  getBranchList,
  getDepartmentList,
  getAllEmployees,
  getSingleEmployee,
  getEmployeesFromBranch,
  getEmployeesFromDepartment,
  getEmployeeHOD,
  getEmployeeBM,
  getExecutiveList,
  getAccountBalance,
  getMiniStatement,
  getFullStatement,
  getKYCDetail,
  lienCustomerAccount,
  cardCustomerEnquiry,
  cardBlock,
  getStaffImage,
  validateAccount,
  missedCallListCallCenter,
  fullStatementWithAvailableBalance,
  getAccountDetailsByNameAndSolId
} = require("../controller/apimsController");

router.get("/getData", getDataFromApims);

router.get("/branchList", getBranchList);

router.get("/departmentList", getDepartmentList);

router.get("/employeeList", getAllEmployees);

router.get("/employeeId/:empId", getSingleEmployee);

router.get("/branchEmployeeList/:branchId", getEmployeesFromBranch);

router.get("/deptEmployeeList/:departmentId", getEmployeesFromDepartment);

router.get("/bmEmployeeList", getEmployeeBM);

router.get("/hodEmployeeList", getEmployeeHOD);

router.get("/getExecutiveList", getExecutiveList);

router.get("/checkBalance", getAccountBalance);
router.get("/miniStatement", getMiniStatement);
router.get("/fullStatement", getFullStatement);
router.get("/kycDetail", getKYCDetail);
router.get("/lienCustomerAccount", lienCustomerAccount);
router.get("/cardCustomerEnquiry",cardCustomerEnquiry);
router.get("/cardBlock",cardBlock);
router.get("/getStaffImage",getStaffImage);
router.get("/validateAccount",validateAccount);
router.get("/missedCallList",missedCallListCallCenter);

router.get("/fullStatementWithAvailableBalance",fullStatementWithAvailableBalance);
router.get("/getAccountDetailsByNameAndSolId",getAccountDetailsByNameAndSolId);



module.exports = router;
