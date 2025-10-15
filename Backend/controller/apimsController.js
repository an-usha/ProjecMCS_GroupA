const dayjs=require("dayjs");
const callAPI = require("../config/apims");
let { formattedDateTime } = require("../config/currentDate");
const LeinRequestDetail = require("../model/leinRequestDetail");
const { saveLienRequest } = require("../controller/lienRequestController");
const {
  saveBlockCardDetail,
  getBlockCardDetail,
} = require("../controller/cardBlockController");
const { json } = require("body-parser");
const CardBlockDetails = require("../model/cardBlockDetail");
const {
  getBlockedSchmCode,
  getBlockedSchmType,
} = require("../controller/accountValidateController");

const getDataFromApims = async (req, res) => {
  const { functionName, requestModel } = req.body;
  console.log(functionName, requestModel);
  const result = await callAPI(functionName, requestModel);

  res.json(result);
};

const sendEmailFromApims = async (functionName, requestModel) => {
  console.log(functionName, requestModel);
  const result = await callAPI(functionName, requestModel);
  return result;
};

const getBranchList = async (req, res) => {
  //fetching branch list
  const functionName = process.env.BRANCH_LIST_API;
  //const requestModel = { categoryType: "BRANCH" };
  const tranId = formattedDateTime(new Date());
  const requestModel = { categoryType: "BRANCH", "TransactionId": "BA-"+tranId };
  const result = await callAPI(functionName, requestModel);
  console.log("getBranchList:::", result)
  res.status(200).json(result);
};

const getDepartmentList = async (req, res) => {
  const functionName = process.env.DEPARTMENT_LIST_API;
  //const requestModel = { TransactionId: "DL-11" };
  const tranId = formattedDateTime(new Date());
  const requestModel = { TransactionId: tranId };
  const result = await callAPI(functionName, requestModel);
  res.status(200).json(result);
};

const getAllEmployees = async (req, res) => {
  const functionName = process.env.EMP_DETAIL_LIST_API;
  //const requestModel = {};
  const tranId = formattedDateTime(new Date());
  const requestModel = { "TransactionId": tranId };
  const result = await callAPI(functionName, requestModel);
  res.status(200).json(result);
};

const getSingleEmployee = async (req, res) => {
  const functionName = process.env.EMP_DETAIL_BY_STAFFID;
  //const requestModel = { staffId: req.params.empId };
  const tranId = formattedDateTime(new Date());
  const requestModel = { "staffId": req.params.empId, "TransactionId": tranId };
  const result = await callAPI(functionName, requestModel);
  res.status(200).json(result);
};

const getEmployeesFromBranch = async (req, res) => {
  const functionName = process.env.EMP_DETAIL_LIST_API;
  //const requestModel = {};
  const tranId = formattedDateTime(new Date());
  const requestModel = { "TransactionId": tranId };
  const result = await callAPI(functionName, requestModel);
  const filteredResult = result.Data.employeeList.filter(
    (employee) => employee.solId === req.params.branchId
  );
  res.status(200).send(filteredResult);
};

const getEmployeesFromDepartment = async (req, res) => {
  const functionName = process.env.EMP_DETAIL_LIST_API;
  //const requestModel = {};
  const tranId = formattedDateTime(new Date());
  const requestModel = { "TransactionId": tranId };
  console.log(req.params.departmentId);
  const result = await callAPI(functionName, requestModel);
  const filteredResult = result.Data.employeeList.filter(
    (employee) => employee.departmentName === req.params.departmentId
  );
  res.status(200).send(filteredResult);
};

const getEmployeeHOD = async (req, res) => {
  const functionName = process.env.EMP_DETAIL_LIST_API;
  //const requestModel = {};
  const tranId = formattedDateTime(new Date());
  const requestModel = { "TransactionId": tranId };
  const result = await callAPI(functionName, requestModel);
  const filteredResult = result.Data.employeeList
    .filter((employee) => employee.functionalTitle.substring(0, 4) === "Head")
    .filter((employee) => employee.solId === "999")
    .filter(
      (employee) => employee.departmentName.substring(0, 7) !== "Cluster"
    );
  const finalresult = { departmentList: filteredResult };

  res.status(200).send(finalresult);
};

const getEmployeeBM = async (req, res) => {
  const functionName = process.env.EMP_DETAIL_LIST_API;
  //const requestModel = {};
  const tranId = formattedDateTime(new Date());
  const requestModel = { "TransactionId": tranId };
  const result = await callAPI(functionName, requestModel);
  const filteredResult = result.Data.employeeList
    .filter((employee) => employee.employeeName === employee.branchManagerName)
    .sort((employee1, employee2) => {
      if (employee1.solId < employee2.solId) {
        return -1;
      } else if (employee1.solid > employee2.solId) {
        return 1;
      } else {
        return 0;
      }
    });

  const finalResult = { branchList: filteredResult };
  res.status(200).send(finalResult);
};

const getExecutiveList = async (req, res) => {
  const functionName = process.env.EMP_DETAIL_LIST_API;
  //const requestModel = {};
  const tranId = formattedDateTime(new Date());
  const requestModel = { "TransactionId": tranId };
  const result = await callAPI(functionName, requestModel);
  let finalResult = [];
  const filteredResult = result.Data.employeeList.filter((employee) => {
    if (employee.designation === "Chief Executive Officer") {
      finalResult.push(employee);
    } else if (employee.designation === "Assistant General Manager") {
      finalResult.push(employee);
    } else if (employee.functionalTitle.substring(0, 5) === "Chief") {
      finalResult.push(employee);
    }
  });

  finalResult = { executiveList: finalResult };
  res.status(200).send(finalResult);
};

const getAccountBalance = async (req, res) => {
  const functionName = process.env.ACCOUNT_BALANCE;
  const requestModel = {
    TransactionId: "BE-" + formattedDateTime(new Date()),
    AccountNumber: req.query.accountNumber,
  };
  
  if(req.query.type === 'ignore'){
    accValidationRequired=true;
  }
  let validateAccount = await validateAccountInternal(
    req.query.accountNumber
  );
  if(req.query.type === 'ignore'){
    validateAccount=true;
  }
  if (validateAccount === true) {
    const result = await callAPI(functionName, requestModel);
    res.status(200).json({ status: true, message: "success", result });
  } else if (validateAccount === false) {
    res.status(200).json({ status: false, message: "failed" });
  }
};

const getMiniStatement = async (req, res) => {
  const functionName = process.env.MINI_STATEMENT;
  const requestModel = {
    TransactionId: "MSN-" + formattedDateTime(new Date()),
    AccountNumber: req.query.accountNumber,
  };
  const validateAccount = await validateAccountInternal(
    req.query.accountNumber
  );
  if (validateAccount === true) {
    const result = await callAPI(functionName, requestModel);
    res.status(200).json({ status: true, message: "success", result });
  } else if (validateAccount === false) {
    res.status(200).json({ status: false, message: "failed" });
  }
};

const getFullStatement = async (req, res) => {
  const functionName = process.env.FULL_STATEMENT;
  const requestModel = {
    TransactionId: "FS-" + formattedDateTime(new Date()),
    AccountNumber: req.query.accountNumber,
    FromDate: req.query.fromDate,
    ToDate: req.query.toDate,
  };
  const validateAccount = await validateAccountInternal(
    req.query.accountNumber
  );
  if (validateAccount === true) {
    const result = await callAPI(functionName, requestModel);

    res.status(200).json({ status: true, message: "success", result });
  }else if(validateAccount === false){
    res.status(200).json({status:false, message:"failed"});
  }
};

const getKYCDetail = async (req, res) => {
  const functionName = process.env.KYC_DETAIL;
  const requestModel = {
    TransactionId: "KYC-" + formattedDateTime(new Date()),
    AccountNumber: req.query.accountNumber,
  };
  const validateAccount = await validateAccountInternal(
    req.query.accountNumber
  );
  if(validateAccount === true){
  const result = await callAPI(functionName, requestModel);
  res.status(200).json({ status: true, message: "success", result });
  }else if(validateAccount === false){
    res.status(200).json({status:false, message:"failed"});
  }
};

const lienCustomerAccount = async (req, res) => {
  const accountNumber = req.query.accountNumber;
  const lienAmount = req.query.lienAmount;
  const reasonCode = req.query.reasonCode;
  const remarks = req.query.lienRemarks;

  let leinRequestDetail = new LeinRequestDetail();
  leinRequestDetail.accountNumber = accountNumber;
  leinRequestDetail.leinAmount = lienAmount;
  leinRequestDetail.reasonCode = reasonCode;
  leinRequestDetail.remarks = remarks;
  leinRequestDetail.createdBy = req.body.token_data.domainUserName;
  leinRequestDetail.createdByName = req.body.token_data.employeeName;

  const functionName = process.env.LIEN_INQUERY;
  const jsonData = {
    AcctLienInqRequest: {
      AcctLienInqRq: {
        AcctId: {
          AcctId: accountNumber,
        },
        ModuleType: "ULIEN",
      },
    },

    TransactionId: "FS-" + formattedDateTime(new Date()), //currently added for APIMS New
  };

  const result = await callAPI(functionName, jsonData);
  console.log(JSON.stringify(result, null, 2));
  console.log(result.Code);

  let functionName1,
    jsonData1 = "";

  if (result.Code !== "0") {
    console.log("inside new lien add");
    functionName1 = process.env.LIEN_ADD_API_NEW;
    jsonData1 = {
      AcctLienAddRequest: {
        AcctLienAddRq: {
          AcctId: {
            AcctId: accountNumber,
            AcctCurr: "NPR",
          },
          ModuleType: "ULIEN",
          LienDtls: {
            NewLienAmt: {
              amountValue: lienAmount,
              currencyCode: "NPR",
            },
            ReasonCode: reasonCode,
            Rmks: remarks,
          },
        },
      },

      TransactionId: "FS-" + formattedDateTime(new Date()), //currently added for APIMS New
    };
    //saveLienRequest(leinRequestDetail);
  } else {
    console.log("inside lien mod api");
    functionName1 = process.env.LIEN_MODIFICATION_API;
    jsonData1 = {
      AcctLienModRequest: {
        AcctLienModRq: {
          AcctId: {
            AcctId: accountNumber,
          },
          ModuleType: "ULIEN",
          LienDtls: {
            NewLienAmt: {
              amountValue: lienAmount,
              currencyCode: "NPR",
            },
            ReasonCode: reasonCode,
            Rmks: remarks,
          },
        },
      },

      TransactionId: "FS-" + formattedDateTime(new Date()), //currently added for APIMS New
    };
    //saveLienRequest(leinRequestDetail);
  }
  const result1 = await callAPI(functionName1, jsonData1);
  //console.log(JSON.stringify(jsonData1, null, 2));
  console.log(JSON.stringify(result1, null, 2));
  if (result1.Code === "0") {
    saveLienRequest(leinRequestDetail);
    res.status(200).json({ status: true, message: "success" });
  } else {
    res.status(200).json({ status: false, message: "failed" });
  }
};

const cardCustomerEnquiryForLog = async (accountNumber) => {
  const functionName = process.env.CARD_API_CUST_DET;
  let currentDateTime = formattedDateTime(new Date());
  jsonData = {
    TransactionId: "CUST_DETAIL_" + currentDateTime,
      type: "debit",
      object: "debitAccountNo",
      identifier: accountNumber,
  };

  console.log("accountNumber::", accountNumber)
  const result = await callAPI(functionName, jsonData);
  
  if (result.Code === "0") {
    return result;
  } else {
    return false;
  }
};

const cardCustomerEnquiry = async (req, res) => {
  const accountNumber = req.query.accountNumber;
  const mobileNo = req.query.mobileNo;
  const functionName = process.env.CARD_API_CUST_DET;
  const currentDateTime = formattedDateTime(new Date());
  let jsonData = "";
  if (accountNumber !== undefined) {
    jsonData = {
      TransactionId: "CUST_DETAIL_" + currentDateTime,
        type: "debit",
        object: "debitAccountNo",
        identifier: accountNumber
    };
  } else {
    jsonData = {
      TransactionId: "CUST_DETAIL_" + currentDateTime,
        type: "debit",
        object: "mobileNo",
        identifier: mobileNo
    };
  }

  const result = await callAPI(functionName, jsonData);

  if (result.Code === "0") {
    res
      .status(200)
      .json({ status: true, message: "success", data: result.Data });
  } else {
    res.status(200).json({ status: false, message: "failed", data: null });
  }
};

const cardBlock = async (req, res) => {
  const accountNumber = req.query.accountNumber;
  const maskedCardNumber = req.query.cardNumber;
  const functionName = process.env.CARD_API_BLOCK_CARD_SINGLE;
  let currentDateTime = formattedDateTime(new Date());
  let jsonData = "";
  jsonData = {
    TransactionId: "BLOCK_CARD_" + currentDateTime,
      type: "debit",
      object: "accountNo",
      identifier: accountNumber,
      data: {
        blockType: "BLOCK",
        blockReason: "BLOCK",
      },
  };
  //console.log(jsonData);
  const result = await callAPI(functionName, jsonData);

  if (result.Code === "0") {
    res.status(200).json({ status: true, message: "success" });
    const custDet = await cardCustomerEnquiryForLog(accountNumber);
    if (custDet === false) {
      console.log("Error while inserting card block customer detail");
    } else {
      let custDetail = new CardBlockDetails();
      custDetail.accountNumber = custDet.Data.debit.debitAccountNumber;
      custDetail.customerName = custDet.Data.debit.customerName;
      custDetail.mobileNumber = custDet.Data.debit.mobileNumber;
      cardList = custDet.Data.debit.cards;
      let singleCard = cardList.find(
        (card) => card.cardNumber === maskedCardNumber
      );
      custDetail.cardType = singleCard.cardType;
      custDetail.cardHolderName = singleCard.cardHolderName;
      custDetail.cardNumber = singleCard.cardNumber;
      custDetail.cardStatus = singleCard.status;
      custDetail.createdBy = req.body.token_data.domainUserName;
      custDetail.createdByName = req.body.token_data.employeeName;
      saveBlockCardDetail(custDetail);
    }
  }
  // } else if (result.Data.code === 1) {
  //   let cardList = result.Data.cards;
  //   console.log(cardList);
  //   let uniqueCard = cardList.find(
  //     (card) => card.maskedCardNumber === maskedCardNumber
  //   );
  //   console.log(uniqueCard);
  //   let cardId = uniqueCard.ccmsCardId;
  //   //console.log(cardId);
  //   currentDateTime = formattedDateTime(new Date());
  //   let jsonData1 = {
  //     TransactionId: "BLOCK_CARD_" + currentDateTime,
  //     RequestType: "MultipleCardBlock",
  //     RequestData: {
  //       type: "debit",
  //       data: {
  //         ccmsCardId: cardId,
  //         requestToken: result.Data.data.requestToken,
  //       },
  //     },
  //   };
  //   console.log(jsonData1);
  //   let result1 = await callAPI(functionName, jsonData1);
  //   //console.log(JSON.stringify(result1,null,2))
  //   if (result1.Data.code === 0) {
  //     res.status(200).json({ status: true, message: "success" });
  //     const custDet = await cardCustomerEnquiryForLog(accountNumber);
  //     if (custDet === false) {
  //       console.log("Error while inserting card block customer detail");
  //     } else {
  //       let custDetail = new CardBlockDetails();
  //       custDetail.accountNumber = custDet.Data.data.debit.debitAccountNumber;
  //       custDetail.customerName = custDet.Data.data.debit.customerName;
  //       custDetail.mobileNumber = custDet.Data.data.debit.mobileNumber;
  //       cardList = custDet.Data.data.debit.cards;
  //       let singleCard = cardList.find(
  //         (card) => card.cardNumber === maskedCardNumber
  //       );
  //       custDetail.cardType = singleCard.cardType;
  //       custDetail.cardHolderName = singleCard.cardHolderName;
  //       custDetail.cardNumber = singleCard.cardNumber;
  //       custDetail.cardStatus = singleCard.status;
  //       custDetail.createdBy = req.body.token_data.domainUserName;
  //       custDetail.createdByName = req.body.token_data.employeeName;
  //       saveBlockCardDetail(custDetail);
  //     }
  //   } else {
  //     res.status(200).json({ status: false, message: "failed" });
  //   }
  // }
};

const getStaffImage = async (req, res) => {
  const imageId = req.query.imageId;
  const functionName = process.env.STAFF_IMAGE_API;
  const tranId = formattedDateTime(new Date());
  //const requestModel = { imageId };
  const requestModel = { "imageId" : imageId, "TransactionId": tranId };
  const result = await callAPI(functionName, requestModel);
  if (result.Code === "0") {
    res
      .status(200)
      .json({ status: true, message: "success", data: result.Data });
  } else {
    res.status(200).json({ status: false, message: "failed" });
  }
};

const validateAccount = async (req, res) => {
  const accountNumber = req.query.accountNumber;
  const functionName = process.env.ACCOUNT_VALIDATE_API;
  const requestModel = {
    AcctInqRequest: {
      AcctInqRq: {
        AcctId: {
          AcctId: accountNumber,
        },
      },
    },

    //"TransactionId": tranId 
  };
  const result = await callAPI(functionName, requestModel);

  if (result.Code === "0") {
    const schmCode =
      result.Data.AcctInqResponse.AcctInqRs.AcctId.AcctType.SchmCode;
    const schmType =
      result.Data.AcctInqResponse.AcctInqRs.AcctId.AcctType.SchmType;
    const acctStatus = result.Data.AcctInqResponse.AcctInqRs.BankAcctStatusCode;
    res.status(200).json({
      status: "true",
      message: "success",
      schmCode: schmCode,
      schmType: schmType,
      accountStatus: acctStatus,
    });
  } else {
    res.status(200).json({ status: "false", message: "failed" });
  }
};

const validateAccountInternal = async (accountNumber) => {
  const functionName = process.env.ACCOUNT_VALIDATE_API;
  const tranId = formattedDateTime(new Date());
  const requestModel = {
    AcctInqRequest: {
      AcctInqRq: {
        AcctId: {
          AcctId: accountNumber,
        },
      },
    },

    "TransactionId": tranId 
  };
  const result = await callAPI(functionName, requestModel);

  if (result.Code === "0") {
    const schmCode =
      result.Data.AcctInqResponse.AcctInqRs.AcctId.AcctType.SchmCode;
    
    const schmType =
      result.Data.AcctInqResponse.AcctInqRs.AcctId.AcctType.SchmType;
    console.log(schmType);
    const acctStatus = result.Data.AcctInqResponse.AcctInqRs.BankAcctStatusCode;
    const schmCodeList = await getBlockedSchmCode();
    const schmTypeList = await getBlockedSchmType();
    if (schmCodeList.find((obj) => obj.schmCode === schmCode)) {
      return false;
    } else if (schmTypeList.find((obj) => obj.schmType === schmType)) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
};

const missedCallListCallCenter=async(req,res)=>{
    const fromDate=req.query.fromDate;
    const toDate=req.query.toDate;
    // const response=[
    //   {"calldate":"2023-10-03 00:00:28",
    //   "src":"9841338193",
    //   "dst":"hangup",
    //   "channel":"SIP/ntc-0003edc7",
    //   "dstchannel":"SIP/103-0003edc8",
    //   "duration":"44",
    //   "billsec":"44",
    //   "disposition":"NO ANSWER"
    // }];
    const functionName=process.env.CALL_CENTER_API_MISSED_CALL_LIST;
    /*const requestModel={
      "StartDate":fromDate,
      "EndDate":toDate
    };*/

    const requestModel={
      "StartDate":fromDate,
      "EndDate":toDate,
      "TransactionId": tranId 
    };

    
    const result = await callAPI(functionName,requestModel);
    //console.log(result.Data.ListResponse[0]);
    if(result.Code === '0' && result.Data !==null){
        for(i=0;i<result.Data.ListResponse.length;i++){
          result.Data.ListResponse[i].calldate=dayjs(result.Data.ListResponse[i].calldate,{format:'MM/DD/YYYY HH:mm:ss'}).format("YYYY-MM-DD HH:mm:ss");
        }
      res.status(200).json({status:true,'message':'success',result});
    }else{
      res.status(200).json({status:false,'message':'failed'})
    }

}


const fullStatementWithAvailableBalance = async (req, res) => {
  const functionName = process.env.FULL_STATEMENT_WITH_AVAILABLE_BALANCE_AFTER_TXN;
  const requestModel = {
    TransactionId: "FS1-" + formattedDateTime(new Date()),
    FORACID: req.query.accountNumber,
    FROM_DATE: req.query.fromDate,
    TO_DATE: req.query.toDate,
  };
  const validateAccount = await validateAccountInternal(
    req.query.accountNumber
  );
  if (validateAccount === true) {
    const result = await callAPI(functionName, requestModel);
    res.status(200).json({ status: true, message: "success", result });
  }else if(validateAccount === false){
    res.status(200).json({status:false, message:"failed"});
  }
};

const getAccountDetailsByNameAndSolId = async (req, res) => {
  const functionName = process.env.CUSTOMERINFO_BY_ACCT_NAME_SOL_ID;
  const tranId = formattedDateTime(new Date());
  const requestModel = {
    TransactionId: "NS-" + tranId,
    AccountName: req.query.accountName,
    SolId: req.query.solId
  };

    const result = await callAPI(functionName, requestModel);
    res.status(200).json({ status: true, message: "success", result });
};



module.exports = {
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
  sendEmailFromApims,
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
};
