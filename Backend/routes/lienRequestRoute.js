const express=require("express");
const router=express.Router();
const {getLienRequst,
    leinRequstByAccount,
    leinRequstByDate
}=require('../controller/lienRequestController');

router.get("/leinRequstDet",getLienRequst);
router.get("/leinRequstByAccount",leinRequstByAccount);
router.get("/leinRequstByDate",leinRequstByDate);

module.exports = router;