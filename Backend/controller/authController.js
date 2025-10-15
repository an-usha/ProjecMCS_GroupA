const jwt = require("jsonwebtoken");
const ldap = require("ldapjs");
const callAPI = require("../config/apims");
const { verifyUserLocal } = require("./userInfoController");
const { pool } = require("../config/mysqldatabase");
const { formattedDateTime } = require('../config/currentDate');
const tranId = formattedDateTime(new Date());

const adLoginUser = (req, res) => {
  let { username, password } = req.body;
  const domainName = username + "@CTZNBANK.COM";
  console.log(
    `username: ${username}, domainName: ${domainName}, password:${password} `
  );
  const client = ldap.createClient({
    url: process.env.LDAP_URL,
  });

  client.bind(domainName, password, (err) => {
    if (err) {
      verifyUserLocal(username, password).then((loginStatus) => {
        if (loginStatus === false) {
          res
            .status(200)
            .send({ status: "failed", message: "invalid credentials" });
        } else {
          const accessToken = jwt.sign(
            { data: loginStatus },
            process.env.JWT_SECRET,
            { expiresIn: "30m" }
          );
          async function insertToken(username,accessToken){
          await pool.execute(`delete from user_token_list where domainUserName='${username}'`);
          await pool.execute(`insert into user_token_list (domainUserName, userToken) values ('${username}','${accessToken}')`);
          }
          insertToken(username,accessToken);
          loginStatus.Data.token = accessToken;
          loginStatus.Data.image = "";
          res.status(200).json(loginStatus);
        }
      });
    } else {
      const functionName = process.env.EMP_DETAIL_BY_DOMAIN;
      //const requestModel = { domainUserName: `${username}` };
      const requestModel = { "domainUserName": `${username}`, "TransactionId": formattedDateTime(new Date()) };

      async function fetchData() {
        const empDetail = await callAPI(functionName, requestModel);
        //const empDetail={"Code":"0","Message":"Operation Successfull","Data":{"solId":"999","solDesc":"Corporate Office","employeeName":"Sagar Binod Adhikari","designation":"Assistant","branchManagerName":"","branchManagerDesignation":"","branchType":"Inside Valley","employeeId":"2547","domainUserName":"adhikari.sagar","isProvinceManager":"N","email":"Sagar.adhikari@ctznbank.com","departmentName":"Digital Banking Unit","phone":"9846169746","functionalTitle":"","photo":"d15dd518-8adb-40ec-9f20-bd5437d11438.PNG"},"DeveloperMessage":null,"Errors":null}
        console.log(empDetail);
        if (empDetail) {
          const accessToken = jwt.sign(
            { data: empDetail },
            process.env.JWT_SECRET,
            { expiresIn: "30m" }
          );
          empDetail.Data.token = accessToken;
          await pool.execute(`delete from user_token_list where domainUserName='${username}'`);
          await pool.execute(`insert into user_token_list (domainUserName, userToken) values ('${username}','${accessToken}')`);
          //fetch the staff photo
          const functionName1 = process.env.STAFF_IMAGE_API;
          
          //const requestModel1 = { imageId: empDetail.Data.photo };
          const requestModel1 = { imageId: empDetail.Data.photo, "TransactionId": "Img-"+tranId };
          const result1 = await callAPI(functionName1, requestModel1);
          empDetail.Data.image = result1.Data;
          res.status(200).json(empDetail);
        } else {
          res.status(401).send("Authentication Failed");
        }
      }
      fetchData();
    }
    client.unbind();
  });
};

const logoutUser =async (req,res)=>{
  console.log('User logout functin called');
  let {token}=req.body
  //console.log(token);
  try{
      let [rowsDeleteToken,fieldsDeleteToken]=await pool.execute(`delete from user_token_list where userToken='${token}'`);
      //console.log(rowsDeleteToken.affectedRows);
      if(rowsDeleteToken.affectedRows > 0){
        res.status(200).json({status:true,'message':'success'});
      }else{
        res.status(200).json({status:false,'message':'failed to delete token'});
      }
  }catch(error){
    res.status(200).json({status:false, 'message':'failed'})
  }

}

module.exports = { adLoginUser,logoutUser };
