import React, { useEffect, useState } from "react";
import { Form, Input, Button, Col, Row, Select, Radio, Modal,DatePicker } from "antd";
import "@ant-design/icons";
import { useApiFetch } from "../../hooks";
import Spinner from "../../components/Spinner";
import { Space, Table, Divider, Tag, Spin } from "antd";
import { useNotification } from "../../hooks";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";

import * as XLSX from 'xlsx';

const { RangePicker } = DatePicker;

function MissedCallRemarksLayout(){
  const [missedCallList, setMissedCallList] = useState([]);
  const [uniqueSource, setUniqueSource]= useState([]);
  const [uniqueChannel, setUniqueChannel]= useState([]);
  const [pageSize, setPageSize] = useState(10);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [modalData, setModalData] = useState('');
  const [enableOkButton, setEnableOkButton] = useState(false);

  const [
    loadingMissedCall,
    getMissedCallResponse,
    getMissedCallError,
    getMissedCall,
  ] = useApiFetch("/missedCall/getMissedCallListByDate");

  const [
    loadingMissedCallRemarks,
    getMissedCallRemarksResponse,
    getMissedCallRemarksError,
    getMissedCallRemarks,
  ] = useApiFetch("/missedCall/provideRemarksMissedCall");

  const { callNotification } = useNotification();

  let numberArray=[];
  let channelArray=[];
  useEffect(() => {
    console.log(getMissedCallResponse);
    if(getMissedCallResponse !== null)
    {
        if(getMissedCallResponse.status === true){
                setMissedCallList(getMissedCallResponse.data);
                getMissedCallResponse.data.forEach(e => {
                  numberArray.push( {'text':e.source,'value':e.source});
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


  useEffect(()=>{
      if(getMissedCallRemarksResponse !==null){
        if(getMissedCallRemarksResponse.status === true){
              console.log(getMissedCallRemarksResponse.data[0].id);
              console.log(getMissedCallRemarksResponse.data[0]);
              const missedCallListData = missedCallList.filter((item)=> item.id !== getMissedCallRemarksResponse.data[0].id);
              missedCallListData.push(getMissedCallRemarksResponse.data[0]);
              setMissedCallList(missedCallListData)
                //missedCallList[getMissedCallRemarksResponse.data[0].id]=getMissedCallRemarksResponse.data[0];
              callNotification("Remarks Addeed Successfully","success");
        }else if(getMissedCallRemarksResponse.status===false){
          callNotification("Failed to provide missed call remarks","error");
        }
      }
  },[getMissedCallRemarksResponse]);

  const handlePageSizeChange = (current, newSize) => {
    if (newSize === 'all') {
      setPageSize(missedCallList.length); // Set the page size to the total number of rows
    } else {
      setPageSize(Number(newSize)); // Set the page size to the selected value
    }
  };

  const handleTrackingRemarksChange = (event) =>{
    const modal = {...modalData}
    //console.log(event.target.value !== "")
    if(["N/A", ""].includes(event.target.value) ){
      setEnableOkButton(false)
    }
    else {
      setEnableOkButton(modal.remarks !== event.target.value)
    }
    modal.remarks = event.target.value
    setModalData(modal)

  }

  const handleEdit = (record)=>{
    setIsEditModalVisible(true);
    setModalData(record);
  };

  const handleDetail = (record)=>{
    setIsModalVisible(true);
    setModalData(record);
  }

  const handleOk = () =>{
    //console.log('error');
    setIsModalVisible(false);
  };

  const handleEditModalOk = async() =>{
    setEnableOkButton(false);
    var postdata={};
    postdata["id"]=modalData.id;
    postdata["remarks"]=modalData.remarks;
    await getMissedCallRemarks(postdata);
    setIsEditModalVisible(false);
    setModalData('');
  };

  const handleModalCancel= () =>{
    setIsModalVisible(false);
    setIsEditModalVisible(false);
    setEnableOkButton(false)
  };

  const columns = [
    {
      title: 'Calldate',
      dataIndex: 'calldate',
      key: 'calldate'
    },
    {
        title: 'Source',
        dataIndex: 'source',
        key: 'source',
        filters: uniqueSource,
        onFilter: (value, record) => record.source.startsWith(value),
    },
    {
        title: 'Destination',
        dataIndex: 'destination',
        key: 'destination'
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
        dataIndex: 'destChannel',
        key: 'destChannel'
    },
    {
        title: 'Duration',
        dataIndex: 'duration',
        key: 'duration'
    },
    {
        title: 'Bill Time (Sec)',
        dataIndex: 'billtime',
        key: 'billtime'
    },
    {
      title: 'Detail',
      dataIndex: '',
      key: 'detail',
      render: (_, record) =>(
        <Space size="middle">
          <Button onClick={()=> handleDetail(record)} type="primary" >
                <EyeOutlined /> 
            </Button>
        </Space>
    ),
    },
    {
      title:'Edit',
      dataIndex: '',
      key : 'edit',
      render: (_, record) =>(
        <Space size="middle">
          <Button 
                onClick={()=> handleEdit(record)} 
                type="primary" 
                // disabled={record.remEnteredBy!==null || record.solId!==userInfo.solId}
                 disabled={record.remarksProvidedBy!==null}
                >
                <EditOutlined /> 
            </Button>
        </Space>
    ),
    }
];

const missedCall = async (postdata) => {
  console.log(postdata);
  await getMissedCall(postdata);
};

  const onFinish = (values) => {
    var postdata = values;
    postdata["dateFrom"] = values.missedCallRemarksDateRange[0].format("YYYY-MM-DD");
    postdata["dateTo"] = values.missedCallRemarksDateRange[1].format("YYYY-MM-DD");
    delete postdata.missedCallRemarksDateRange;
    missedCall(postdata);
  };

  const downloadRemarksProvidedReport=()=>{
    const ws = XLSX.utils.json_to_sheet(missedCallList);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'missed call remark');
    XLSX.writeFile(wb, `Call Center Missed Call Remark.xlsx`);
   // alert ("Donwload summary Report");
}

    return (
        <>
          <br />
          <div>
            <h3>Provide Remarks - Call center missed call list</h3>
          </div>
          <div>
        <Form onFinish={onFinish}>
          <Form.Item
            name="missedCallRemarksDateRange"
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
      <div>
      <Modal title="Call Center -- Missed Call Detail"
                  open={isModalVisible}
                  onCancel={handleModalCancel}
                  //onOk={handleOk}
                  footer={
                    [<Button key="submit" type="primary" onClick={handleOk}>Ok</Button>] 
                  }>
                    <p>
                    Calldate: <span style={{fontWeight:800, marginLeft:12}}>{modalData.calldate} </span><br/>
                    Source: <span style={{fontWeight:800, marginLeft:12}}>{modalData.source} </span><br/>
                    Destination: <span style={{fontWeight:800, marginLeft:12}}>{modalData.destination} </span><br/>
                    Channel: <span style={{fontWeight:800, marginLeft:12}}>{modalData.channel} </span><br/>
                    Dest Channel: <span style={{fontWeight:800, marginLeft:12}}>{modalData.destChannel} </span><br/>
                    Duration: <span style={{fontWeight:800, marginLeft:12}}>{modalData.duration} </span><br/>
                    Bill Time (sec): <span style={{fontWeight:800, marginLeft:12}}>{modalData.billtime} </span><br/>
                    Remarks: <br/><textarea style={{fontWeight:800}} cols={50} rows={5} value={modalData.remarks === null ? 'N/A' : modalData.remarks}> </textarea> <br/>
                    Staff Domain/Username:<span style={{fontWeight:800, marginLeft:12}}> {modalData.remarksProvidedBy === null ? 'N/A' : modalData.remarksProvidedBy} </span><br/>
                    Staff Name:<span style={{fontWeight:800, marginLeft:12}}> {modalData.remarksProvidedByName === null ? 'N/A' : modalData.remarksProvidedByName} </span><br/>
                    Remarks Provided Date:<span style={{fontWeight:800, marginLeft:12}}> {modalData.remarksProvidedOn === null ? 'N/A' : modalData.remarksProvidedOn} </span>
                  </p>
      </Modal>
      </div>
      <div>
      <Modal title="Call Center -- Please provide missed call remarks"
                  open={isEditModalVisible}
                  onCancel={handleModalCancel}
                  onOk={handleEditModalOk}
                  okButtonProps={{disabled: !enableOkButton }}
                  >
                    <p>
                    Calldate: <span style={{fontWeight:800, marginLeft:12}}>{modalData.calldate} </span><br/>
                    Source: <span style={{fontWeight:800, marginLeft:12}}>{modalData.source} </span><br/>
                    Destination: <span style={{fontWeight:800, marginLeft:12}}>{modalData.destination} </span><br/>
                    Channel: <span style={{fontWeight:800, marginLeft:12}}>{modalData.channel} </span><br/>
                    Dest Channel: <span style={{fontWeight:800, marginLeft:12}}>{modalData.destChannel} </span><br/>
                    Duration: <span style={{fontWeight:800, marginLeft:12}}>{modalData.duration} </span><br/>
                    Bill Time (sec): <span style={{fontWeight:800, marginLeft:12}}>{modalData.billtime} </span><br/>
                    Remarks: <br/><textarea style={{fontWeight:800}} cols={50} rows={5} value={modalData.remarks === null ? 'N/A' : modalData.remarks} onChange={handleTrackingRemarksChange}> </textarea> <br/>
                    </p>
      </Modal>
      </div>

      <div>
      {getMissedCallResponse?.status===true && 
            <Form onFinish={downloadRemarksProvidedReport}>
                <Form.Item>
                        <Button type="primary" htmlType="submit">
                                Download Report
                        </Button>
            </Form.Item>
            </Form>
}
        </div>
        </>
        );
}

export default MissedCallRemarksLayout;