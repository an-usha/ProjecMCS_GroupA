import React, { useState, useEffect } from "react";
import { Form, Input, Button } from "antd";
import "@ant-design/icons";
import { useApiFetch } from "../../hooks";
import { Tabs } from "antd";
import { Descriptions } from "antd";
import Spinner from "../../components/Spinner";
import { useNotification } from "../../hooks";

function KYCDetLayout() {
  const [custDetail, setCustDetail] = useState(null);
  const { callNotification } = useNotification();

  const [loadingKYCDetail, getResponse, getKYCDetailError, getKYCDetails] =
    useApiFetch("/apims/kycDetail");

  useEffect(() => {
    if (getResponse !== null) {
      if(getResponse.status ===true){
        setCustDetail(getResponse.result.Data);
      }else if(getResponse.status === false){
        callNotification("Failed to Obtain KYC Detail", "error");
      }
    }
  }, [getResponse]);

  const getKYCDetail = async (accountNumber) => {
    await getKYCDetails({ accountNumber: accountNumber });
  };

  const onFinish = (values) => {
    getKYCDetail(values.accountNumber);
  };

  const manipulateAcctOpnDate = (date) => {
    console.log(date);
    if (date !== undefined) {
      let acctOpnDate = date.split(" ");
      return acctOpnDate[0];
    }
  };

  const manipulateDOB = (date) => {
    if (date !== undefined) {
      let dob = date.split(" ");
      return dob[0];
    }
  };

  const items = [
    {
      key: "1",
      label: `Account Details`,
      children: (
        <Descriptions>
          <Descriptions.Item label="Branch Code">
            {custDetail?.BranchCode}
          </Descriptions.Item>
          <Descriptions.Item label="Branch Name">
            {custDetail?.BranchName}
          </Descriptions.Item>
          <Descriptions.Item label="Client Code">
            {custDetail?.ClientCode}
          </Descriptions.Item>
          <Descriptions.Item label="Scheme Type">
            {custDetail?.SchmType}
          </Descriptions.Item>
          <Descriptions.Item label="Scheme Code">
            {custDetail?.SchmCode}
          </Descriptions.Item>
          <Descriptions.Item label="Scheme Desc">
            {custDetail?.SchmDescription}
          </Descriptions.Item>
          <Descriptions.Item label="Account Number">
            {custDetail?.MainCode}
          </Descriptions.Item>
          <Descriptions.Item label="Account Open Date">
            {manipulateAcctOpnDate(custDetail?.AcctOpnDate)}
          </Descriptions.Item>
          <Descriptions.Item label="Account Name">
            {custDetail?.AcctName}
          </Descriptions.Item>
          <Descriptions.Item label="Currency Code">
            {custDetail?.CyCode}
          </Descriptions.Item>
          <Descriptions.Item label="Currency Code">
            {custDetail?.CyCode}
          </Descriptions.Item>
          <Descriptions.Item label="Account Status">
            {custDetail?.AccountStatus === "A"
              ? "Active"
              : custDetail?.AccountStatus === "D"
              ? "Dormant"
              : "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Freeze Status">
            {custDetail?.AcctFrezStatus === " "
              ? "Not Freeze"
              : custDetail?.AcctFrezStatus === "T"
              ? "Total Freeze"
              : custDetail?.AccountStatus === "C"
              ? "Credit Freeze"
              : custDetail?.AccountStatus === "D"
              ? "Debit Freeze"
              : "Not Freeze"}
          </Descriptions.Item>
          <Descriptions.Item label="Lien Amount">
            {custDetail?.LienAmt}
          </Descriptions.Item>
          <Descriptions.Item label="Available Amount">
            {custDetail?.AvailableAmt}
          </Descriptions.Item>
        </Descriptions>
      ),
    },
    {
      key: "2",
      label: `Personal Details`,
      children: (
        <Descriptions>
          <Descriptions.Item label="First Name">
            {custDetail?.FirstName}
          </Descriptions.Item>
          <Descriptions.Item label="Middle Name">
            {custDetail?.MiddleName === "" ? "N/A" : custDetail?.MiddleName}
          </Descriptions.Item>
          <Descriptions.Item label="Last Name">
            {custDetail?.LastName}
          </Descriptions.Item>
          <Descriptions.Item label="Father Name">
            {custDetail?.FatherName}
          </Descriptions.Item>
          <Descriptions.Item label="Mother Name">
            {custDetail?.MotherName}
          </Descriptions.Item>
          <Descriptions.Item label="Grand Father Name">
            {custDetail?.GrandFatherName}
          </Descriptions.Item>
          <Descriptions.Item label="DOB">
            {manipulateDOB(custDetail?.DateOfBirth)}
          </Descriptions.Item>
          <Descriptions.Item label="Mobile No.">
            {custDetail?.MobileNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {custDetail?.Email}
          </Descriptions.Item>
          <Descriptions.Item label="Citizenship No.">
            {custDetail?.CitizenshipNo}
          </Descriptions.Item>
          <Descriptions.Item label="Date of Issue">
            {custDetail?.NepCtznDate}
          </Descriptions.Item>
          <Descriptions.Item label="Issue District">
            {custDetail?.CitizenshipIssueDistrict}
          </Descriptions.Item>
          <Descriptions.Item label="BOID">{custDetail?.Boid}</Descriptions.Item>
          <Descriptions.Item label="CRN No. ">
            {custDetail?.CrnNumber}
          </Descriptions.Item>
        </Descriptions>
      ),
    },
    // {
    //   key: "3",
    //   label: `Address Details`,
    //   children: `Content of Tab Pane 3`,
    // },
  ];

  return (
    <>
      <br />
      <div>
        <h3>KYC Detail of Customer </h3>
      </div>
      <div>
        <Form onFinish={onFinish}>
          <Form.Item
            label="Account Number"
            name="accountNumber"
            rules={[
              {
                required: true,
                message: "Please input the account number!",
              },
              {
                max: 16,
                message: "Account number cannot exceed 16 digits!",
              },
            ]}
          >
            <Input type="number" style={{ width: "300px" }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
          {loadingKYCDetail && <Spinner/>}
        </Form>
      </div>
      <div>{getResponse?.status===true && <Tabs defaultActiveKey="1" items={items} />}</div>
    </>
  );
}

export default KYCDetLayout;
