import React, { useEffect, useState } from "react";
import { Form, Input, Button, Col, Row, Select, Radio, Modal,DatePicker } from "antd";
import "@ant-design/icons";
import { useApiFetch } from "../../hooks";
import Spinner from "../../components/Spinner";
import { Space, Table, Divider, Tag, Spin } from "antd";
import { useNotification } from "../../hooks";

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const { RangePicker } = DatePicker;

function MissedCallLayout() {

   const [missedCallList, setMissedCallList] = useState([]);
   const [uniqueSource, setUniqueSource]= useState([]);
   const [uniqueChannel, setUniqueChannel]= useState([]);

   const [pageSize, setPageSize] = useState(10);

  const [
    loadingMissedCall,
    getMissedCallResponse,
    getMissedCallError,
    getMissedCall,
  ] = useApiFetch("/apims/missedCallList");

  const { callNotification } = useNotification();


  let numberArray=[];
  let channelArray=[];
  useEffect(() => {
    console.log(getMissedCallResponse);
    if(getMissedCallResponse !== null)
    {
        if(getMissedCallResponse.status === true){
                setMissedCallList(getMissedCallResponse.result.Data.ListResponse);
                getMissedCallResponse.result.Data.ListResponse.forEach(e => {
                  numberArray.push( {'text':e.src,'value':e.src});
                  channelArray.push({'text':e.channel,'value':e.channel});
                });
                setUniqueSource(Array.from(new Set(numberArray.map(item => item.text)))
                .map(text => ({
                  text,
                  value: text
                })));
                setUniqueChannel(Array.from(new Set(channelArray.map(item => item.text)))
                .map(text => ({
                  text,
                  value: text
                })));
        }else if(getMissedCallResponse.status === false){
            callNotification("Failed to obtain missed call list", "error");
        }   
    }

  },[getMissedCallResponse]);

  const handlePageSizeChange = (current, newSize) => {
    if (newSize === 'all') {
      setPageSize(missedCallList.length); // Set the page size to the total number of rows
    } else {
      setPageSize(Number(newSize)); // Set the page size to the selected value
    }
  };

  const columns = [
    {
      title: 'Calldate',
      dataIndex: 'calldate',
      key: 'calldate'
    },
    {
        title: 'Source',
        dataIndex: 'src',
        key: 'src',
        filters: uniqueSource,
        onFilter: (value, record) => record.src.startsWith(value),
    },
    {
        title: 'Destination',
        dataIndex: 'dst',
        key: 'dst'
    },
    {
        title: 'Channel',
        dataIndex: 'channel',
        key: 'channel',
        filters: uniqueChannel,
        onFilter :(value,record) => record.channel.startsWith(value),
    },
    {
        title: 'Dest Channel',
        dataIndex: 'dstchannel',
        key: 'dstchannel'
    },
    {
        title: 'Duration',
        dataIndex: 'duration',
        key: 'duration'
    },
    {
        title: 'Bill Time (Sec)',
        dataIndex: 'billsec',
        key: 'billsec'
    }
];

  const missedCall = async (postdata) => {
    console.log(postdata);
    await getMissedCall(postdata);
  };

  const onFinish = (values) => {
    var postdata = values;
    postdata["fromDate"] = values.stmtDateRange[0].format("YYYY-MM-DD");
    postdata["toDate"] = values.stmtDateRange[1].format("YYYY-MM-DD");
    delete postdata.stmtDateRange;
    missedCall(postdata);
  };


  const generatePDF =async () => {
    const doc = new jsPDF();
    doc.text('Call Center Missed Call Report', 10, 10);

    // Capture the Ant Design table as an image using html2canvas
    const table = document.getElementById('table');
    const canvas = await html2canvas(table);

    // Embed the captured image in the PDF
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const imgWidth = 190; // Adjust the width as needed
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    doc.addImage(imgData, 'JPEG', 10, 20, imgWidth, imgHeight);

    // Save the PDF
    doc.save('Call Center Missed Call Report.pdf');
  };


  return (
    <>
      <br />
      <div>
        <h3>Call center missed call list</h3>
      </div>
      <div>
        <Form onFinish={onFinish}>
          <Form.Item
            name="stmtDateRange"
            label="Missed Call Date Range (Start-End Date)"
            rules={[{ required: true, message: "Enter date range." }]}
          >
            <RangePicker />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
          {loadingMissedCall && <Spinner />}
        </Form>
      </div>
      <div>{getMissedCallResponse?.status===true && <Table id="table"
                                                  dataSource={missedCallList} 
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
      </div>
      {getMissedCallResponse?.status ===true &&
      <div><Button type="primary" onClick={generatePDF}>Export to PDF</Button></div>}
    </>
  );
}

export default MissedCallLayout;
