const LeinRequestDetail = require("../model/leinRequestDetail");
const { pool } = require("../config/mysqldatabase");
const { formattedDateTime } = require("../config/currentDate");

const saveLienRequest = async (requestObj) => {
  let leinRequestDetail = new LeinRequestDetail();
  leinRequestDetail = requestObj;
  leinRequestDetail.createdOn = formattedDateTime(new Date());
  const sql = `insert into lien_request_details 
            (accountNumber,lienAmount,reasonCode,remarks,createdBy,createdByName,createdOn) 
            values
            (?,?,?,?,?,?,?)`;

  try {
    const [rows, fields] = await pool.execute(sql, [
      leinRequestDetail.accountNumber,
      leinRequestDetail.leinAmount,
      leinRequestDetail.reasonCode,
      leinRequestDetail.remarks,
      leinRequestDetail.createdBy,
      leinRequestDetail.createdByName,
      leinRequestDetail.createdOn,
    ]);
    console.log(sql);
    if (rows.insertId) {
      console.log("Record inserted successfully");
    }
  } catch (error) {
    console.error(
      "Error while inserting log for line request details " + error
    );
  }
};

const getLienRequst = async (req, res) => {
  const sql =
    "select * from lien_request_details where isDeleted='F' order by id desc";
  try {
    const [rows, fields] = await pool.execute(sql);
    if (rows.length === 0) {
      res.status(200).json({ status: true, message: "success", data: rows });
    } else {
      res.status(200).json({ status: true, message: "success", data: rows });
    }
  } catch (error) {
    console.error("Error while fetching lien request details" + error);
    res.status(200).json({ status: false, message: "failed" });
  }
};

const leinRequstByAccount = async (req, res) => {
  const accountNumber = req.query.accountNumber;
  const sql = `select * from lien_request_details where isDeleted='F' and accountNumber=? order by id desc`;
  try {
    const [rows, feilds] = await pool.execute(sql, [accountNumber]);
    if (rows.length === 0) {
      res.status(200).json({ status: true, message: "success", data: [] });
    } else {
      res.status(200).json({ status: true, message: 'success', data: rows });
    }
  } catch (error) {
    console.error("Error while fetching lein request detail " + error);
    res.status(200).json({ status: false, message: "failed", error: error });
  }
};

const leinRequstByDate = async (req, res) => {
  const fromDate=req.query.fromDate;
  const toDate=req.query.toDate;
  const sql=`select * from lien_request_details where isDeleted='F' and cast(createdOn as date) between ? and ? order by id desc`; 
  try{
    const [rows,feilds]= await pool.execute(sql,[fromDate,toDate]);
    if(rows.length===0){
      res.status(200).json({status:true,'message':'success',data:[]})
    }else{
      res.status(200).json({status:true,'message':'success',data:rows});
    }
  }catch(error){
    console.error("Error while fetching lein details by date "+error);
    res.status(200).json({status:false,'message':'failed',error:error});
  }
};

module.exports = {
  saveLienRequest,
  getLienRequst,
  leinRequstByAccount,
  leinRequstByDate,
};
