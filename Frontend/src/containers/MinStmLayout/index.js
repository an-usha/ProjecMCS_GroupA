import React, { useState, useEffect } from "react";
import { Form, Input, Button, Col, Row } from "antd";
import "@ant-design/icons";
import { useApiFetch } from "../../hooks";
import { Table, Divider, Tag } from "antd";
import Spinner from "../../components/Spinner";
import { useNotification } from "../../hooks";

function MinStmLayout() {
  const [accountNumber, setAccountNumber] = useState(null);
  const [ledgerBalance, setLedgerBalance] = useState(null);
  const [availableBalance, setAvailableBalance] = useState(null);
  const [dataSource, setDataSource] = useState([]);

  const { callNotification } = useNotification();
  const [miniStatementForm] = Form.useForm();

  const [loadingMinStm, getResponse, getMinStmError, getMinStatement] =
    useApiFetch("/apims/miniStatement");

  useEffect(() => {
    if (getResponse !== null) {
      if (getResponse.status === true) {
        setAccountNumber(getResponse.result.AccountNumber);
        setLedgerBalance(getResponse.result.AvailableBalance);
        setAvailableBalance(getResponse.result.LedgerBalance);
        setDataSource(getResponse.result.MiniStatement);
        miniStatementForm.setFieldsValue({
          accountNumber: accountNumber,
          ledgerBalance: ledgerBalance,
          availableBalance: availableBalance,
        });
      } else if (getResponse.status === false) {
        callNotification("Failed to obtain Mini Statement", "error");
      }
    }
  }, [getResponse, accountNumber]);

  const getMiniStatement = async (accountNumber) => {
    await getMinStatement({ accountNumber: accountNumber });
  };

  const onFinish = (values) => {
    getMiniStatement(values.accountNumber);
  };

  const columns = [
    {
      title: "Transaction Date",
      dataIndex: "Date",
      key: "Date",
      render: (text) => {
        return (
          text.substring(0, 4) +
          "-" +
          text.substring(4, 6) +
          "-" +
          text.substring(6, 8)
        );
      },
    },
    {
      title: "Type",
      dataIndex: "Indicator",
      key: "Indicator",
      render: (text) => {
        return text === "D" ? "Debit" : "Credit";
      },
    },
    {
      title: "Amount",
      dataIndex: "Amount",
      key: "Amount",
    },
    {
      title: "Description",
      dataIndex: "TranParticulars",
      key: "TranParticulars",
    },
  ];

  return (
    <>
      <br />
      <h3>Display Mini Statement</h3>
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
        {loadingMinStm && <Spinner />}
      </Form>
      <br />
      <br />
      <div>
        {getResponse?.status===true && (
          <Form form={miniStatementForm} layout={"vertical"}>
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item label="Account Number" name="accountNumber">
                  <Input type="text" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Available Balance" name="ledgerBalance">
                  <Input type="text" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Ledger Balance" name="availableBalance">
                  <Input type="text" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
      </div>
      <div>
        {getResponse?.status===true && <Table dataSource={dataSource} columns={columns} />}
      </div>
    </>
  );
}

export default MinStmLayout;
