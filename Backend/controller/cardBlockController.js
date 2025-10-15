const CardBlockDetails = require("../model/cardBlockDetail");
const { pool } = require("../config/mysqldatabase");
const { formattedDateTime } = require("../config/currentDate");

const saveBlockCardDetail = async (customerDetail) => {
  let cardBlockDetail = new CardBlockDetails();
  cardBlockDetail = customerDetail;
  console.log(cardBlockDetail);
  let currentDate = formattedDateTime(new Date());
  const sql = `insert into card_block_detail 
    (accountNumber, mobileNumber,customerName,cardHolderName,
        cardNumber,cardType,cardStatus,createdBy,createdByName,createdOn)
        values (?,?,?,?,?,?,?,?,?,?)`;
  try {
    const [rows, fields] = await pool.execute(sql, [
      cardBlockDetail.accountNumber,
      cardBlockDetail.mobileNumber,
      cardBlockDetail.customerName,
      cardBlockDetail.cardHolderName,
      cardBlockDetail.cardNumber,
      cardBlockDetail.cardType,
      cardBlockDetail.cardStatus,
      cardBlockDetail.createdBy,
      cardBlockDetail.createdByName,
      currentDate,
    ]);
  } catch (error) {
    console.error("Error while inserting log for block card request " + error);
  }
};

const getBlockCardDetail = async (req, res) => {
  const sql = `select * from card_block_detail where isDeleted='F' order by id desc`;
  try {
    const [rows, fields] = await pool.execute(sql);
    if (rows.length === 0) {
      res
        .status(200)
        .json({ status: false, message: "failed", data: []});
    } else {
      res.status(200).json({ status: true, message: "success", data: rows });
    }
  } catch (error) {
    console.error("Error while fetching card block detail " + error);
    res.status(200).json({ status: false, message: "failed", error: error });
  }
};

const getBlockCardDetByAcc = async (req, res) => {
  const accountNumber = req.query.accountNumber;
  const sql = `select * from card_block_detail where isDeleted='F' and accountNumber=? order by id desc`;
  try {
    const [rows, feilds] = await pool.execute(sql, [accountNumber]);
    if (rows.length === 0) {
      res
        .status(200)
        .json({ status: false, message: "success", data: [] });
    } else {
      res.status(200).json({ status: true, message: "success", data: rows });
    }
  } catch (error) {
    console.error(
      "Error while fetching card block details by account number " + error
    );
    res.status(200).json({ status: false, message: "failed", error: error });
  }
};

const getBlockCardDetByDate = async (req, res) => {
  const fromDate = req.query.fromDate;
  const toDate = req.query.toDate;
  sql = `select * from card_block_detail where isDeleted='F' and 
                    cast(createdOn as date) between ? and ? order by id desc`;
  try {
    [rows, feilds] = await pool.execute(sql, [fromDate, toDate]);

    if (rows.length === 0) {
      res
        .status(200)
        .json({ status: false, message: "failed", data: [] });
    } else {
      res.status(200).json({ status: true, message: "success", data: rows });
    }
  } catch (error) {
    console.error("Error while fetching card block details by date " + error);
    res.status(200).json({ status: false, message: "failed", error: error });
  }
};

const getBlockCardDetByMobile = async (req, res) => {
  const mobileNo = req.query.mobileNumber;
  const sql = `select * from card_block_detail where isDeleted='F' and 
                    mobileNumber=? order by id desc`;
  try {
    const [rows, feilds] = await pool.execute(sql, [mobileNo]);
    if (rows.length === 0) {
      res
        .status(200)
        .json({ status: false, message: "failed", detail: "no record found" });
      console.log(rows);
    } else {
      res.status(200).json({ status: true, message: "success", data: rows });
      console.log(rows);
    }
  } catch (error) {
    console.error(
      "Error while fetching card block details by account number " + error
    );
    res.status(200).json({ status: false, message: "failed", error: error });
  }
};

module.exports = {
  saveBlockCardDetail,
  getBlockCardDetail,
  getBlockCardDetByAcc,
  getBlockCardDetByMobile,
  getBlockCardDetByDate,
};
