import React, { useEffect, useState } from "react";
import { Form, Input, Button, Col, Row } from "antd";
import "@ant-design/icons";
import { useApiFetch } from "../../hooks";
import Spinner from "../../components/Spinner";
import { useNotification } from "../../hooks";

function AccBalLayout() {
  const [accountNumber, setAccountNumber] = useState(null);
  const [ledgerBalance, setLedgerBalance] = useState(null);
  const [availableBalance, setAvailableBalance] = useState(null);

  const { callNotification } = useNotification();
  const [balForm] = Form.useForm();

  const [loadingBalance, getBalanceResponse, getBalanceError, getBalance] =
    useApiFetch("/apims/checkBalance");

  useEffect(() => {
    if(getBalanceResponse !== null){
      console.log(getBalanceResponse);
    if (getBalanceResponse.status === true) {
      setAccountNumber(getBalanceResponse.result.AccountNumber);
      setLedgerBalance(getBalanceResponse.result.AvailableBalance);
      setAvailableBalance(getBalanceResponse.result.LedgerBalance);
      balForm.setFieldsValue({
        accountNumber: accountNumber === '' ? '0' : accountNumber,
        ledgerBalance: ledgerBalance === ''? '0': ledgerBalance,
        availableBalance: availableBalance,
      });
    }else if(getBalanceResponse.status === false){
      callNotification("Check Balance failed", "error");
    }
  }
  }, [getBalanceResponse, accountNumber]);

  const getAccountBalance = async (accountNumber) => {
    await getBalance({ accountNumber: accountNumber });
  };

  const onFinish = (values) => {
    getAccountBalance(values.accountNumber);
  };

  return (
    <>
      <br />
      <h3>Check Account Balance</h3>
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
        {loadingBalance && <Spinner/>}
      </Form>
      <br />
      <br />
      <div>
        {getBalanceResponse?.status===true &&
        <Form form={balForm} layout={"vertical"}>
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
        </Form>}
      </div>
    </>
  );
}

export default AccBalLayout;
