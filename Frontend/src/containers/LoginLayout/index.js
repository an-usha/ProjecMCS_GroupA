import { useEffect } from "react";
import { Form, Input, Button, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";
import "./index.css";
import Spinner from "../../components/Spinner";
import mcsWallpaper from "../../assets/images/mcsWallpaper.jpg";
import { useSelector, useDispatch } from "react-redux";
import { postLoginData, setUser } from "../../store/slice/authSlice";
import { useNotification } from "../../hooks";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.auth);
  const { callNotification } = useNotification();

  useEffect(() => {
    if (error) {
      callNotification("Login Error", "error");
      navigate("/auth/login");
    }
    if (data) {
      if (data.Code === "0" || data.status === true) {
        dispatch(
          setUser({
            userName: data.employeeName,
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
      employeename: values.username,
      password: values.password,
    };
    dispatch(postLoginData(reqData));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${mcsWallpaper})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card
        style={{
          maxWidth: "15%",
          width: "80%",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
          borderRadius: "10px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "0px" }}>
          <h3 style={{ marginTop: "6px", marginBottom: "22px" }}>
            <u>MCS Project</u><br/>
            <i>First Semester</i>
          </h3>
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
              htmlType="submit"
              className="button"
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
