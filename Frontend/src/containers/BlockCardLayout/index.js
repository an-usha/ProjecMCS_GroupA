import React, { useEffect, useState } from "react";
import { Form, Input, Button, Col, Row, Select, Radio } from "antd";
import "@ant-design/icons";
import { useApiFetch } from "../../hooks";
import { Tabs } from "antd";
import { Descriptions } from "antd";
import Spinner from "../../components/Spinner";
import { Space, Table, Divider, Tag } from "antd";
import { useNotification } from "../../hooks";

const { Option } = Select;

function BlockCardLayout() {
  const [loadingCustDet, getCustDetResponse, getCustDetError, getCustDet] =
    useApiFetch("/apims/cardCustomerEnquiry");

    const [loadingBlockCard, getBlockCardResponse, getBlockCardError, blockCard] =
    useApiFetch("/apims/cardBlock");

  const radioOptions = [
    { label: "Mobile Number", value: "mobileNo" },
    { label: "Account Number", value: "debitAccountNo" },
  ];

  const [showTextFieldMobile, setShowTextFieldMobile] = useState(false);
  const [showTextFieldAccount, setShowTextFieldAccount] = useState(false);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [cardList, setCardList] = useState([]);
  const [debitAccountNumber,setDebitAccountNumber] = useState('');

  const handleRadioChange = (e) => {
    if (e.target.value === "mobileNo") {
      setShowTextFieldMobile(true);
      setShowTextFieldAccount(false);
    } else if (e.target.value === "debitAccountNo") {
      setShowTextFieldAccount(true);
      setShowTextFieldMobile(false);
    }
  };

  useEffect(() => {
    if (getCustDetResponse) {
      console.log(getCustDetResponse);
      if (getCustDetResponse.status === true) {
        setShowCustomerDetails(true);
        setDebitAccountNumber(getCustDetResponse.data.debit.debitAccountNumber);
        const cardListJson = getCustDetResponse.data.debit.cards;
        setCardList(cardListJson);
        console.log([cardListJson]);
        //const cardList =[cardListJson];
        //console.log(cardList);
      }else if(getCustDetResponse.status === false){
        setShowCustomerDetails(false);
        callNotification("Record Not Found","error");
      }
    }
  }, [getCustDetResponse]);

  
const { callNotification } = useNotification();

  const getDebitCardCustDetail = async (values) => {
    if (values.debitAccountNumber) {
      await getCustDet({ accountNumber: values.debitAccountNumber });
    } else {
      await getCustDet({ mobileNo: values.mobileNo });
    }
  };

  const onFinish = (values) => {
    setShowCustomerDetails(false);
    getDebitCardCustDetail(values);
  };

  const handleBlockCard = async (debitAccountNumber,cardNumber) => {
    await blockCard({accountNumber:debitAccountNumber,cardNumber:cardNumber});
  };

  useEffect(()=>{
    if(getBlockCardResponse){
      console.log(getBlockCardResponse);
      if(getBlockCardResponse.status===true){
        callNotification("Card Block Successful","success");
        setShowCustomerDetails(false);
      }else if(getBlockCardResponse.status===false){
        callNotification("Error occurred","error");
      }
    }
  },[getBlockCardResponse]);

  const columns = [
    {
      title: "Card Number",
      dataIndex: "cardNumber",
      key: "cardNumber",
    },
    {
      title: "Card Holder Name",
      dataIndex: "cardHolderName",
      key: "cardHolderName",
    },
    {
      title: "Card Type",
      dataIndex: "cardType",
      key: "cardType",
    },
    {
      title: "Card Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {record.status === "Card Activated" ? (
            <Button
              onClick={() => handleBlockCard(debitAccountNumber,record.cardNumber)}
              type="primary"
            >
              Block Card
            </Button>
          ) : null}
        </Space>
      ),
    },
  ];
  const items = [
    {
      key: "1",
      label: `Account Details`,
      children: (
        <Descriptions>
          <Descriptions.Item label="Customer Name">
            {showCustomerDetails && getCustDetResponse.data.debit.customerName}
          </Descriptions.Item>
          <Descriptions.Item label="Account Number">
            {showCustomerDetails &&
              getCustDetResponse.data.debit.debitAccountNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Mobile Number">
            {showCustomerDetails && getCustDetResponse.data.debit.mobileNumber}
          </Descriptions.Item>
        </Descriptions>
      ),
    },
    {
      key: "2",
      label: `Card Details`,
      children: <Table dataSource={cardList} columns={columns} />,
    },
  ];

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 3 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  return (
    <>
      <br />
      <h3>Debit Card Inquiry/Block</h3>
      <Form onFinish={onFinish} {...formItemLayout}>
        <Form.Item
          label="Type of Card"
          name="typeOfCard"
          rules={[
            {
              required: true,
              message: "Please input the type of card",
            },
          ]}
        >
          <Select style={{ width: "300px" }} placeholder="choose type of card">
            <Option value="debit">Debit Card</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="radioGroup"
          label="Select an option"
          rules={[
            {
              required: true,
              message: "Provide mobile number or account number",
            },
          ]}
        >
          <Radio.Group options={radioOptions} onChange={handleRadioChange} />
        </Form.Item>
        {showTextFieldMobile && (
          <Form.Item
            label="Mobile Number"
            name="mobileNo"
            rules={[
              {
                required: true,
                message: "Please input the mobile number!",
              },
              {
                max: 13,
                message: "Mobile number cannot exceed 13 digits!",
              },
            ]}
          >
            <Input type="number" style={{ width: "300px" }} />
          </Form.Item>
        )}
        {showTextFieldAccount && (
          <Form.Item
            label="Account Number"
            name="debitAccountNumber"
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
        )}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            View Customer Details
          </Button>
        </Form.Item>
        {loadingCustDet && <Spinner />}
      </Form>

      <div>
        {showCustomerDetails && <Tabs defaultActiveKey="1" items={items} />}
      </div>
      <br />
      <br />
    </>
  );
}

export default BlockCardLayout;
