import React, { useEffect, useState } from "react";
import {
  Layout,
  Breadcrumb,
  Button,
  Menu,
  Avatar,
  Row,
  Popover,
  Image,
  Typography,
} from "antd";
import logo from "../../assets/images/logo.svg";
import {
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";
import SideBar from "../../components/Sidebar";

import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store";
import { postLogoutData } from "../../store/slice/authSlice";

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo, loading } = useSelector((state) => state.auth);


  const staffName=userInfo?.userName?.split(' ');
  const staffNameInitial=staffName?.map(e => e[0]).join('');
  // console.log('staffNameInitial'+staffNameInitial);

  useEffect(()=>{
    if(userInfo === null){
     
        navigate("/auth/login");
      
    }
    else {

    }
  },[userInfo]);

  const handleLogout = async () => {
    dispatch(postLogoutData({'token':userInfo.token}));
    //dispatch(logout());
    //navigate("/auth/login");
  };

  const content = (
    <div style={{ width: "auto", paddingLeft: "2px", paddingRight: "2px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            gap: "0px",
          }}
        >
          <Text style={{ marginTop: "0px", fontSize: 18, fontWeight: "500" }}>
            {userInfo?.userName}
          </Text>
          <Text style={{ marginTop: "1px", fontSize: 13, color: "#606060" }}>
            {userInfo?.solDesc}
          </Text>
          {/* <Text   style={{marginTop:'-1px', fontSize:12, color:"#6D6D6D"}}>Employee Id: 1923</Text> */}
          <Text style={{ fontSize: 13, color: "#606060" }}>
            {userInfo?.email}
          </Text>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignContent: "right",
        }}
      >
        <Button
        loading = {loading}
          onClick={() => handleLogout()}
          type="primary"
          style={{ marginTop: "12px", width: "auto" }}
        >
          Log out
        </Button>
      </div>
    </div>
  );

  const handleCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsed={collapsed}
        onCollapse={handleCollapse}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "sticky",
          backgroundColor: "white",
          top: 0,
          left: 0,
        }}
      >
        <div
          className="logo"
          style={{
            display: "flex",
            width: "100%",
            marginLeft: "0px",
            marginRight: "0px",
            justifyContent: "center",
          }}
        >
          <img
            src={logo}
            style={{
              height: "40px",

              width: collapsed ? "80%" : "90%",
              marginTop: "-8px",
            }}
          />
        </div>
        <SideBar />
      </Sider>
      <Content>
        <Layout className="site-layout">
          <Header
            style={{
              background: "linear-gradient(to right, #468CC1, #3EAB94)",
              boxShadow: "0 2px 2px 0 rgba(0, 0, 0, 0.15)",
              padding: 0,
              position: "sticky",
              top: 0,
              zIndex: 1,
              width: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                marginLeft: "0px",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Button
                type="text"
                icon={
                  collapsed ? (
                    <MenuUnfoldOutlined style={{ fontSize: "20px" }} />
                  ) : (
                    <MenuFoldOutlined style={{ fontSize: "20px" }} />
                  )
                }
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  width: 56,
                  height: 56,
                  color: "white",
                  marginTop: "5px",
                  alignSelf: "center",
                }}
              />

              <h1
                style={{ color: "#fff", fontSize: "19px", fontWeight: "600" }}
              >
                Citizens Call Center
              </h1>
            </div>

            <div
              style={{ flex: "50%", textAlign: "right", marginRight: "18px" }}
            >
              <Popover
                overlayStyle={{ position: "fixed" }}
                content={content}
                title=""
                trigger="click"
                placement="topRight"
              >
                <Avatar
                  size={40}
                  style={{ cursor: "pointer", marginTop: -3 }}
                >
                    {staffNameInitial}
                </Avatar>
              </Popover>
            </div>
          </Header>
          <Content
            className="site-layout-background"
            style={{
              margin: "12px",
              padding: "10px",
              height: "100%",
              boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.05)",
            }}
          >
            <div>
              <Outlet />
            </div>
          </Content>
      
        </Layout>
      </Content>
    </Layout>
  );
};

export default AdminLayout;