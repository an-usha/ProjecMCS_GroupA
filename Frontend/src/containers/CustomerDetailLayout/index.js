import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select } from "antd";
import "@ant-design/icons";
import { useApiFetch, useFetch } from "../../hooks";
import { Table} from 'antd';
import Spinner from "../../components/Spinner";
import { useNotification } from "../../hooks";
const { Option } = Select;


function CustomerDetailLayout() {
  const [statements, setStatements] = useState([]);
  const [branches, setBranches] = useState([]);
  const { callNotification } = useNotification();

  const [loadingBranchDetails, getBranchDetailsResponse, getBranchDetailsError] = 
  useFetch("/apims/branchList", true);

  const [loadingAccountDetails, getResponse, getAccountDetailsError, getAccountDetails] =
    useApiFetch("/apims/getAccountDetailsByNameAndSolId");

  useEffect(() => {
    if (getResponse !== null) {
      if(getResponse?.status === true) {
        setStatements(getResponse?.result?.Data);
      } else {
        callNotification("Failed to obtain statement", "error");
      }
    }
  }, [getResponse]);


  useEffect(() => {
    if (getBranchDetailsResponse) {
      if(getBranchDetailsResponse.Code === "0"){
        setBranches(getBranchDetailsResponse.Data.categoriesList);
      } else {
        callNotification("Failed to obtain statement", "error");
      }
    }
  }, [getBranchDetailsResponse, getBranchDetailsError]);

  const columns = [
    {
      title: 'ACCOUNT NAME',
      dataIndex: 'ACCT_NAME',
      key: 'ACCT_NAME',
    },
    {
      title: 'ACCOUNT NUMBER',
      dataIndex: 'FORACID',
      key: 'FORACID',
    },
    {
      title: 'BRANCH',
      dataIndex: 'BRANCH_NAME',
      key: 'BRANCH_NAME',
    },
    {
      title: 'SOL ID',
      dataIndex: 'SOL_ID',
      key: 'SOL_ID',
    },
    {
      title: 'PHONE NUMBER',
      dataIndex: 'PHONE_NUM',
      key: 'PHONE_NUM',
    },
  ];

  const getAccountDetail = async (postdata) => {
    await getAccountDetails(postdata);
  };

  const onFinish = (values) => {
    var postdata = values;
    postdata["accountName"] = values.accountName;
    postdata["solId"] = values.solId;
    getAccountDetail(postdata);
  };

  return (
    <>
      <br />
      <div>
        <h3>Display Customer Details</h3>
      </div>
      <div>
        <Form onFinish={onFinish}>
          <Form.Item
            label="Account Name"
            name="accountName"
            rules={[
              {
                required: true,
                message: "Please input the account name!",
              },
            ]}
          >
            <Input type="text" style={{ width: "300px" }} />
          </Form.Item>

          <Form.Item
            name="solId"
            label={'Branches'}
            rules={[
              { required: true, message: `Select Branch` },
            ]}
          >
            <Select
              showSearch
              placeholder={`Select Branches`}
              style={{ width: "300px" }}
              optionFilterProp="children"
              /*filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }*/
            >
              {branches?.map((item) => (
                <Option key={item.REF_CODE} value={item.REF_CODE}>
                  {item.REF_DESC} ({item.REF_CODE})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
          {loadingAccountDetails && <Spinner/>}
        </Form>
      </div>
      <div>{getResponse?.status && <Table dataSource={statements} columns={columns} />} </div>
    </>
  );
}

export default CustomerDetailLayout;
