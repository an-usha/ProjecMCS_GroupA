import React, { useEffect, useState } from "react";
import { Form, Input, Button, Col, Row, Select, Radio, Modal } from "antd";
import "@ant-design/icons";
import { useApiFetch } from "../../hooks";
import Spinner from "../../components/Spinner";
import { Space, Table, Divider, Tag, Spin } from "antd";
import { useNotification } from "../../hooks";

function UserDetailLayout() {
  const [loadingAllUsers, getAllUsersResponse, getAllUsersError, getAllUsers] =
    useApiFetch("/user/getAllUsers");

  const [
    loadingCreateUser,
    getCreateUserResponse,
    getCreateUserError,
    createUser,
  ] = useApiFetch("/user/createUser");

  const [
    loadingDeleteUser,
    getDeleteUserResponse,
    getDeleteUserError,
    deleteUser,
  ] = useApiFetch("/user/deleteUser");

  const { callNotification } = useNotification();

  const [userList, setUserList] = useState([]);
  const [uniqueStaff, setUniqueStaff] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [form] = Form.useForm();

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const createUserLogin = async (values) => {
    await createUser(values);
  };

  const handleFormSubmit = (values) => {
    console.log(values);
    createUserLogin(values);
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 3000);
  };

  useEffect(() => {
    getAllUsers();
  }, [, getCreateUserResponse]);

  let staffArray = [];

  useEffect(() => {
    if (getAllUsersResponse) {
      console.log(getAllUsersResponse);
      if (getAllUsersResponse.status === true && getAllUsersResponse.data !== '') {
        setUserList(getAllUsersResponse.data);
        getAllUsersResponse.data.forEach((e) => {
          staffArray.push({ text: e.createdByName, value: e.createdByName });
        });
        setUniqueStaff(
          Array.from(new Set(staffArray.map((item) => item.text))).map(
            (text) => ({
              text,
              value: text,
            })
          )
        );
      }
    }
  }, [getAllUsersResponse]);

  const handleBlockUser = (id) => {
    deleteUser({ id: id });
  };

  useEffect(() => {
    if (getDeleteUserResponse) {
      if (getDeleteUserResponse.status === true) {
        callNotification("User Block Successful", "success");
        getAllUsers();
      } else if (getDeleteUserResponse.status === false) {
        callNotification("Error Occurred ", "error");
      }
    }
  }, [getDeleteUserResponse]);

  const columns = [
    {
      title: "Staff Name",
      dataIndex: "staffName",
      key: "staffName",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      filters: [
        {
          text: "Active",
          value: "Y",
        },
        {
          text: "Blocked",
          value: "N",
        },
      ],
      onFilter: (value, record) => record.isActive.startsWith(value),
      filterSearch: true,
      render: (text) => {
        return text === "Y" ? "Active" : "Blocked";
      },
    },
    {
      title: "Created By",
      dataIndex: "createdByName",
      key: "createdByName",
      filters: uniqueStaff,
      onFilter: (value, record) => record.createdByName.startsWith(value),
    },
    {
      title: "Created Date",
      dataIndex: "createdOn",
      key: "createdOn",
      sorter: (a, b) => new Date(a.createdOn) - new Date(b.createdOn),
      render: (text) => {
        const date = text.split("T");
        return date[0];
      },
    },
    {
      title: "Action",
      dataIndex: "",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {record.isActive === "Y" ? (
            <Button onClick={() => handleBlockUser(record.id)} type="primary">
              Disable User
            </Button>
          ) : null}
        </Space>
      ),
    },
  ];

  return (
    <>
      <br />
      <h3>User List for Call Center</h3>
      <div>
        {getAllUsersResponse && (
          <Table dataSource={userList} columns={columns} />
        )}
      </div>
      <div>
        <Button type="primary" onClick={showModal}>
          Create New User
        </Button>
      </div>
      <Modal
        title="Create New User | Call Center Contract Staffs"
        open={open}
        onOk={() => form.submit()}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <br />
        <Form onFinish={handleFormSubmit} form={form}>
          <Form.Item
            label="Staff Name"
            name="staffName"
            labelCol={{ span: 8 }}
            rules={[
              {
                required: true,
                message: "Please input the staff Name!",
              },
              {
                max: 30,
                message: "Staff Name can not exceed 50 characters",
              },
            ]}
          >
            <Input type="text" style={{ width: "200px" }} />
          </Form.Item>
          <Form.Item
            label="Login Username"
            name="userName"
            labelCol={{ span: 8 }}
            rules={[
              {
                required: true,
                message: "Please input the login username!",
              },
              {
                max: 20,
                message: "Login username can not exceed 20 characters",
              },
            ]}
          >
            <Input type="text" style={{ width: "200px" }} />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            labelCol={{ span: 8 }}
            rules={[
              {
                required: true,
                message: "Please input the login password!",
              },
              {
                max: 20,
                message: "Login password can not exceed 20 characters",
              },
              {
                min: 8,
                message: "Login password should be minimum 8 characters",
              },
            ]}
          >
            <Input type="password" style={{ width: "200px" }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default UserDetailLayout;
