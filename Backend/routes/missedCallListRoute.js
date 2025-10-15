const express = require("express");
const router = express.Router();

const {
    getMissedCallListAll,
    getMissedCallListByDate,
    deleteMissedCallRecord,
    provideRemarksMissedCall,
}=require("../controller/missedCallListController");

router.get("/getMissedCallListAll",getMissedCallListAll);
router.get("/getMissedCallListByDate",getMissedCallListByDate);
router.get("/deleteMissedCallRecord",deleteMissedCallRecord);
router.get("/provideRemarksMissedCall",provideRemarksMissedCall);

module.exports = router;