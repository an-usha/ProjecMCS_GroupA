import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Form, Input, Button, Radio, Modal } from "antd";
import "@ant-design/icons";
import { useApiFetch } from "../../hooks";
import Spinner from "../../components/Spinner";
import { Space, Table, Divider, Tag, Spin } from "antd";
import { useNotification } from "../../hooks";

function UserDetailLayout() {
  const authState = useSelector((state) => state.auth);
  const userInfo = authState?.userInfo;

  const [loadingAllUsers, allUsersResp, allUsersErr, fetchAllUsers] =
    useApiFetch("/user/getAllUsers", true);

  const [loadingCreateUser, createResp, createErr, callCreateUser] =
    useApiFetch("/user/createUser");

  const [loadingDeleteUser, deleteResp, deleteErr, callDeleteUser] =
    useApiFetch("/user/deleteUser");

  const { callNotification } = useNotification();

  const [userList, setUserList] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [form] = Form.useForm();

  const showModal = () => {
    // Prefill created_by if from userInfo
    if (userInfo) {
      form.setFieldsValue({
        created_by: `${userInfo.first_name || ""} ${userInfo.last_name || ""}`,
      });
    }
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleFormSubmit = async (values) => {
    const payload = { ...values };
    if (!payload.created_by && userInfo) {
      payload.created_by = `${userInfo.first_name || ""} ${userInfo.last_name || ""}`;
    }

    try {
      await callCreateUser({ method: "POST", data: payload });
    } catch (err) {
      console.error("Error in createUser:", err);
    }

    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 1000);
  };

  const handleDeleteUser = async (userdetailId) => {
    try {
      await callDeleteUser({ method: "POST", data: { userdetailId } });
    } catch (err) {
      console.error("Error in deleteUser:", err);
    }
  };

  // When create or delete completes, trigger refetch and notifications
  useEffect(() => {
    if (createResp) {
      if (createResp.status === true) {
        callNotification("User created successfully", "success");
        fetchAllUsers();
      } else {
        callNotification("Error creating user", "error");
      }
    }
  }, [createResp]);

  useEffect(() => {
    if (deleteResp) {
      if (deleteResp.status === true) {
        callNotification("User deleted successfully", "success");
        fetchAllUsers();
      } else {
        callNotification("Error deleting user", "error");
      }
    }
  }, [deleteResp]);

  useEffect(() => {
    if (allUsersResp?.status === true) {
      setUserList(allUsersResp.data);
    }
  }, [allUsersResp]);

  if (!userInfo) {
    // Show spinner or some placeholder while userInfo is not loaded
    return <Spinner />;
  }

  return (
    <>
      <h2>User List</h2>
      {loadingAllUsers ? (
        <Spinner />
      ) : (
        <Table
          dataSource={userList}
          columns={[
            { title: "First Name", dataIndex: "first_name", key: "first_name" },
            { title: "Last Name", dataIndex: "last_name", key: "last_name" },
            {
              title: "Gender",
              dataIndex: "gender",
              key: "gender",
              filters: [
                { text: "Male", value: "Male" },
                { text: "Female", value: "Female" },
                { text: "Other", value: "Other" },
              ],
              onFilter: (value, record) => record.gender === value,
            },
            { title: "Phone", dataIndex: "phonenumber", key: "phonenumber" },
            { title: "email", dataIndex: "emailid", key: "emailid" },
            { title: "Department", dataIndex: "department", key: "department" },
            { title: "Created By", dataIndex: "created_by", key: "created_by" },
            {
              title: "Created Date",
              dataIndex: "created_date",
              key: "created_date",
              sorter: (a, b) =>
                new Date(a.created_date) - new Date(b.created_date),
              render: (text) => (text ? text.split("T")[0] : ""),
            },
            {
              title: "Action",
              key: "action",
              render: (_, record) => (
                <Space>
                  <Button
                    danger
                    onClick={() => handleDeleteUser(record.userdetailId)}
                  >
                    Delete
                  </Button>
                </Space>
              ),
            },
          ]}
          rowKey="userdetailId"
        />
      )}

      <Button type="primary" style={{ marginTop: 16 }} onClick={showModal}>
        Create New User
      </Button>

      <Modal
        title="Create New User"
        open={open}
        onOk={() => form.submit()}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            label="First Name"
            name="first_name"
            rules={[{ required: true, message: "Please input first name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="last_name"
            rules={[{ required: true, message: "Please input last name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: "Please select gender!" }]}
          >
            <Radio.Group>
              <Radio value="Male">Male</Radio>
              <Radio value="Female">Female</Radio>
              <Radio value="Other">Other</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name="phonenumber"
            rules={[{ required: true, message: "Please input phone number!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="email"
            name="email"
            rules={[{ required: true, message: "Please input email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Department"
            name="department"
            rules={[{ required: true, message: "Please input department!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Created By"
            name="created_by"
            rules={[{ required: true, message: "Please input created by!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default UserDetailLayout;
