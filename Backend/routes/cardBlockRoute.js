const express = require("express");
const router = express.Router();

const {
  getBlockCardDetail,
  getBlockCardDetByAcc,
  getBlockCardDetByMobile,
  getBlockCardDetByDate
} = require("../controller/cardBlockController");

router.get("/blockCardDet", getBlockCardDetail);

router.get("/blockCardDetByAcc", getBlockCardDetByAcc);

router.get("/blockCardDetByMob", getBlockCardDetByMobile);

router.get("/blockCardDetByDate", getBlockCardDetByDate);

module.exports = router;
