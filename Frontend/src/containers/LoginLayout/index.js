import React, { useEffect } from "react";
import { useApiFetch } from "../../hooks";
import { Form, Input, Button, Layout, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";
import "./index.css";
import Spinner from "../../components/Spinner";
import axios from "axios";
import { BACKEND_URL } from "./../../config";
import logo from "../../assets/images/logo.svg";
import { useSelector, useDispatch } from "react-redux";
import { postLoginData, setUser } from "../../store/slice/authSlice";
import { useNotification } from "../../hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeadphones } from "@fortawesome/free-solid-svg-icons";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data, loading, error } = useSelector((state) => state.auth);


  useEffect(() => {
    if (error) {
      callNotification("Login Error", "error");
      navigate("/auth/login");
    }
    if (data) {
      if (data.Code === "0") {
        dispatch(
          setUser({
            userName: data.Data?.employeeName,
            solId: data.Data?.solId,
            email: data.Data?.email,
            departmentName: data.Data?.departmentName,
            token: data.Data?.token,
            domainName: data.Data?.domainUserName,
            solDesc: data.Data?.solDesc,
            designation: data.Data?.designation,
            functionalTitle: data.Data?.functionalTitle,
            photoId: data.Data?.photo,
            image:data.Data?.image,
          })
        );

        navigate("/");
        callNotification("Login Success", "success");
      } else {
        callNotification("Login Denied", "error");
      }
    }
  }, [data, error]);


  const onFinish = async (values) => {
    const reqData = {
      username: values.username.replace("@ctznbank.com", ""),
      password: values.password,
    };
    dispatch(postLoginData(reqData));
  };

  const { callNotification } = useNotification();

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(90deg, rgba(13,102,177,1) 0%, rgba(42,136,144,1) 50%, rgba(39,149,114,1) 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card
        style={{
          maxWidth: "25%",
          margin: "0 auto",
          boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "0px" }}>
          <img src={logo} alt="Logo" style={{ height: 80, width: "90%" }} />
          <div>
            <h3 style={{ marginTop: "6px", marginBottom: "22px" }}>
              <u>Citizen Call Center</u> &nbsp;&nbsp;&nbsp;
              <FontAwesomeIcon icon={faHeadphones} beat size="2xl" />
            </h3>
          </div>
        </div>

        <Form name="login-form" onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please enter your username!",
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please enter your password!",
              },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: "100%",
                boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
              }}
            >
              Log In
            </Button>
          </Form.Item>
          {loading && <Spinner />}
          <Outlet />
        </Form>
      </Card>
    </div>
  );
}
