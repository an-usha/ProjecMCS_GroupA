import React, { useEffect, useState } from "react";
import { Form, Input, Button, DatePicker } from "antd";
import "@ant-design/icons";
import { useApiFetch } from "../../hooks";
import { Table, Divider, Tag } from 'antd';
import Spinner from "../../components/Spinner";
import { useNotification } from "../../hooks";

const { RangePicker } = DatePicker;



function FullStmtLayout() {
  const [statements, setStatements] = useState([]);
  const { callNotification } = useNotification();

  const [loadingFullStm, getResponse, getFullStmError, getFulStatement] =
    //useApiFetch("/apims/fullStatement");
    useApiFetch("/apims/fullStatementWithAvailableBalance");

  useEffect(() => {
    console.log(getResponse);
    if (getResponse !== null) {
      if(getResponse.status === true){
      setStatements(getResponse.result.Data);
      console.log(statements);
      }
      else if(getResponse.status === false){
        callNotification("Failed to obtain statement", "error");
      }
    }
  }, [getResponse]);

  const columns = [
    {
      title: 'Date',
      dataIndex: 'TRAN_DATE',
      key: 'TRAN_DATE',
      render:(text)=>{
        const [res1,res2]=text.split(' ');
        return res1;
      }
    },
    {
      title: 'Tran Id',
      dataIndex: 'TRAN_ID',
      key: 'TRAN_ID',
    },
    {
      title: 'Type',
      dataIndex: 'DRCR',
      key: 'DRCR',
      render:(text)=>{
        return text === 'D'?'Debit':'Credit'
       }
    },
    {
      title: 'Amount',
      dataIndex: 'TRAN_AMT',
      key: 'TRAN_AMT',
    },
    {
      title: 'Available Balance',
      dataIndex: 'AVAILABLE_BALANCE',
      key: 'AVAILABLE_BALANCE',
    },
    {
      title: 'Desc 1',
      dataIndex: 'TRAN_PARTICULAR',
      key: 'TRAN_PARTICULAR',
    },
    {
      title: 'Desc 2',
      dataIndex: 'TRAN_PARTICULAR_2',
      key: 'TRAN_PARTICULAR_2',
    },
    {
      title: 'Desc 3',
      dataIndex: 'TRAN_RMKS',
      key: 'TRAN_RMKS',
    },
  ];

  const getFullStatement = async (postdata) => {
    await getFulStatement(postdata);
  };

  const onFinish = (values) => {
    var postdata = values;
    postdata["accountNumber"] = values.accountNumber;
    postdata["fromDate"] = values.stmtDateRange[0].format("YYYY-MM-DD");
    postdata["toDate"] = values.stmtDateRange[1].format("YYYY-MM-DD");
    delete postdata.stmtDateRange;
    getFullStatement(postdata);
  };

  return (
    <>
      <br />
      <div>
        <h3>Display Full Statement</h3>
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

          <Form.Item
            name="stmtDateRange"
            label="Statement Date Range (Start-End Date)"
            rules={[{ required: true, message: "Enter date range." }]}
          >
            <RangePicker />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
          {loadingFullStm && <Spinner/>}
        </Form>
      </div>
      <div>{getResponse?.status===true && <Table dataSource={statements} columns={columns} />}</div>
    </>
  );
}

export default FullStmtLayout;
