import React, { useEffect, useState } from "react";
import { useApiFetch } from "../../hooks";
import {
  Form,
  Input,
  Button,
  Col,
  Row,
  Select,
  Radio,
  DatePicker,
  Table,
} from "antd";
import "@ant-design/icons";
import Spinner from "../../components/Spinner";
import { useNotification } from "../../hooks";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const { RangePicker } = DatePicker;
const { Option } = Select;

function LeinAccountRep() {
  const [showTextFieldAccount, setShowTextFieldAccount] = useState(false);
  const [showTextFieldDateRange, setShowTextFieldDateRange] = useState(false);
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [apiUrl, setApiUrl] = useState(false);
  const [trackResponse, setTrackResponse] = useState(false);

  const [leinDetails, setLeinDetails] = useState([]);

  const [uniqueStaff, setUniqueStaff]= useState([]);

  const [pageSize, setPageSize] = useState(10);

  const { callNotification } = useNotification();

  const radioOptions = [
    { label: "Account Number", value: "accountNumber" },
    { label: "Date", value: "dateRange" },
    { label: "All", value: "all" },
  ];

  const handlePageSizeChange = (current, newSize) => {
    if (newSize === 'all') {
      setPageSize(leinDetails.length); // Set the page size to the total number of rows
    } else {
      setPageSize(Number(newSize)); // Set the page size to the selected value
    }
  };

  const handleRadioChange = (e) => {
    setShowTextFieldAccount(false);
    setShowTextFieldDateRange(false);
    if (e.target.value === "accountNumber") {
      setShowTextFieldAccount(true);
      setApiUrl("/lein/leinRequstByAccount");
      setTrackResponse(false);
    } else if (e.target.value === "dateRange") {
      setShowTextFieldDateRange(true);
      setApiUrl("/lein/leinRequstByDate");
      setTrackResponse(false);
    } else if (e.target.value === "all") {
      setApiUrl("/lein/leinRequstDet");
      setTrackResponse(false);
    }
    setShowSubmitButton(true);
  };

  const [loadingLeinDet, getResponse, getLeinDetError, getLeinDet] =
    useApiFetch(apiUrl);

let staffArray=[];

  useEffect(() => {
    if (getResponse) {
      setLeinDetails(getResponse.data);
      getResponse.data.forEach(e => {
        staffArray.push( {'text':e.createdByName,'value':e.createdByName});
      });
      setUniqueStaff(Array.from(new Set(staffArray.map(item => item.text)))
      .map(text => ({
        text,
        value: text
      })));
      if (getResponse.data) {
        if (getResponse.data.length !== 0) {
          setTrackResponse(true);
        } else if (getResponse.data.length === 0) {
          setTrackResponse(false);
          callNotification("No Records Found", "success");
        }
      }
      console.log(leinDetails);
    }
  }, [getResponse]);

  const columns = [
    {
      title: "Account Number",
      dataIndex: "accountNumber",
      key: "accountNumber",
    },
    {
      title: "Lein Amount",
      dataIndex: "lienAmount",
      key: "lienAmount",
      defaultSortOrder: '',
      sorter: (a, b) => a.lienAmount - b.lienAmount,
    },
    {
      title: "Reason Code",
      dataIndex: "reasonCode",
      key: "reasonCode",
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
    },
    {
      title: "Lein By",
      dataIndex: "createdByName",
      key: "createdByName",
      filters: uniqueStaff,
      onFilter: (value, record) => record.createdByName.startsWith(value),
    },
    {
      title: "Lein On",
      dataIndex: "createdOn",
      key: "createdOn",
      sorter: (a, b) => new Date(a.createdOn) - new Date(b.createdOn),
      render: (text) => {
        const date = text.split("T");
        return date[0];
      },
    },
  ];

  const getLeinDetAccount = (accountNumber) => {
    getLeinDet({ accountNumber: accountNumber });
  };

  const getLeinDetDate = (fromDate, toDate) => {
    getLeinDet({ fromDate: fromDate, toDate: toDate });
  };

  const getLeinDetAll = () => {
    getLeinDet();
  };

  const onFinish = (values) => {
    if (values.radioGroup === "accountNumber") {
      getLeinDetAccount(values.accountNumber);
    } else if (values.radioGroup === "dateRange") {
      let fromDate = values.cardBlockDateRange[0].format("YYYY-MM-DD");
      let toDate = values.cardBlockDateRange[1].format("YYYY-MM-DD");
      getLeinDetDate(fromDate, toDate);
    } else if (values.radioGroup === "all") {
      getLeinDetAll();
    }
  };

  const generatePDF =async () => {
    const doc = new jsPDF();
    doc.text('Account Lien Report', 10, 10);

    // Capture the Ant Design table as an image using html2canvas
    const table = document.getElementById('table');
    const canvas = await html2canvas(table);

    // Embed the captured image in the PDF
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const imgWidth = 190; // Adjust the width as needed
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    doc.addImage(imgData, 'JPEG', 10, 20, imgWidth, imgHeight);

    // Save the PDF
    doc.save('Account Lien - Report.pdf');
  };

  return (
    <>
      <br />
      <h3>Check Lein Account Report</h3>
      <Form onFinish={onFinish}>
        <Form.Item
          name="radioGroup"
          label="Select an option"
          rules={[
            {
              required: true,
              message: "select an option",
            },
          ]}
        >
          <Radio.Group options={radioOptions} onChange={handleRadioChange} />
        </Form.Item>
        {showTextFieldAccount && (
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
        )}
        {showTextFieldDateRange && (
          <Form.Item
            name="cardBlockDateRange"
            label="Card Block Date Range (Start-End Date)"
            rules={[{ required: true, message: "Enter date range." }]}
          >
            <RangePicker />
          </Form.Item>
        )}
        {showSubmitButton && (
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        )}
        {loadingLeinDet && <Spinner />}
      </Form>
      {trackResponse && <Table id="table" 
                        dataSource={leinDetails} 
                        columns={columns}
                        pagination={{
                            pageSize,
                            pageSizeOptions:['10','20','50','all'],
                            showSizeChanger:true,
                            showTotal: (total, range) =>
                            `Displaying ${range[0]}-${range[1]} of ${total} items`,
                            onShowSizeChange: handlePageSizeChange,
                        }}
                        />}
      {trackResponse && <div>
      <Button type="primary" onClick={generatePDF}>Export to PDF</Button>
    </div>}
    </>
  );
}

export default LeinAccountRep;
