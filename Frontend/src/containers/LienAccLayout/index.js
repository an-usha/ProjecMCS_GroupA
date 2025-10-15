import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Col,
  Row,
  Select,
  InputNumber,
  Typography,
} from "antd";
import { useApiFetch } from "../../hooks";
import { useNotification } from "../../hooks";
import Spinner from "../../components/Spinner";

const { Option } = Select;

function LienAccLayout() {
  const [accountNumber, setAccountNumber] = useState(null);
  // const [lienAmount, setLienAmount] = useState(null);
  // const [reasonCode, setReasonCode] = useState(null);
  // const [lienRemarks, setLienRemarks] = useState(null);
  const [availableBalance, setAvailableBalance] = useState(null);
  const [disableTypo, setDisableTypo] = useState(false);

  const { callNotification } = useNotification();

  const [lienForm] = Form.useForm();

  const [loadingLienAccount, getLienResponse, lienAccountError, lienAccount] =
    useApiFetch("/apims/lienCustomerAccount");

  useEffect(() => {
    if (getLienResponse) {
      if (getLienResponse?.status) {
        console.log(getLienResponse);
        callNotification("Account Lien successfully.", "success");
        lienForm.resetFields();
        setDisableTypo(false);
      } else {
        callNotification("Account Lien failed.", "error");
        lienForm.resetFields();
        setDisableTypo(false);
        console.log(getLienResponse);
      }
    }
  }, [getLienResponse]);

  const lienCustomerAccount = async (payload) => {
    await lienAccount(payload);
  };

  const onFinish = (values) => {
    lienCustomerAccount({
      accountNumber: values.accountNumber,
      lienAmount: values.lienAmount,
      reasonCode: values.reasonCode,
      lienRemarks: values.lienRemarks,
    });
  };

  const [loadingBalance, getBalanceResponse, getBalanceError, getBalance] =
    useApiFetch("/apims/checkBalance");

  useEffect(() => {
    if (getBalanceResponse) {
      setAvailableBalance(getBalanceResponse.result.AvailableBalance);
      setDisableTypo(true);
    }
  }, [getBalanceResponse, availableBalance]);

  //to check available balance in customer account
  const checkAvailbalance = (event) => {
    setAccountNumber(event.target.value);
  };

  useEffect(() => {
    if (accountNumber) {
      getBalance({ accountNumber: accountNumber, type: 'ignore' });
    }
  }, [accountNumber]);

  const clearBalance = () => {
    setDisableTypo(false);
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  return (
    <>
      <br />
      <Row className="">
        <h3>Lein Customer Account</h3>
      </Row>
      <Row>
        <Col span={10}>
          <Form {...formItemLayout} onFinish={onFinish} form={lienForm}>
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
              <Input
                type="number"
                style={{ width: "300px" }}
                onBlur={checkAvailbalance}
                onClick={clearBalance}
              />
            </Form.Item>
            <Form.Item
              label="Lien Amount"
              name="lienAmount"
              rules={[
                { required: true, message: "Please input the lien amount!" },
              ]}
            >
              <Input type="number" style={{ width: "300px" }} />
            </Form.Item>
            <Form.Item
              label="Lien Reason Code"
              name="reasonCode"
              rules={[
                {
                  required: true,
                  message: "Please input the lien reason code!",
                },
              ]}
            >
              <Select
                style={{ width: "300px" }}
                placeholder="choose reason code"
              >
                <Option value="CALL">Call Center</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Lien Remarks"
              name="lienRemarks"
              rules={[
                { required: true, message: "Please input the lien remarks!" },
              ]}
            >
              <Input type="text" style={{ width: "300px" }} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
            {loadingLienAccount && <Spinner/>}
          </Form>
        </Col>
        <Col span={12}>
          {disableTypo && (
            <Typography>
              The available balance in this account is {availableBalance}.
            </Typography>
          )}
        </Col>
      </Row>
    </>
  );
}

export default LienAccLayout;
